/* ============================================================
 *  LinguoBound — Checkout engine (Mercado Pago + Firestore)
 *
 *  FLOW (Spark-friendly, secure):
 *   1. User picks a plan -> openCheckout(planId).
 *   2. Must be a signed-in citizen (we link the order to their uid).
 *   3. We write an ORDER INTENT to orders/{orderId} (owner-writable;
 *      see firestore.rules). This is just intent — NOT access.
 *   4. We hand off to Mercado Pago's PCI-compliant hosted checkout
 *      (supports PIX + credit card), passing external_reference=orderId
 *      and a back_url that returns here.
 *   5. Mercado Pago confirms the payment to a SERVER WEBHOOK
 *      (functions/mercadopago-webhook.js). The webhook — using the
 *      Admin SDK — is the ONLY thing allowed to set users/{uid}.plan
 *      = "pro". Clients cannot self-promote (Firestore rules enforce it).
 *   6. On return, we poll users/{uid} until the webhook flips the plan,
 *      then show success.
 *
 *  WHY no in-page card form? Charging a card needs the secret access
 *  token, which must never reach the browser. Hosted checkout keeps us
 *  PCI-safe with zero backend at runtime. Everything UP TO the hand-off
 *  is fully in-brand.
 * ============================================================ */

import {
  auth, db, onAuthStateChanged,
  doc, getDoc, setDoc, serverTimestamp, CONFIG_READY,
} from "./firebase-init.js";
import { PLANS, DEFAULT_PLAN_ID, PAYMENTS_CONFIG } from "./payments-config.js";

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const t = (k, p) => (window.I18n ? I18n.t(k, p) : k);
  const PENDING_KEY = "linguobound.pendingOrder";

  const overlay = $("co-overlay");
  if (!overlay) return;                       // not on the pricing page

  const STATES = ["form", "redirecting", "confirming", "success", "pending", "failed", "needlogin"];
  const stateEls = {};
  STATES.forEach((s) => (stateEls[s] = $("co-" + s)));

  let currentUser = null;
  let currentProfile = null;
  let selectedPlanId = DEFAULT_PLAN_ID;
  let selectedMethod = "pix";

  /* ---------- modal plumbing ---------- */
  function showState(name) {
    STATES.forEach((s) => { if (stateEls[s]) stateEls[s].hidden = s !== name; });
  }
  function openModal() { overlay.classList.add("open"); overlay.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeModal() { overlay.classList.remove("open"); overlay.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }

  $("co-close") && $("co-close").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("open")) closeModal(); });

  /* ---------- render the order form ---------- */
  function renderForm() {
    const plan = PLANS[selectedPlanId];
    if (!plan) return;
    $("co-plan-name").textContent = t(plan.nameKey);
    $("co-plan-billing").textContent = t(plan.billing === "annual" ? "lp.billAnnual" : "lp.billMonthly");
    $("co-plan-price").textContent = plan.displayPrice + " " + t(plan.perKey);
    $("co-recurring").textContent = t("pay.recurring", { plan: t(plan.nameKey) });

    // payment-method segmented control
    document.querySelectorAll(".co-method").forEach((b) => {
      const on = b.dataset.method === selectedMethod;
      b.classList.toggle("active", on);
    });

    // identity / auth gate
    const acct = $("co-account");
    const loginBtn = $("co-login-btn");
    const payBtn = $("co-pay");
    if (currentUser) {
      acct.hidden = false;
      $("co-account-email").textContent = (currentProfile && currentProfile.email) || currentUser.email || "—";
      loginBtn.hidden = true;
      payBtn.disabled = false;
    } else {
      acct.hidden = true;
      loginBtn.hidden = false;
      payBtn.disabled = true;
    }
  }

  document.querySelectorAll(".co-method").forEach((b) => {
    b.addEventListener("click", () => { selectedMethod = b.dataset.method; renderForm(); });
  });

  /* ---------- public API ---------- */
  function openCheckout(planId) {
    if (planId && PLANS[planId]) selectedPlanId = planId;

    // Already pro? Send them to the dashboard instead of charging again.
    if (currentProfile && (currentProfile.plan === "pro" || currentProfile.plan === "pro_global")) {
      window.location.href = "dashboard.html";
      return;
    }
    if (!currentUser && CONFIG_READY) {
      stashPending();                          // remember choice through login
      showState("needlogin");
      openModal();
      return;
    }
    showState("form");
    renderForm();
    openModal();
  }
  window.LBCheckout = { open: openCheckout, close: closeModal };

  function stashPending() {
    try { localStorage.setItem(PENDING_KEY, JSON.stringify({ planId: selectedPlanId, method: selectedMethod })); } catch (e) {}
  }

  /* ---------- pay: write order intent, hand off to Mercado Pago ---------- */
  $("co-pay") && $("co-pay").addEventListener("click", async () => {
    const plan = PLANS[selectedPlanId];
    if (!plan || !currentUser) return;

    const orderId = currentUser.uid + "-" + Date.now().toString(36);
    showState("redirecting");

    // 1) Record the intent (owner-writable; grants NO access by itself).
    if (CONFIG_READY) {
      try {
        await setDoc(doc(db, "orders", orderId), {
          uid: currentUser.uid,
          email: currentUser.email || (currentProfile && currentProfile.email) || null,
          planId: plan.id,
          tier: plan.tier,                     // what the webhook will grant
          billing: plan.billing,
          amountCents: plan.priceCents,
          currency: PAYMENTS_CONFIG.currency,
          method: selectedMethod,
          provider: "mercadopago",
          status: "initiated",                 // webhook flips to paid/failed
          createdAt: serverTimestamp(),
        });
      } catch (e) { /* non-fatal: proceed to hosted checkout anyway */ }
    }

    try { localStorage.setItem(PENDING_KEY, JSON.stringify({ planId: plan.id, orderId: orderId, method: selectedMethod })); } catch (e) {}

    // 2) Hand off to Mercado Pago hosted checkout (PIX + card).
    const base = plan.checkoutUrl || "";
    if (!base || base.indexOf("REPLACE") !== -1) {
      // Links not wired yet — surface clearly instead of a broken redirect.
      alert(t("pay.redirecting") + "\n\n[Mercado Pago checkout link not configured — see payments-config.js]");
      showState("form");
      return;
    }
    const ret = location.origin + location.pathname.replace(/[^/]*$/, "") + PAYMENTS_CONFIG.RETURN_PATH;
    const sep = base.indexOf("?") === -1 ? "?" : "&";
    const url = base + sep +
      "external_reference=" + encodeURIComponent(orderId) +
      "&back_url=" + encodeURIComponent(ret) +
      "&preference_method=" + encodeURIComponent(selectedMethod);
    window.location.href = url;
  });

  $("co-retry") && $("co-retry").addEventListener("click", () => { showState("form"); renderForm(); });

  /* ---------- return from Mercado Pago: confirm via webhook-updated tier ---------- */
  function readReturnStatus() {
    const p = new URLSearchParams(location.search);
    // Mercado Pago may use status / collection_status depending on link type.
    const raw = (p.get("status") || p.get("collection_status") || "").toLowerCase();
    const extRef = p.get("external_reference") || "";
    if (!raw) return null;
    let kind = "failed";
    if (raw === "approved" || raw === "success") kind = "approved";
    else if (raw === "pending" || raw === "in_process") kind = "pending";
    else if (raw === "failure" || raw === "rejected" || raw === "cancelled" || raw === "null") kind = "failed";
    return { kind, extRef };
  }

  async function pollTierUpgrade(maxMs) {
    // The webhook sets users/{uid}.plan once Mercado Pago confirms payment.
    const deadline = Date.now() + (maxMs || 25000);
    while (Date.now() < deadline) {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          const plan = snap.data().plan;
          if (plan === "pro" || plan === "pro_global") return true;
        }
      } catch (e) { /* keep trying */ }
      await new Promise((r) => setTimeout(r, 2500));
    }
    return false;
  }

  async function handleReturn(ret) {
    openModal();
    if (ret.kind === "failed") { showState("failed"); cleanUrl(); return; }

    // approved or pending: confirm the server-side tier grant.
    showState("confirming");
    if (!CONFIG_READY || !currentUser) { showState(ret.kind === "approved" ? "pending" : "pending"); cleanUrl(); return; }
    const upgraded = await pollTierUpgrade(ret.kind === "approved" ? 30000 : 12000);
    showState(upgraded ? "success" : "pending");
    try { localStorage.removeItem(PENDING_KEY); } catch (e) {}
    cleanUrl();
  }

  function cleanUrl() {
    try { history.replaceState({}, document.title, location.pathname); } catch (e) {}
  }

  /* ---------- boot ---------- */
  const pendingReturn = readReturnStatus();

  function finishBoot() {
    // Restore a plan choice the user made before logging in.
    try {
      const saved = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
      if (saved && saved.planId && PLANS[saved.planId]) selectedPlanId = saved.planId;
      if (saved && saved.method) selectedMethod = saved.method;
    } catch (e) {}
    if (pendingReturn) handleReturn(pendingReturn);
  }

  if (!CONFIG_READY) {
    // Preview mode (no Firebase keys): UI still fully demoable.
    currentUser = null; currentProfile = null;
    finishBoot();
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    currentUser = user || null;
    currentProfile = null;
    if (user) {
      try { const s = await getDoc(doc(db, "users", user.uid)); if (s.exists()) currentProfile = s.data(); } catch (e) {}
    }
    if (overlay.classList.contains("open")) renderForm();
    finishBoot();
  });

  // Re-render labels when language changes.
  window.addEventListener("i18n:change", () => { if (overlay.classList.contains("open")) renderForm(); });
})();
