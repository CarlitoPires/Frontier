/* ============================================================
 *  LinguoBound — Admin Command Center logic
 *  - Panel/tab navigation + breadcrumb
 *  - Collapsible "Métricas" sub-menu
 *  - Mobile off-canvas drawer
 *  - Firebase admin auth gate (UX layer; Firestore Rules enforce)
 * ============================================================ */

import { auth, isAdmin, onAuthStateChanged, signOut, CONFIG_READY } from "./firebase-init.js";
import { seedBlockZero } from "./seed-content.js";

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const shell = $("admin-shell");
  const overlay = $("admin-overlay");
  const navToggle = $("nav-toggle");
  const crumb = $("crumb-current");

  const PANEL_LABELS = {
    credentials: "Configuração de Credenciais",
    plans: "Planos & Assinaturas",
    funil: "Funil",
    remarketing: "Remarketing",
    custos: "Custos & Margens",
    precos: "Preços",
    escala: "Escala",
    concorrentes: "Concorrentes",
  };

  /* ---------- Drawer (mobile) ---------- */
  function openNav() { shell.classList.add("nav-open"); }
  function closeNav() { shell.classList.remove("nav-open"); }
  navToggle && navToggle.addEventListener("click", openNav);
  overlay && overlay.addEventListener("click", closeNav);

  /* ---------- Panel navigation ---------- */
  const panelButtons = document.querySelectorAll("[data-panel]");

  function showPanel(id) {
    document.querySelectorAll(".panel-view").forEach((p) => p.classList.remove("active"));
    const view = $("panel-" + id);
    if (view) view.classList.add("active");

    panelButtons.forEach((b) => b.classList.toggle("active", b.dataset.panel === id));
    if (crumb) crumb.textContent = PANEL_LABELS[id] || "";

    // Scroll content to top and close the mobile drawer.
    const content = $("admin-content");
    if (content) content.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeNav();
  }

  panelButtons.forEach((btn) => {
    btn.addEventListener("click", () => showPanel(btn.dataset.panel));
  });

  /* ---------- Sub-menu toggle (Métricas) ---------- */
  document.querySelectorAll("[data-submenu]").forEach((parent) => {
    parent.addEventListener("click", () => {
      const expanded = parent.classList.toggle("expanded");
      parent.setAttribute("aria-expanded", String(expanded));
    });
  });

  /* ---------- Content seeder (Customs 1–5) ---------- */
  const seedBtn = $("seed-customs-btn");
  const seedStatus = $("seed-status");
  seedBtn && seedBtn.addEventListener("click", async () => {
    if (!CONFIG_READY) { if (seedStatus) seedStatus.textContent = "Configure o Firebase primeiro."; return; }
    seedBtn.disabled = true;
    if (seedStatus) seedStatus.textContent = "Populando…";
    try {
      const n = await seedBlockZero();
      if (seedStatus) seedStatus.textContent = "✓ " + n + " módulos publicados em content/";
    } catch (e) {
      if (seedStatus) seedStatus.textContent = "Falhou: " + ((e && e.code) || "erro");
    } finally {
      seedBtn.disabled = false;
    }
  });

  /* ---------- Sign out ---------- */
  $("signout-btn") && $("signout-btn").addEventListener("click", async () => {
    if (CONFIG_READY) {
      try { await signOut(auth); } catch (e) { /* ignore */ }
    }
    window.location.href = "index.html";
  });

  /* ---------- Admin auth gate ---------- */
  const gate = $("admin-gate");
  const gateMsg = $("gate-msg");

  function denyGate(msg) {
    if (gate) gate.hidden = false;
    if (gateMsg) gateMsg.textContent = msg;
  }
  function grantGate(user) {
    if (gate) gate.hidden = true;
    if (user) {
      const name = user.displayName || (user.email ? user.email.split("@")[0] : "Administrador");
      const nameEl = $("admin-user-name");
      if (nameEl) nameEl.textContent = name;
      const chip = document.querySelector(".admin-chip");
      const avatar = document.querySelector(".admin-avatar");
      const initials = name.slice(0, 2).toUpperCase();
      if (chip) chip.textContent = initials;
      if (avatar) avatar.textContent = initials;
    }
  }

  if (!CONFIG_READY) {
    // Preview mode — Firebase not configured yet. Show the dashboard so the
    // UI can be reviewed; real deployments will hit the auth gate below.
    if (gate) gate.hidden = true;
    console.warn(
      "[LinguoBound] Firebase config not set — admin shown in PREVIEW mode (no auth). " +
      "Paste your keys into js/firebase-init.js to enable the secure gate."
    );
  } else {
    denyGate("Verificando credenciais…");
    onAuthStateChanged(auth, async (user) => {
      if (!user) { denyGate("Faça login como administrador para acessar o Command Center."); return; }
      const ok = await isAdmin(user);
      if (!ok) { denyGate("Sua conta não possui acesso de administrador."); return; }
      grantGate(user);
    });
  }

  /* ---------- Boot ---------- */
  showPanel("credentials");
})();
