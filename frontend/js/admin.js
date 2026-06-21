/* ============================================================
 *  LinguoBound — Admin Command Center logic
 *  - Panel/tab navigation + breadcrumb
 *  - Collapsible "Métricas" sub-menu
 *  - Mobile off-canvas drawer
 *  - Firebase admin auth gate (UX layer; Firestore Rules enforce)
 * ============================================================ */

import { auth, db, isAdmin, onAuthStateChanged, signOut, doc, getDoc, collection, getDocs, CONFIG_READY } from "./firebase-init.js";
import { seedAllContent } from "./seed-content.js";

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
      const n = await seedAllContent();
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
    computeMetrics();   // wire real numbers + predictive health
  }

  /* ---------- Real metrics (live, computed client-side) ---------- */
  const kpi = (label, value, trend) =>
    '<div class="card glass kpi"><span class="kpi-label">' + label + '</span><span class="kpi-value">' + value + '</span>' +
    (trend ? '<span class="kpi-trend">' + trend + '</span>' : '') + '</div>';

  async function computeMetrics() {
    if (!CONFIG_READY) return;  // keep illustrative placeholders in preview
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      let total = 0, free = 0, pro = 0;
      let accSum = 0, accN = 0, patSum = 0, retSum = 0, velSum = 0, velN = 0, risk = 0;
      const today = new Date().toISOString().slice(0, 10);
      const jobs = [];
      usersSnap.forEach((u) => {
        total++;
        const d = u.data() || {};
        if (d.plan === "pro") pro++; else free++;
        jobs.push(getDoc(doc(db, "progress", u.id)).then((ps) => {
          if (!ps.exists()) { risk++; return; }            // no progress started -> at risk
          const p = ps.data(); const g = p.gradedCount || 0;
          if (g > 0) {
            const a = (p.sumAccuracy || 0) / g;
            accSum += a; accN++;
            patSum += (p.sumPatience || 0) / g;
            retSum += (p.sumRetries || 0) / g;
            if (typeof p.lastAccuracy === "number") { velSum += (p.lastAccuracy - a); velN++; }
            if (a < 0.6) risk++;
          }
          const last = p.streak && p.streak.lastDay;
          const daysSince = last ? Math.round((new Date(today) - new Date(last)) / 86400000) : 99;
          if (daysSince >= 3 || p.assistTempo) risk++;
        }).catch(() => {}));
      });
      await Promise.all(jobs);

      const pct = (n) => Math.round(n * 100);
      const avgAcc = accN ? accSum / accN : 0;
      const avgPat = accN ? patSum / accN : 0;
      const avgRet = accN ? retSum / accN : 0;
      const conv = total ? pct(pro / total) : 0;
      const churn = total ? pct(Math.min(1, risk / total)) : 0;
      const velocity = velN ? velSum / velN : 0;        // recent - overall accuracy

      const kpis = $("plans-kpis");
      if (kpis) kpis.innerHTML =
        kpi("Usuários totais", total) +
        kpi("Free", free, total ? (100 - conv) + "%" : "") +
        kpi("Pro", pro, conv + "%") +
        kpi("Pronúncia média", pct(avgAcc) + "%") +
        kpi("Compostura média", Math.round(avgPat)) +
        kpi("Conversão Free→Pro", conv + "%");

      const health = $("base-health");
      if (health) {
        const velArrow = velocity >= 0 ? "▲" : "▼";
        const churnClass = churn >= 40 ? "down" : "up";
        health.innerHTML =
          '<div class="card glass kpi"><span class="kpi-label">Risco de Evasão (Churn)</span><span class="kpi-value ' + churnClass + '">' + churn + '%</span><span class="kpi-trend">' + risk + ' de ' + total + ' em risco</span></div>' +
          '<div class="card glass kpi"><span class="kpi-label">Velocidade de Fluência</span><span class="kpi-value">' + velArrow + ' ' + (velocity >= 0 ? "+" : "") + pct(velocity) + '%</span><span class="kpi-trend">precisão recente vs. média</span></div>' +
          '<div class="card glass kpi"><span class="kpi-label">Zona de Atrito (retentativas/módulo)</span><span class="kpi-value">' + (Math.round(avgRet * 10) / 10) + '</span></div>';
      }
      const src = $("health-source");
      if (src) src.textContent = "(ao vivo · " + total + " usuários)";
    } catch (e) {
      const src = $("health-source");
      if (src) src.textContent = "(sem permissão / sem dados)";
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
