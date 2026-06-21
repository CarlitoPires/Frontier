/* LinguoBound — Dashboard logic
   - Renders fluency radar
   - Builds citizenship hierarchy (hard-gate states)
   - Real-Time Environment Sync (weather -> atmosphere + rain SFX/visual)
   - Fully localized via I18n; re-renders on "i18n:change".
   In production, replace MOCK with fetch('/api/citizen/me') etc. */

(function () {
  "use strict";

  /* ---------- MOCK state (mirrors backend shape) ---------- */
  const CITIZEN = {
    name: "Carlito Pires",
    tier: "BASE",                       // BASE | GLOBAL
    activeCity: "London",               // canonical (English) key -> I18n "city.*"
    completedModules: 11,
    currentBlock: "04",
    totalModules: 500,
    // value = score; key = I18n label key
    fluency: [
      { key: "radar.fluency",       value: 62 },
      { key: "radar.vocabulary",    value: 74 },
      { key: "radar.confidence",    value: 48 },
      { key: "radar.reaction",      value: 55 },
      { key: "radar.listening",     value: 68 },
      { key: "radar.pronunciation", value: 51 },
    ],
    hierarchy: [
      { city: "London",   state: "current"  },
      { city: "Berlin",   state: "locked"   },
      { city: "Madrid",   state: "locked"   },
      { city: "New York", state: "locked"   },
    ],
  };

  // Demo weather feed. In production: fetch a weather API for activeCity.
  const MOCK_WEATHER = { condition: "rain", labelKey: "weather.rain", icon: "☔" };

  const STATE_KEY = {
    unlocked: "state.conquered",
    current:  "state.inProgress",
    locked:   "state.locked",
  };
  const STATE_ICON = { unlocked: "✓", current: "●", locked: "✕" };

  /* ---------- Elements ---------- */
  const el = (id) => document.getElementById(id);
  const body = document.body;
  const radarEl = el("radar");
  const legendEl = el("radar-legend");
  const gateEl = el("gate-list");

  /* ---------- Localized render helpers ---------- */
  function fluencyData() {
    return CITIZEN.fluency.map((f) => ({ label: I18n.t(f.key), value: f.value }));
  }

  function renderRadar() {
    drawRadar(radarEl, fluencyData(), { rings: 4 });
    legendEl.innerHTML = fluencyData()
      .map((d) => `<li><span>${d.label}</span><span class="val">${d.value}</span></li>`)
      .join("");
  }

  function renderProgressAndTier() {
    const pct = Math.round((CITIZEN.completedModules / CITIZEN.totalModules) * 100);
    el("rail-fill").style.width = pct + "%";
    el("progress-pct").textContent = pct + "%";
    el("city-name").textContent = I18n.t("city." + CITIZEN.activeCity);
    el("progress-label").textContent = I18n.t("dash.progressMeta", {
      block: CITIZEN.currentBlock,
      module: CITIZEN.completedModules,
      total: CITIZEN.totalModules,
    });
    el("tier-label").textContent = I18n.t(CITIZEN.tier === "GLOBAL" ? "tier.global" : "tier.base");
  }

  function renderIdentity() {
    const nameEl = el("citizen-name");
    const avatarEl = el("citizen-avatar");
    if (nameEl) nameEl.textContent = CITIZEN.name;
    if (avatarEl) {
      const parts = CITIZEN.name.trim().split(/\s+/);
      const initials = (parts[0]?.[0] || "") + (parts[1]?.[0] || parts[0]?.[1] || "");
      avatarEl.textContent = initials.toUpperCase();
    }
  }

  function renderHierarchy() {
    gateEl.innerHTML = CITIZEN.hierarchy
      .map(
        (c) => `
      <li class="gate-node ${c.state}">
        <span class="gate-lock">${STATE_ICON[c.state]}</span>
        <div class="gate-city">${I18n.t("city." + c.city)}</div>
        <div class="gate-state">${I18n.t(STATE_KEY[c.state])}</div>
      </li>`
      )
      .join("");
  }

  function renderWeatherText() {
    el("weather-text").textContent = I18n.t(MOCK_WEATHER.labelKey);
    el("weather-icon").textContent = MOCK_WEATHER.icon;
  }

  function renderAll() {
    renderIdentity();
    renderRadar();
    renderProgressAndTier();
    renderHierarchy();
    renderWeatherText();
  }

  /* ---------- Cinematic rain canvas (started once) ---------- */
  function startRain() {
    const canvas = el("rain-canvas");
    const ctx = canvas.getContext("2d");
    let drops = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 140; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        len: 10 + Math.random() * 18,
        spd: 6 + Math.random() * 9,
      });
    }
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(170,180,195,0.35)";
      ctx.lineWidth = 1;
      for (const d of drops) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.len);
        ctx.stroke();
        d.y += d.spd;
        if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random() * canvas.width; }
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  function applyWeatherEffects() {
    if (MOCK_WEATHER.condition === "rain") {
      body.classList.add("weather-rain");
      startRain();
    }
  }

  /* ---------- Boot ---------- */
  renderAll();
  applyWeatherEffects();

  // Re-render localized content (not the rain) when the language changes.
  window.addEventListener("i18n:change", renderAll);

  // Merge REAL Firestore user data (from session.js) into the view model.
  // Progression aggregates (fluency/hierarchy) will arrive once the backend
  // writes them; until then those stay as illustrative defaults.
  window.addEventListener("lb:session", (e) => {
    const profile = e.detail && e.detail.profile;
    if (!profile) return;
    CITIZEN.name = profile.displayName || (profile.email ? profile.email.split("@")[0] : CITIZEN.name);
    CITIZEN.tier = profile.plan === "pro" ? "GLOBAL" : "BASE";
    renderAll();
  });

  // If the session resolved before this script attached its listener, apply now.
  if (window.LB_SESSION && window.LB_SESSION.profile) {
    const p = window.LB_SESSION.profile;
    CITIZEN.name = p.displayName || (p.email ? p.email.split("@")[0] : CITIZEN.name);
    CITIZEN.tier = p.plan === "pro" ? "GLOBAL" : "BASE";
    renderAll();
  }

  /* ---------- Resume ---------- */
  el("resume-btn").addEventListener("click", () => {
    // -> launch simulation engine for next unlocked module
    body.style.transition = "opacity 500ms var(--ease-cine)";
    body.style.opacity = "0";
    setTimeout(() => (window.location.href = "simulation.html"), 460);
  });
})();
