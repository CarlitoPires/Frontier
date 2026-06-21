/* ============================================================
 *  LinguoBound — In-Simulation NPC Dialogue HUD
 *  Scene: Customs Control (London · Block 04 · Module 11)
 *
 *  Implements the PRD Survival Panel:
 *   - Mental Translation (tap NPC line)
 *   - Earpiece / Ponto Eletronico (whispered pronunciation tip)
 *   - 3-Way Teleprompter: Basic | Fluent | Free Flight (+XP)
 *   - Impatient NPC: patience decays while you hesitate
 *   - Background noise degrades comprehension
 *   - Action -> Obstacle -> Consequence loop
 *
 *  LOCALIZATION: UI chrome & system feedback go through I18n.t and
 *  re-render on "i18n:change". NPC LEARNING CONTENT (text / basic /
 *  fluent — the English the user is practising) ALWAYS stays English.
 *  The mental translation (tr) and pronunciation tip (ear) are
 *  provided per UI language.
 *
 *  All client-side / illustrative. Real grading comes from the AI
 *  engine via POST /api/modules/:id/grade (see backend).
 * ============================================================ */

(function () {
  "use strict";

  /* ---------- Default scene (fallback when no content doc) ----------
   * text/basic/fluent: ENGLISH learning content — never translated. */
  const DEFAULT_TURNS = [
    {
      text: "Passport. What is the purpose of your visit?",
      tr: {
        "pt-BR": "Passaporte. Qual é o motivo da sua visita?",
        en: "He's asking why you're visiting.",
      },
      ear: {
        "pt-BR": "Relaxe a mandíbula. <b>“pér-pôs”</b>, não “purpouse”.",
        en: "Relax the jaw. <b>“pur-puhs”</b>, not “purpouse”.",
      },
      basic: "Tourism. One week.",
      fluent: "I'm here on holiday — staying about a week.",
    },
    {
      text: "Where are you staying while you're in London?",
      tr: {
        "pt-BR": "Onde você vai ficar enquanto estiver em Londres?",
        en: "He's asking where you'll be staying.",
      },
      ear: {
        "pt-BR": "‘th’ suave em <b>“stay-ing”</b>; não tenha pressa.",
        en: "Soft ‘th’ in <b>“stay-ing”</b>; don't rush it.",
      },
      basic: "A hotel in Camden.",
      fluent: "At a small hotel in Camden, near the market.",
    },
    {
      text: "Do you have a return ticket?",
      tr: {
        "pt-BR": "Você tem passagem de volta?",
        en: "He's asking if you have a ticket back.",
      },
      ear: {
        "pt-BR": "<b>“ri-TÂRN”</b> — enfatize a segunda parte.",
        en: "<b>“ri-TURN”</b> — stress the second part.",
      },
      basic: "Yes, next Sunday.",
      fluent: "Yes — I fly back next Sunday evening.",
    },
  ];

  // Pick the localized variant of a content field, falling back to EN.
  function L(obj) {
    return obj[I18n.getLang()] || obj.en;
  }

  // Active scene (replaced by loadScene when real content arrives).
  let TURNS = DEFAULT_TURNS;
  let sceneThreshold = 80;       // must stay >= firestore.rules threshold (80)
  let sceneTitleObj = null;      // localized {en, pt-BR} when content-driven

  /* ---------- State ---------- */
  const state = {
    turn: 0,
    patience: 78,     // 0..100, decays while idle
    noise: 24,        // 0..100, fluctuates
    mode: "basic",    // basic | fluent | free
    earpiece: false,
    xp: 0,
    listening: false,
    finished: false,
    conseq: null,     // {passed, score, xp, mode, reasonKey} for re-render
  };

  /* ---------- Elements ---------- */
  const el = (id) => document.getElementById(id);
  const body = document.body;
  const npcLine = el("npc-line");
  const npcText = el("npc-text");
  const npcTrans = el("npc-translation");
  const npcMood = el("npc-mood");
  const patienceFill = el("patience-fill");
  const noiseFill = el("noise-fill");
  const tpText = el("tp-text");
  const tpScript = el("tp-script");
  const tpFree = el("tp-freeflight");
  const earpiece = el("earpiece");
  const earpieceText = el("earpiece-text");
  const earpieceBtn = el("earpiece-btn");
  const micBtn = el("mic-btn");
  const micHint = el("mic-hint");

  const inBounds = () => state.turn < TURNS.length;
  const currentTurn = () => TURNS[Math.min(state.turn, TURNS.length - 1)];

  // Scene reference — updated from the real session (window.LBProgress.module).
  const sceneRef = { seq: 11, block: "04" };

  /* ---------- Rendering ---------- */
  function renderSceneMeta() {
    el("scene-loc").textContent = I18n.t("sim.location", {
      city: I18n.t("city.London"),
      block: sceneRef.block,
      module: String(sceneRef.seq),
    });
  }

  function adoptModule(mod) {
    if (!mod) return;
    sceneRef.seq = mod.sequence;
    sceneRef.block = String(mod.blockId).padStart(2, "0");
    renderSceneMeta();
    if (mod.content) loadScene(mod.content);
  }

  function renderSceneTitle() {
    const t = document.querySelector(".scene-title");
    if (!t) return;
    if (sceneTitleObj) { t.removeAttribute("data-i18n"); t.textContent = L(sceneTitleObj); }
  }

  // Swap in a content-driven scene and reset the run state.
  function loadScene(content) {
    if (content && Array.isArray(content.dialogueSteps) && content.dialogueSteps.length) {
      TURNS = content.dialogueSteps;
      sceneThreshold = content.threshold || 80;
      sceneTitleObj = content.sceneTitle || null;
      if (content.npc) {
        if (content.npc.name) { const n = el("npc-name"); n.removeAttribute("data-i18n"); n.textContent = L(content.npc.name); }
        if (content.npc.initials) { const a = el("npc-avatar"); a.removeAttribute("data-i18n"); a.textContent = content.npc.initials; }
      }
      const env = content.environment || {};
      body.classList.toggle("mood-hostile", env.mood === "hostile");
      body.classList.toggle("mood-pleased", env.mood === "pleased");
      state.baseNoise = typeof env.baseNoise === "number" ? env.baseNoise : 24;
    } else {
      TURNS = DEFAULT_TURNS;
      sceneThreshold = 80;
      sceneTitleObj = null;
      state.baseNoise = 24;
    }
    renderSceneTitle();

    // Reset the run for the (re)loaded scene.
    state.turn = 0; state.patience = 78; state.noise = state.baseNoise;
    state.mode = "basic"; state.earpiece = false; state.xp = 0;
    state.listening = false; state.finished = false; state.conseq = null;

    earpiece.hidden = true; earpieceBtn.setAttribute("aria-pressed", "false");
    document.querySelectorAll(".tp-mode").forEach((b) => b.classList.toggle("active", b.dataset.mode === "basic"));
    el("consequence").classList.remove("active", "rejected");
    el("consequence").setAttribute("aria-hidden", "true");
    npcLine.classList.remove("revealed");

    renderMeters();
    renderTurn();
  }

  function renderMeters() {
    patienceFill.style.width = state.patience + "%";
    noiseFill.style.width = state.noise + "%";
    patienceFill.classList.toggle("low", state.patience < 35);
    if (state.patience < 30) {
      npcMood.textContent = I18n.t("npc.moodLosing");
      body.classList.add("mood-hostile");
    } else if (state.patience > 70) {
      npcMood.textContent = I18n.t("npc.moodImpatient");
    }
  }

  // Update the localized dialogue content WITHOUT the speaking shimmer
  // (used on language change so we don't replay the animation).
  function applyTurnContent() {
    if (!inBounds()) return;
    const t = TURNS[state.turn];
    npcText.textContent = t.text;          // EN learning content
    npcTrans.textContent = L(t.tr);        // localized mental translation
    if (state.earpiece) earpieceText.innerHTML = L(t.ear);
    renderTeleprompter();
  }

  function renderTurn() {
    // NPC speaks (shimmer), then settles
    npcLine.classList.remove("revealed");
    npcLine.classList.add("speaking");
    applyTurnContent();
    setTimeout(() => npcLine.classList.remove("speaking"), 1400);
    micHint.textContent = I18n.t("mic.hint");
  }

  function renderTeleprompter() {
    const t = currentTurn();
    if (state.mode === "free") {
      tpScript.hidden = true;
      tpFree.hidden = false;
    } else {
      tpScript.hidden = false;
      tpFree.hidden = true;
      tpText.textContent = state.mode === "fluent" ? t.fluent : t.basic; // EN
    }
  }

  /* ---------- Mental Translation ---------- */
  npcLine.addEventListener("click", () => npcLine.classList.toggle("revealed"));

  /* ---------- Teleprompter mode switch ---------- */
  document.querySelectorAll(".tp-mode").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tp-mode").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.mode = btn.dataset.mode;
      renderTeleprompter();
    });
  });

  /* ---------- Earpiece toggle ---------- */
  earpieceBtn.addEventListener("click", () => {
    state.earpiece = !state.earpiece;
    earpieceBtn.setAttribute("aria-pressed", String(state.earpiece));
    earpiece.hidden = !state.earpiece;
    if (state.earpiece) earpieceText.innerHTML = L(currentTurn().ear);
  });

  /* ---------- Translate button (mirror of tapping the line) ---------- */
  el("translate-btn").addEventListener("click", () => npcLine.classList.add("revealed"));

  /* ---------- Patience decay (the "impatient NPC" pressure) ---------- */
  const decay = setInterval(() => {
    if (state.finished || state.listening) return;
    state.patience = Math.max(0, state.patience - 1.1);
    // Noise drifts organically; high noise eats extra patience.
    state.noise = Math.min(72, Math.max(8, state.noise + (Math.random() - 0.5) * 9));
    if (state.noise > 55) state.patience = Math.max(0, state.patience - 0.6);
    renderMeters();
    if (state.patience <= 0) endScene(false, "conseq.reasonImpatient");
  }, 700);

  /* ---------- Mic / respond loop ---------- */
  function startListening() {
    if (state.finished || state.listening) return;
    state.listening = true;
    micBtn.classList.add("listening");
    micHint.textContent = I18n.t(state.mode === "free" ? "mic.listeningFree" : "mic.listening");
  }

  function stopListening() {
    if (!state.listening) return;
    state.listening = false;
    micBtn.classList.remove("listening");
    evaluateResponse();
  }

  function evaluateResponse() {
    // Illustrative scoring. Real value comes from the AI engine.
    let gain = state.mode === "free" ? 14 : state.mode === "fluent" ? 10 : 7;
    const noisePenalty = state.noise > 50 ? 6 : 0;  // NPC mishears in a loud hall
    const earBonus = state.earpiece ? 4 : 0;

    state.patience = Math.min(100, state.patience + 12 + earBonus - noisePenalty);
    state.xp += gain * (state.mode === "free" ? 1.4 : 1);
    renderMeters();

    // NPC's spoken reactions stay in English (immersion / learning).
    micHint.textContent = noisePenalty ? "“Sorry? It's loud in here.”" : "Understood.";

    state.turn += 1;
    if (state.turn >= TURNS.length) {
      setTimeout(() => endScene(true), 700);
    } else {
      setTimeout(renderTurn, 700);
    }
  }

  // Pointer (mouse + touch) — hold to talk
  micBtn.addEventListener("pointerdown", (e) => { e.preventDefault(); startListening(); });
  micBtn.addEventListener("pointerup", stopListening);
  micBtn.addEventListener("pointerleave", () => { if (state.listening) stopListening(); });
  // Keyboard accessibility
  micBtn.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !state.listening) { e.preventDefault(); startListening(); }
  });
  micBtn.addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "Enter") stopListening();
  });

  /* ---------- Consequence ---------- */
  async function endScene(passed, reasonKey) {
    if (state.finished) return;
    state.finished = true;
    clearInterval(decay);

    const score = Math.round(Math.min(100, 55 + state.patience * 0.4 + state.xp * 0.2));
    const passedFinal = passed && score >= sceneThreshold;   // scene threshold (>= rules' 80)

    state.conseq = { passedFinal: passedFinal, score: score, xp: Math.round(state.xp), reasonKey: reasonKey };

    body.classList.toggle("mood-pleased", passedFinal);
    el("consequence").classList.toggle("rejected", !passedFinal);

    // Write the result through the Hard Gate. The score we send is aligned
    // to the verdict so Firestore never records a PASS the HUD called a fail.
    try {
      if (window.LBProgress && typeof window.LBProgress.submit === "function") {
        const writeScore = passedFinal ? Math.max(score, 80) : Math.min(score, 79);
        const res = await window.LBProgress.submit(writeScore);
        if (res && res.error) console.warn("[LinguoBound] gate rejected write:", res.error);
      }
    } catch (e) { /* offline / rules — UI still shows the verdict */ }

    renderConsequence();
    el("consequence").classList.add("active");
    el("consequence").setAttribute("aria-hidden", "false");
  }

  // Localized (re)render of the consequence card — safe to call on language change.
  function renderConsequence() {
    const c = state.conseq;
    if (!c) return;
    el("stamp-text").textContent = I18n.t(c.passedFinal ? "conseq.stampAdmitted" : "conseq.stampDenied");
    el("conseq-label").textContent = I18n.t(c.passedFinal ? "conseq.labelPassed" : "conseq.labelFailed");
    el("conseq-title").textContent = I18n.t(c.passedFinal ? "conseq.titleGranted" : "conseq.titleRefused");
    el("conseq-body").textContent = c.passedFinal
      ? I18n.t("conseq.bodyPass")
      : I18n.t(c.reasonKey || "conseq.bodyFail");
    el("conseq-scores").innerHTML =
      `<span class="score-chip">${I18n.t("conseq.chipProficiency")} <b>${c.score}</b></span>` +
      `<span class="score-chip">${I18n.t("conseq.chipXp")} <b>+${c.xp}</b></span>` +
      `<span class="score-chip">${I18n.t("conseq.chipMode")} <b>${I18n.t("mode." + state.mode)}</b></span>`;
    el("conseq-continue").textContent = I18n.t(c.passedFinal ? "conseq.continueNext" : "conseq.replay");
  }

  el("conseq-continue").addEventListener("click", () => {
    // Pass -> back to the dashboard (now showing advanced progress).
    // Fail -> replay the same (still-current) module.
    const dest = (state.conseq && state.conseq.passedFinal) ? "dashboard.html" : "simulation.html";
    body.style.transition = "opacity 500ms var(--ease-cine)";
    body.style.opacity = "0";
    setTimeout(() => (window.location.href = dest), 480);
  });

  el("exit-btn").addEventListener("click", () => (window.location.href = "dashboard.html"));

  /* ---------- Language change: re-render localized content ---------- */
  window.addEventListener("i18n:change", () => {
    renderSceneMeta();
    renderSceneTitle();
    renderMeters();
    if (inBounds()) applyTurnContent();
    if (state.finished) renderConsequence();
  });

  /* ---------- Real session: adopt the actual current module + content ---------- */
  window.addEventListener("lb:session", () => {
    if (window.LBProgress && window.LBProgress.module) adoptModule(window.LBProgress.module);
  });

  /* ---------- Boot ---------- */
  renderSceneMeta();
  loadScene(null); // default scene until the real module/content arrives
  if (window.LBProgress && window.LBProgress.module) adoptModule(window.LBProgress.module);
})();
