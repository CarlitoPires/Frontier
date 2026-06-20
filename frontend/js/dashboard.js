/* FRONTIER — Dashboard logic
   - Renders fluency radar
   - Builds citizenship hierarchy (hard-gate states)
   - Real-Time Environment Sync (weather -> atmosphere + rain SFX/visual)
   In production, replace MOCK with fetch('/api/citizen/me') etc. */

(function () {
  "use strict";

  /* ---------- MOCK state (mirrors backend shape) ---------- */
  const CITIZEN = {
    name: "Carlito Pires",
    tier: "BASE",                       // BASE | GLOBAL
    activeCity: "London",
    completedModules: 11,
    totalModules: 500,
    fluency: [
      { label: "Fluency",     value: 62 },
      { label: "Vocabulary",  value: 74 },
      { label: "Confidence",  value: 48 },
      { label: "Reaction",    value: 55 },
      { label: "Listening",   value: 68 },
      { label: "Pronunciation", value: 51 },
    ],
    hierarchy: [
      { city: "London",  state: "current"  },
      { city: "Berlin",  state: "locked"   },
      { city: "Madrid",  state: "locked"   },
      { city: "New York",state: "locked"   },
    ],
  };

  /* ---------- Radar ---------- */
  drawRadar(document.getElementById("radar"), CITIZEN.fluency, { rings: 4 });
  const legend = document.getElementById("radar-legend");
  legend.innerHTML = CITIZEN.fluency
    .map((d) => `<li><span>${d.label}</span><span class="val">${d.value}</span></li>`)
    .join("");

  /* ---------- Progress ---------- */
  const pct = Math.round((CITIZEN.completedModules / CITIZEN.totalModules) * 100);
  document.getElementById("rail-fill").style.width = pct + "%";
  document.getElementById("progress-pct").textContent = pct + "%";
  document.getElementById("city-name").textContent = CITIZEN.activeCity;
  document.getElementById("tier-label").textContent =
    CITIZEN.tier === "GLOBAL" ? "Global Citizen" : "Base Citizen";

  /* ---------- Citizenship hierarchy (hard gate) ---------- */
  const gate = document.getElementById("gate-list");
  const STATE_LABEL = {
    unlocked: "Conquered",
    current:  "In Progress",
    locked:   "Locked · Earn Certification",
  };
  const STATE_ICON = { unlocked: "✓", current: "●", locked: "✕" };
  gate.innerHTML = CITIZEN.hierarchy
    .map(
      (c) => `
      <li class="gate-node ${c.state}">
        <span class="gate-lock">${STATE_ICON[c.state]}</span>
        <div class="gate-city">${c.city}</div>
        <div class="gate-state">${STATE_LABEL[c.state]}</div>
      </li>`
    )
    .join("");

  /* ---------- Real-Time Environment Sync ---------- */
  // Demo weather feed. In production: fetch a weather API for activeCity.
  const MOCK_WEATHER = { condition: "rain", label: "Rain · 11°C", icon: "☔" };

  function applyWeather(w) {
    document.getElementById("weather-text").textContent = w.label;
    document.getElementById("weather-icon").textContent = w.icon;
    if (w.condition === "rain") {
      document.body.classList.add("weather-rain");
      startRain();
    }
  }

  /* ---------- Cinematic rain canvas ---------- */
  function startRain() {
    const canvas = document.getElementById("rain-canvas");
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

  applyWeather(MOCK_WEATHER);

  /* ---------- Resume ---------- */
  document.getElementById("resume-btn").addEventListener("click", () => {
    // -> launch simulation engine for next unlocked module
    document.body.style.transition = "opacity 500ms var(--ease-cine)";
    document.body.style.opacity = "0";
    setTimeout(() => (window.location.href = "simulation.html"), 460);
  });
})();
