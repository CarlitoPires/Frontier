/* ============================================================
 *  LinguoBound — Asaas: create subscription (server-side)
 *
 *  The browser cannot create an Asaas subscription, because that needs
 *  the SECRET API key. This endpoint does it server-side, then returns
 *  the hosted `invoiceUrl` (Asaas's PCI-compliant payment page) for the
 *  browser to redirect to.
 *
 *  It grants NO access. The 'pro' tier is only ever granted by the Asaas
 *  webhook (asaas-webhook.js) after payment is confirmed/received.
 *
 *  REQUIRED ENV (never commit):
 *   - ASAAS_API_KEY   Asaas secret API key ($aact_…)
 *   - ASAAS_API_BASE  (optional) defaults to https://api.asaas.com/v3
 *                     sandbox: https://api-sandbox.asaas.com/v3
 *   - GOOGLE_APPLICATION_CREDENTIALS for the Admin SDK (to read the order)
 *
 *  REQUEST  (POST, JSON):
 *   { orderId, uid, planId, billingType, email, name, cpfCnpj, returnUrl }
 *  RESPONSE (200): { invoiceUrl, subscriptionId, customerId, orderId }
 * ============================================================ */

"use strict";

const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || "";
const ASAAS_API_BASE = process.env.ASAAS_API_BASE || "https://api.asaas.com/v3";
const _fetch = global.fetch || ((...a) => import("node-fetch").then(({ default: f }) => f(...a)));

// Server-side source of truth for plan pricing (never trust the client).
const PLAN_CATALOG = {
  resident_monthly: { tier: "pro",        cycle: "MONTHLY", value: 49.90, description: "LinguoBound — Resident (monthly)" },
  citizen_annual:   { tier: "pro",        cycle: "YEARLY",  value: 397.00, description: "LinguoBound — Citizen (annual)" },
  global_annual:    { tier: "pro_global", cycle: "YEARLY",  value: 597.00, description: "LinguoBound — Global Citizen (annual)" },
};

function asaas(path, method, body) {
  return _fetch(ASAAS_API_BASE + path, {
    method: method || "GET",
    headers: { "Content-Type": "application/json", access_token: ASAAS_API_KEY },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (r) => {
    const json = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error("Asaas " + path + " -> " + r.status + " " + JSON.stringify(json));
    return json;
  });
}

function todayISO() { return new Date().toISOString().slice(0, 10); } // YYYY-MM-DD

function cors(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
    if (!ASAAS_API_KEY) return res.status(500).json({ error: "ASAAS_API_KEY not set" });

    const { orderId, uid, planId, billingType, email, name, cpfCnpj, returnUrl } = req.body || {};
    const plan = PLAN_CATALOG[planId];
    if (!orderId || !uid || !plan) return res.status(400).json({ error: "invalid order/plan" });

    // Cross-check the intent doc the client wrote (defence in depth).
    const orderSnap = await db.collection("orders").doc(orderId).get();
    if (!orderSnap.exists || orderSnap.data().uid !== uid) {
      return res.status(400).json({ error: "order not found for user" });
    }

    // 1) Create (or reuse) the Asaas customer.
    const customer = await asaas("/customers", "POST", {
      name: name || email || "LinguoBound Citizen",
      email: email || undefined,
      cpfCnpj: cpfCnpj || undefined,
      externalReference: uid,
    });

    // 2) Create the subscription. billingType UNDEFINED lets the buyer pick
    //    any method on the hosted page; otherwise honour the chosen one.
    const subscription = await asaas("/subscriptions", "POST", {
      customer: customer.id,
      billingType: billingType || "UNDEFINED",
      value: plan.value,
      nextDueDate: todayISO(),
      cycle: plan.cycle,
      description: plan.description,
      externalReference: orderId,
      callback: returnUrl ? { successUrl: returnUrl, autoRedirect: true } : undefined,
    });

    // 3) Fetch the first generated payment to get its hosted invoiceUrl.
    const payments = await asaas("/subscriptions/" + subscription.id + "/payments", "GET");
    const first = (payments && payments.data && payments.data[0]) || null;
    const invoiceUrl = first && first.invoiceUrl;
    if (!invoiceUrl) throw new Error("no invoiceUrl on first payment");

    // 4) Annotate the order with Asaas ids (does NOT grant access).
    await db.collection("orders").doc(orderId).set(
      {
        provider: "asaas",
        asaasCustomerId: customer.id,
        asaasSubscriptionId: subscription.id,
        status: "awaiting_payment",
        invoiceUrl: invoiceUrl,
        updatedAt: admin.firestore.Timestamp.now(),
      },
      { merge: true }
    );

    return res.status(200).json({
      invoiceUrl: invoiceUrl,
      subscriptionId: subscription.id,
      customerId: customer.id,
      orderId: orderId,
    });
  } catch (err) {
    console.error("[asaas-create-subscription]", err);
    return res.status(500).json({ error: "subscription_failed" });
  }
}

module.exports = { handler };

/* --- Firebase Cloud Functions entry (Blaze) ---
const functions = require("firebase-functions");
exports.asaasCreateSubscription = functions.https.onRequest(handler);
----------------------------------------------- */
