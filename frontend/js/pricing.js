/* ============================================================
 *  LinguoBound — Sales landing interactions
 *
 *  - Renders plan cards from PLANS (single source of truth) with a
 *    Monthly/Annual billing toggle and value-based anchoring.
 *  - Trust elements: Founding-Citizen countdown, Visa-tier ladder,
 *    and a milestone "Victory Selfie" social-proof marquee.
 *  - Reveal-on-scroll, smooth anchor scroll, and "Choose plan" wiring
 *    into window.LBCheckout (checkout.js).
 *  - Fully bilingual via the global I18n engine (re-renders on change).
 * ============================================================ */

import { PLANS, DEFAULT_PLAN_ID } from "./payments-config.js";

(function () {
  "use strict";

  const t = (k, p) => (window.I18n ? I18n.t(k, p) : k);
  let billing = "annual";                       // anchor on annual (best value)

  /* ---------- plan cards ---------- */
  const grid = document.getElementById("plan-grid");

  function plansForBilling() {
    // Monthly view shows the monthly plan; annual view shows the annual tiers.
    const all = Object.values(PLANS);
    if (billing === "monthly") {
      const monthly = all.filter((p) => p.billing === "monthly");
      // Pad with annual tiers so the value gap is visible even in monthly view.
      return monthly.concat(all.filter((p) => p.billing === "annual"));
    }
    return all.filter((p) => p.billing === "annual")
      .concat(all.filter((p) => p.billing === "monthly"));
  }

  function renderPlans() {
    if (!grid) return;
    const plans = plansForBilling();
    grid.innerHTML = "";
    plans.forEach((plan) => {
      const card = document.createElement("article");
      card.className = "lp-plan glass" + (plan.recommended ? " lp-plan-rec" : "");

      const feats = (plan.features || [])
        .map((fk) => `<li>${t(fk)}</li>`).join("");
      const equiv = plan.equivPerMonth
        ? `<p class="lp-plan-equiv">${t("lp.annualEquiv", { value: plan.equivPerMonth })}</p>`
        : `<p class="lp-plan-equiv"></p>`;
      const badge = plan.recommended
        ? `<span class="lp-plan-badge">${t("lp.recommended")}</span>` : "";

      card.innerHTML = `
        ${badge}
        <div class="lp-plan-name">${t(plan.nameKey)}</div>
        <p class="lp-plan-tag">${t(plan.taglineKey)}</p>
        <div class="lp-plan-price"><b>${plan.displayPrice}</b><span>${t(plan.perKey)}</span></div>
        ${equiv}
        <ul class="lp-plan-feats">${feats}</ul>
        <button class="btn ${plan.recommended ? "btn-gold" : ""}" data-choose="${plan.id}">
          ${t("lp.choosePlan", { plan: t(plan.nameKey) })}
        </button>`;
      grid.appendChild(card);
    });

    grid.querySelectorAll("[data-choose]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.LBCheckout) window.LBCheckout.open(btn.getAttribute("data-choose"));
      });
    });
  }

  /* ---------- billing toggle ---------- */
  function mountBillingToggle() {
    const pricing = document.getElementById("plans");
    const head = pricing && pricing.querySelector(".lp-head");
    if (!head) return;
    const wrap = document.createElement("div");
    wrap.className = "lp-bill-toggle";
    wrap.setAttribute("role", "group");
    wrap.innerHTML = `
      <button type="button" data-bill="monthly">${t("lp.billMonthly")}</button>
      <button type="button" data-bill="annual">${t("lp.billAnnual")}<span class="lp-bill-save">${t("lp.billSave")}</span></button>`;
    head.after(wrap);
    function sync() {
      wrap.querySelectorAll("[data-bill]").forEach((b) => b.classList.toggle("active", b.dataset.bill === billing));
    }
    wrap.querySelectorAll("[data-bill]").forEach((b) => {
      b.addEventListener("click", () => { billing = b.dataset.bill; sync(); renderPlans(); });
    });
    sync();
    window.__lpSyncBill = sync;
  }

  /* ---------- Founding-Citizen countdown (persists per visitor) ---------- */
  function startCountdown() {
    const KEY = "linguobound.cohortDeadline";
    let deadline;
    try { deadline = parseInt(localStorage.getItem(KEY) || "0", 10); } catch (e) { deadline = 0; }
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + 3 * 24 * 60 * 60 * 1000;   // 72h window per visitor
      try { localStorage.setItem(KEY, String(deadline)); } catch (e) {}
    }
    const dd = document.getElementById("cd-d"), hh = document.getElementById("cd-h"),
          mm = document.getElementById("cd-m"), ss = document.getElementById("cd-s");
    if (!dd) return;
    const pad = (n) => String(n).padStart(2, "0");
    function tick() {
      let left = Math.max(0, deadline - Date.now());
      const d = Math.floor(left / 86400000); left -= d * 86400000;
      const h = Math.floor(left / 3600000); left -= h * 3600000;
      const m = Math.floor(left / 60000); left -= m * 60000;
      const s = Math.floor(left / 1000);
      dd.textContent = pad(d); hh.textContent = pad(h); mm.textContent = pad(m); ss.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Milestone "Victory Selfie" social-proof marquee ---------- */
  const MILESTONES = [
    "Tourist", "Resident", "Local", "Professional", "True Londoner",
    "Office Insider", "Unbreakable", "Established Londoner", "Honorary Brit",
    "London Leader", "Two Worlds, One Home", "Pillar of the Community",
    "Person of Integrity", "A London Institution", "A Lasting Legacy",
    "Citizen of the World", "Master of the City", "Architect of Life",
    "The Heart of London", "London, Conquered",
  ];
  function mountMilestones() {
    const proof = document.getElementById("proof");
    const stats = proof && proof.querySelector(".lp-stats");
    if (!stats) return;
    const row = document.createElement("div");
    row.className = "lp-milestones reveal";
    const chips = MILESTONES.concat(MILESTONES)   // duplicate for seamless loop
      .map((m, i) => `<span class="lp-ms-chip${(i % MILESTONES.length) === MILESTONES.length - 1 ? " lp-ms-final" : ""}">${m}</span>`)
      .join("");
    row.innerHTML = `<div class="lp-ms-track">${chips}</div>`;
    stats.after(row);
  }

  /* ---------- reveal-on-scroll ---------- */
  function mountReveals() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- smooth anchor scroll ---------- */
  function mountScrollers() {
    document.querySelectorAll("[data-scroll]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const el = document.querySelector(btn.getAttribute("data-scroll"));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    document.querySelectorAll('.lp-nav-links a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const el = document.querySelector(a.getAttribute("href"));
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    mountBillingToggle();
    renderPlans();
    mountMilestones();
    startCountdown();
    mountScrollers();
    mountReveals();
    if (window.I18n) I18n.apply(document);     // localise freshly-injected nodes
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // Re-render dynamic (JS-built) content when the language flips.
  window.addEventListener("i18n:change", () => {
    renderPlans();
    if (window.__lpSyncBill) {
      const tog = document.querySelector(".lp-bill-toggle");
      if (tog) {
        tog.querySelector('[data-bill="monthly"]').firstChild.textContent = t("lp.billMonthly");
        const annual = tog.querySelector('[data-bill="annual"]');
        annual.childNodes[0].textContent = t("lp.billAnnual");
        const save = annual.querySelector(".lp-bill-save");
        if (save) save.textContent = t("lp.billSave");
      }
    }
  });
})();
