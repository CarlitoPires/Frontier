/* ============================================================
 *  LinguoBound — Mercado Pago webhook (the ONLY thing that grants 'pro')
 *
 *  This is the trusted server component. Firestore Security Rules forbid
 *  clients from changing their own users/{uid}.plan or subscription, so a
 *  paid upgrade can ONLY happen here, via the Firebase Admin SDK (which
 *  bypasses rules). The browser checkout merely records intent and hands
 *  off to Mercado Pago's hosted page; Mercado Pago then notifies THIS
 *  endpoint, we verify the payment against the MP API with the SECRET
 *  access token, and we flip the tier.
 *
 *  DEPLOY OPTIONS
 *   A) Firebase Cloud Functions (requires the Blaze plan):
 *        exports.mercadopago = functions.https.onRequest(handler)
 *   B) Any Node host (Cloud Run / Render / Railway / a VPS): mount
 *        app.post('/webhooks/mercadopago', (req,res)=>handler(req,res))
 *
 *  REQUIRED ENV (never commit these):
 *   - MP_ACCESS_TOKEN     Mercado Pago secret access token (APP_USR-…)
 *   - MP_WEBHOOK_SECRET   (optional) signing secret to verify x-signature
 *   - FIREBASE_* / GOOGLE_APPLICATION_CREDENTIALS for the Admin SDK
 *
 *  Configure your Mercado Pago application's webhook/IPN URL to point at
 *  the deployed endpoint, subscribing to "payment" events.
 * ============================================================ */

"use strict";

const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const MP_API = "https://api.mercadopago.com";

// node18+ has global fetch; otherwise `npm i node-fetch` and require it.
const _fetch = global.fetch || ((...a) => import("node-fetch").then(({ default: f }) => f(...a)));

/** Fetch the authoritative payment record from Mercado Pago. */
async function getPayment(paymentId) {
  const res = await _fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`MP payment fetch failed: ${res.status}`);
  return res.json();
}

/** Map an approved payment to the user + tier, then grant access. */
async function grantAccess(payment) {
  // external_reference is the orderId we set in checkout.js.
  const orderId = payment.external_reference;
  if (!orderId) throw new Error("payment missing external_reference");

  const orderRef = db.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new Error(`order not found: ${orderId}`);
  const order = orderSnap.data();

  const uid = order.uid;
  const tier = order.tier === "pro_global" ? "pro_global" : "pro";

  // Idempotency: if already paid, do nothing.
  if (order.status === "paid") return { uid, tier, alreadyPaid: true };

  const now = admin.firestore.Timestamp.now();
  const periodDays = order.billing === "annual" ? 365 : 30;
  const periodEnd = admin.firestore.Timestamp.fromMillis(now.toMillis() + periodDays * 86400000);

  const batch = db.batch();
  batch.update(orderRef, {
    status: "paid",
    paymentId: String(payment.id),
    paidAt: now,
  });
  batch.set(
    db.collection("users").doc(uid),
    {
      plan: tier,
      subscription: {
        provider: "mercadopago",
        status: "active",
        externalId: String(payment.id),
        currentPeriodEnd: periodEnd,
      },
      updatedAt: now,
    },
    { merge: true }
  );
  await batch.commit();
  return { uid, tier, granted: true };
}

/** Optional: validate Mercado Pago's x-signature header (recommended). */
function signatureValid(req) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // skip if not configured
  // Implement HMAC verification per Mercado Pago docs (ts + data id).
  // Left as a clearly-marked extension point; returning true if unset.
  return true;
}

/** Main HTTP handler (framework-agnostic: works for onRequest or Express). */
async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).send("method not allowed");
    if (!MP_ACCESS_TOKEN) { console.error("MP_ACCESS_TOKEN not set"); return res.status(500).send("misconfigured"); }
    if (!signatureValid(req)) return res.status(401).send("bad signature");

    const body = req.body || {};
    const type = body.type || body.topic;
    const paymentId =
      (body.data && body.data.id) ||
      (req.query && (req.query["data.id"] || req.query.id)) ||
      body.resource;

    // We only act on payment notifications.
    if (type && String(type).indexOf("payment") === -1) return res.status(200).send("ignored");
    if (!paymentId) return res.status(200).send("no payment id");

    const payment = await getPayment(paymentId);
    if (payment.status === "approved") {
      const result = await grantAccess(payment);
      console.log("[mercadopago] access granted", result);
    } else {
      // record failed/pending without granting access
      const orderId = payment.external_reference;
      if (orderId) {
        await db.collection("orders").doc(orderId).set(
          { status: payment.status === "pending" || payment.status === "in_process" ? "pending" : "failed", paymentId: String(payment.id) },
          { merge: true }
        );
      }
    }
    return res.status(200).send("ok"); // 200 so MP stops retrying
  } catch (err) {
    console.error("[mercadopago] webhook error", err);
    return res.status(500).send("error");
  }
}

module.exports = { handler, grantAccess, getPayment };

/* --- Firebase Cloud Functions entry (uncomment when deploying on Blaze) ---
const functions = require("firebase-functions");
exports.mercadopago = functions.https.onRequest(handler);
--------------------------------------------------------------------------- */
