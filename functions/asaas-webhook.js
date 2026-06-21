/* ============================================================
 *  LinguoBound — Asaas webhook (the ONLY thing that grants 'pro')
 *
 *  Firestore rules forbid clients from changing their own
 *  users/{uid}.plan / subscription, so a paid upgrade can ONLY happen
 *  here, via the Firebase Admin SDK (which bypasses rules). The browser
 *  checkout merely records intent and redirects to Asaas's hosted page;
 *  Asaas then notifies THIS endpoint, and we grant / revoke the tier.
 *
 *  AUTH: Asaas sends the token you configured (when creating the webhook)
 *  in the `asaas-access-token` header. We verify it against
 *  ASAAS_WEBHOOK_TOKEN before trusting any event.
 *
 *  EVENTS handled (docs.asaas.com → payment-events / subscription-events):
 *   - PAYMENT_CONFIRMED / PAYMENT_RECEIVED        -> grant tier (active)
 *   - PAYMENT_OVERDUE                             -> mark past_due
 *   - PAYMENT_REFUNDED / _DELETED                 -> revoke (free)
 *   - SUBSCRIPTION_INACTIVATED / _DELETED         -> revoke (free)
 *
 *  REQUIRED ENV (never commit):
 *   - ASAAS_WEBHOOK_TOKEN   token configured on the Asaas webhook
 *   - GOOGLE_APPLICATION_CREDENTIALS for the Admin SDK
 * ============================================================ */

"use strict";

const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || "";

const GRANT_EVENTS = ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED", "PAYMENT_RECEIVED_IN_CASH"];
const REVOKE_EVENTS = ["PAYMENT_REFUNDED", "PAYMENT_DELETED", "PAYMENT_CHARGEBACK_REQUESTED",
                       "SUBSCRIPTION_INACTIVATED", "SUBSCRIPTION_DELETED"];
const PASTDUE_EVENTS = ["PAYMENT_OVERDUE"];

/** Resolve the order (and thus uid + tier) from an Asaas event. */
async function resolveOrder(payload) {
  const payment = payload.payment || null;
  const subscription = payload.subscription || null;

  // Preferred: externalReference on the payment == our orderId.
  let orderId = payment && payment.externalReference;
  if (orderId) {
    const snap = await db.collection("orders").doc(orderId).get();
    if (snap.exists) return { ref: snap.ref, order: snap.data() };
  }
  // Fallback: look up by Asaas subscription id.
  const subId = (payment && payment.subscription) || (subscription && subscription.id) ||
                (subscription && subscription.externalReference);
  if (subId) {
    const q = await db.collection("orders").where("asaasSubscriptionId", "==", subId).limit(1).get();
    if (!q.empty) return { ref: q.docs[0].ref, order: q.docs[0].data() };
  }
  return null;
}

async function setUserPlan(uid, plan, statusFields) {
  const now = admin.firestore.Timestamp.now();
  await db.collection("users").doc(uid).set(
    {
      plan: plan,
      subscription: Object.assign(
        { provider: "asaas", updatedAt: now },
        statusFields || {}
      ),
      updatedAt: now,
    },
    { merge: true }
  );
}

async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).send("method not allowed");

    // Verify the Asaas authentication token.
    const token = req.get("asaas-access-token") || (req.headers && req.headers["asaas-access-token"]);
    if (ASAAS_WEBHOOK_TOKEN && token !== ASAAS_WEBHOOK_TOKEN) {
      console.warn("[asaas-webhook] bad token");
      return res.status(401).send("unauthorized");
    }

    const payload = req.body || {};
    const event = payload.event;
    if (!event) return res.status(200).send("no event");

    const resolved = await resolveOrder(payload);
    if (!resolved) { console.warn("[asaas-webhook] order not found for", event); return res.status(200).send("no order"); }

    const { ref, order } = resolved;
    const uid = order.uid;
    const tier = order.tier === "pro_global" ? "pro_global" : "pro";
    const now = admin.firestore.Timestamp.now();
    const payment = payload.payment || {};

    if (GRANT_EVENTS.indexOf(event) !== -1) {
      // Idempotent grant.
      const periodDays = order.cycle === "YEARLY" ? 365 : 30;
      const periodEnd = admin.firestore.Timestamp.fromMillis(now.toMillis() + periodDays * 86400000);
      await setUserPlan(uid, tier, {
        status: "active",
        externalId: String(order.asaasSubscriptionId || payment.subscription || payment.id || ""),
        lastPaymentId: String(payment.id || ""),
        currentPeriodEnd: periodEnd,
      });
      await ref.set({ status: "paid", paidAt: now, lastEvent: event }, { merge: true });
      console.log("[asaas-webhook] granted", { uid, tier, event });
    } else if (PASTDUE_EVENTS.indexOf(event) !== -1) {
      await setUserPlan(uid, tier, { status: "past_due" });
      await ref.set({ status: "past_due", lastEvent: event }, { merge: true });
    } else if (REVOKE_EVENTS.indexOf(event) !== -1) {
      // Pull access back to free.
      await setUserPlan(uid, "free", { status: "cancelled", cancelledAt: now });
      await ref.set({ status: "revoked", lastEvent: event }, { merge: true });
      console.log("[asaas-webhook] revoked", { uid, event });
    } else {
      // Acknowledge other events (created/updated) without changing access.
      await ref.set({ lastEvent: event, lastEventAt: now }, { merge: true });
    }

    return res.status(200).send("ok"); // 200 so Asaas marks it delivered
  } catch (err) {
    console.error("[asaas-webhook]", err);
    return res.status(500).send("error");
  }
}

module.exports = { handler, resolveOrder };

/* --- Firebase Cloud Functions entry (Blaze) ---
const functions = require("firebase-functions");
exports.asaasWebhook = functions.https.onRequest(handler);
----------------------------------------------- */
