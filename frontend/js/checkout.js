/* ============================================================
 *  LinguoBound — Checkout engine (Asaas + Firestore)
 *
 *  FLOW (secure, recurring-SaaS):
 *   1. User picks a plan -> openCheckout(planId).
 *   2. Must be a signed-in citizen (we link the subscription to their uid).
 *   3. We write an ORDER INTENT to orders/{orderId} (owner-writable;
 *      grants NO access by itself — see firestore.rules).
 *   4. We call our serverless endpoint `asaas-create-subscription`, which
 *      (using the SECRET Asaas API key, server-side) creates/gets the
 *      Asaas customer + subscription and returns the hosted `invoiceUrl`
 *      (Asaas's PCI-compliant page: PIX + card + boleto).
 *   5. We redirect to the invoiceUrl. Asaas notifies our `asaas-webhook`
 *      on PAYMENT_CONFIRMED / PAYMENT_RECEIVED. The webhook — via the
 *      Admin SDK — is the ONLY thing allowed to set users/{uid}.plan.
 *      Clients can never self-promote (Firestore rules enforce it).
 *   6. On return, a realtime users/{uid} listener flips the UI to success
 *      the instant the webhook grants the tier.
 *
 *  Charging a card needs the secret API key, which must never reach the
 *  browser — so subscription creation is server-side and payment happens
 *  on Asaas's hosted page. Everything UP TO the hand-off is fully in-brand.
 * ============================================================ */

import {
  auth, db, onAuthStateChanged,
  doc, getDoc, setDoc, serverTimestamp, onSnapshot, CONFIG_READY,
} from "./firebase-init.js";
import { PLANS, DEFAULT_PLAN_ID, PAYMENTS_CONFIG, BILLING_TYPES } from "./payments-config.js";

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

    document.querySelectorAll(".co-method").forEach((b) => {
      b.classList.toggle("active", b.dataset.method === selectedMethod);
    });

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
    if (currentProfile && (currentProfile.plan === "pro" || currentProfile.plan === "pro_global")) {
      window.location.href = "dashboard.html";
      return;
    }
    if (!currentUser && CONFIG_READY) {
      stashPending();
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

  function cpfDigits() {
    const el = $("co-cpf");
    return el ? (el.value || "").replace(/\D/g, "") : "";
  }

  /* ---------- pay: write intent -> create Asaas subscription -> redirect ---------- */
  $("co-pay") && $("co-pay").addEventListener("click", async () => {
    const plan = PLANS[selectedPlanId];
    if (!plan || !currentUser) return;

    const orderId = currentUser.uid + "-" + Date.now().toString(36);
    const billingType = BILLING_TYPES[selectedMethod] || "UNDEFINED";
    showState("redirecting");

    // 1) Record intent (owner-writable). The webhook maps payment -> uid
    //    via this order's externalReference, so it MUST succeed.
    if (CONFIG_READY) {
      try {
        await setDoc(doc(db, "orders", orderId), {
          uid: currentUser.uid,
          email: currentUser.email || (currentProfile && currentProfile.email) || null,
          planId: plan.id,
          tier: plan.tier,
          billing: plan.billing,
          cycle: plan.cycle,
          amountCents: plan.priceCents,
          currency: PAYMENTS_CONFIG.currency,
          method: selectedMethod,
          billingType: billingType,
          provider: "asaas",
          status: "initiated",
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn("[checkout] order intent write failed:", e && e.code);
        showState("failed");
        return;
      }
    }

    // 2) Ask the server to create the Asaas subscription (secret key).
    if (!PAYMENTS_CONFIG.isConfigured()) {
      alert(t("pay.redirecting") + "\n\n[Asaas functions host not configured — see payments-config.js / docs/ASAAS_SETUP.md]");
      showState("form");
      return;
    }

    const returnUrl = location.origin + location.pathname.replace(/[^/]*$/, "") +
      PAYMENTS_CONFIG.RETURN_PATH + "?asaas=return";

    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify({ planId: plan.id, orderId: orderId, method: selectedMethod, awaiting: true }));
    } catch (e) {}

    try {
      const resp = await fetch(PAYMENTS_CONFIG.FUNCTIONS_BASE.replace(/\/$/, "") + "/asaas-create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId,
          uid: currentUser.uid,
          planId: plan.id,
          billingType: billingType,
          email: currentUser.email || (currentProfile && currentProfile.email) || null,
          name: (currentProfile && currentProfile.name) || (currentUser.displayName) || null,
          cpfCnpj: cpfDigits() || null,
          returnUrl: returnUrl,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data.invoiceUrl) throw new Error(data.error || ("HTTP " + resp.status));
      window.location.href = data.invoiceUrl;          // -> Asaas hosted page
    } catch (e) {
      console.warn("[checkout] asaas-create-subscription failed:", e && e.message);
      showState("failed");
    }
  });

  $("co-retry") && $("co-retry").addEventListener("click", () => { showState("form"); renderForm(); });

  /* ---------- return from Asaas: confirm via webhook-granted tier ---------- */
  function isReturn() {
    const p = new URLSearchParams(location.search);
    if (p.get("asaas") === "return") return true;
    // Fallback: a pending redirect flag set just before leaving.
    try { const s = JSON.parse(localStorage.getItem(PENDING_KEY) || "null"); return !!(s && s.awaiting); } catch (e) { return false; }
  }

  async function pollTierUpgrade(maxMs) {
    const deadline = Date.now() + (maxMs || 25000);
    while (Date.now() < deadline) {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          const plan = snap.data().plan;
          if (plan === "pro" || plan === "pro_global") { unlockLocalTier(plan); return true; }
        }
      } catch (e) {}
      await new Promise((r) => setTimeout(r, 2500));
    }
    return false;
  }

  function listenForUpgrade(maxMs) {
    return new Promise((resolve) => {
      let settled = false, unsub = null;
      const finish = (val) => { if (settled) return; settled = true; if (unsub) { try { unsub(); } catch (e) {} } clearTimeout(timer); resolve(val); };
      const timer = setTimeout(() => finish(false), maxMs || 30000);
      try {
        unsub = onSnapshot(
          doc(db, "users", currentUser.uid),
          (snap) => {
            if (!snap.exists()) return;
            const plan = snap.data().plan;
            if (plan === "pro" || plan === "pro_global") { unlockLocalTier(plan); finish(true); }
          },
          () => { pollTierUpgrade(maxMs || 30000).then(finish); }
        );
      } catch (e) { pollTierUpgrade(maxMs || 30000).then(finish); }
    });
  }

  function unlockLocalTier(plan) {
    if (currentProfile) currentProfile.plan = plan;
    try { if (window.LB_SESSION && window.LB_SESSION.profile) window.LB_SESSION.profile.plan = plan; } catch (e) {}
    window.dispatchEvent(new CustomEvent("lb:upgraded", { detail: { plan: plan } }));
  }

  async function handleReturn() {
    openModal();
    showState("confirming");
    if (!CONFIG_READY || !currentUser) { showState("pending"); cleanUrl(); return; }
    const upgraded = await listenForUpgrade(35000);
    showState(upgraded ? "success" : "pending");
    try { localStorage.removeItem(PENDING_KEY); } catch (e) {}
    cleanUrl();
    if (upgraded) seamlessEnterCity();
  }

  function seamlessEnterCity() {
    setTimeout(() => {
      document.body.style.transition = "opacity 600ms var(--ease-cine)";
      document.body.style.opacity = "0";
      setTimeout(() => { window.location.href = "dashboard.html"; }, 560);
    }, 1900);
  }

  function cleanUrl() { try { history.replaceState({}, document.title, location.pathname); } catch (e) {} }

  /* ---------- boot ---------- */
  const returning = isReturn();

  function finishBoot() {
    try {
      const saved = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
      if (saved && saved.planId && PLANS[saved.planId]) selectedPlanId = saved.planId;
      if (saved && saved.method) selectedMethod = saved.method;
    } catch (e) {}
    if (returning) handleReturn();
  }

  if (!CONFIG_READY) { currentUser = null; currentProfile = null; finishBoot(); return; }

  onAuthStateChanged(auth, async (user) => {
    currentUser = user || null;
    currentProfile = null;
    if (user) {
      try { const s = await getDoc(doc(db, "users", user.uid)); if (s.exists()) currentProfile = s.data(); } catch (e) {}
    }
    if (overlay.classList.contains("open")) renderForm();
    finishBoot();
  });

  window.addEventListener("i18n:change", () => { if (overlay.classList.contains("open")) renderForm(); });
})();
