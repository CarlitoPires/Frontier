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
  let learnerLevel = "absolute_beginner";  // adapts difficulty (from profile.level)
  let sceneSelfie = false;                 // bonus modules with triggerSelfieShare
  let sceneSelfieOverlay = null;           // optional per-module overlay copy

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
    decayRate: 1.1,
    speakRate: 1.0,
    accs: [],         // per-step pronunciation accuracy (0..1)
    retries: 0,       // retries on the current step
    struggleHits: 0,  // steps that needed a retry / scored low
    transcript: "",   // last speech-to-text result
    pendingEval: false,
    rec: null,        // active SpeechRecognition instance
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
      sceneSelfie = !!content.triggerSelfieShare;
      sceneSelfieOverlay = content.selfieOverlay || null;
    } else {
      TURNS = DEFAULT_TURNS;
      sceneThreshold = 80;
      sceneTitleObj = null;
      state.baseNoise = 24;
      sceneSelfie = false;
      sceneSelfieOverlay = null;
    }
    renderSceneTitle();

    // Hand the soundscape to the audio engine (phase → texture, mood/noise → pressure).
    if (window.LBAudio) {
      window.LBAudio.setScene({
        phase: (content && content.phase) || 1,
        mood: (content && content.environment && content.environment.mood) || "neutral",
        baseNoise: state.baseNoise,
        rain: !!(content && content.environment && content.environment.rain),
      });
    }

    // Reset the run for the (re)loaded scene, ADAPTED to the learner's level:
    //  - Absolute Beginner: forgiving patience, slow decay, earpiece auto-on, Basic script.
    //  - Intermediate: balanced.
    //  - Fluent: less patience, faster decay, Free Flight (open mic, no script).
    const lv = learnerLevel;
    state.turn = 0;
    state.patience = lv === "fluent" ? 70 : lv === "intermediate" ? 78 : 90;
    state.decayRate = lv === "fluent" ? 1.5 : lv === "intermediate" ? 1.1 : 0.75;
    state.mode = lv === "fluent" ? "free" : "basic";
    state.earpiece = lv === "absolute_beginner";   // beginners always hear the earpiece
    state.noise = state.baseNoise;
    state.xp = 0; state.listening = false; state.finished = false; state.conseq = null;
    state.accs = []; state.retries = 0; state.struggleHits = 0; state.transcript = ""; state.pendingEval = false;
    state.speakRate = 1.0;

    // Slow-tempo assist (set when the learner struggled in a previous module).
    if (window.LBProgress && window.LBProgress.assist) {
      state.decayRate *= 0.7;     // more time
      state.speakRate = 0.85;     // NPC speaks more slowly
      state.earpiece = true;      // keep the earpiece on
    }

    earpiece.hidden = !state.earpiece;
    earpieceBtn.setAttribute("aria-pressed", String(state.earpiece));
    document.querySelectorAll(".tp-mode").forEach((b) => b.classList.toggle("active", b.dataset.mode === state.mode));
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
    if (window.LBAudio) window.LBAudio.setIntensity(state.noise / 100);  // ambient swells with noise
    if (state.patience < 30) {
      npcMood.textContent = I18n.t("npc.moodLosing");
      body.classList.add("mood-hostile");
    } else if (state.patience > 70) {
      npcMood.textContent = I18n.t("npc.moodImpatient");
    }
  }

  // Speak the current NPC line aloud (Web Speech API, via LBAudio).
  function speakCurrent(rate) {
    if (window.LBAudio && inBounds()) window.LBAudio.speakLine(TURNS[state.turn].text, rate || state.speakRate);
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
    speakCurrent();   // voice the NPC line aloud
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

  /* ---------- Audio: replay at speed + sound toggle ---------- */
  const replaySlow = el("replay-slow");
  const replayNatural = el("replay-natural");
  const soundToggle = el("sound-toggle");
  if (replaySlow) replaySlow.addEventListener("click", () => window.LBAudio && window.LBAudio.replay(0.7));
  if (replayNatural) replayNatural.addEventListener("click", () => window.LBAudio && window.LBAudio.replay(1.0));
  if (soundToggle) soundToggle.addEventListener("click", () => {
    const m = window.LBAudio ? window.LBAudio.toggleMute() : false;
    soundToggle.textContent = m ? "\uD83D\uDD07" : "\uD83D\uDD0A";  // 🔇 / 🔊
    soundToggle.setAttribute("aria-pressed", String(!m));
  });

  /* ---------- Patience decay (the "impatient NPC" pressure) ---------- */
  const decay = setInterval(() => {
    if (state.finished || state.listening) return;
    state.patience = Math.max(0, state.patience - (state.decayRate || 1.1));
    // Noise drifts organically; high noise eats extra patience.
    state.noise = Math.min(72, Math.max(8, state.noise + (Math.random() - 0.5) * 9));
    if (state.noise > 55) state.patience = Math.max(0, state.patience - 0.6);
    renderMeters();
    if (state.patience <= 0) endScene(false, "conseq.reasonImpatient");
  }, 700);

  /* ---------- Mic / respond loop (voice scoring) ---------- */
  const STOP_WORDS = new Set(["a","an","the","i","you","to","of","is","it","please","and","my","me","at","in","on","for","im","i'm"]);
  function normalize(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9\s']/g, " ").replace(/\s+/g, " ").trim();
  }
  function expectedPhrase() {
    const t = currentTurn();
    return (state.mode === "fluent" || state.mode === "free") ? t.fluent : t.basic;
  }
  // Token-coverage accuracy of the transcript against the expected phrase (0..1).
  function scoreTranscript(transcript, expected) {
    const exp = normalize(expected).split(" ").filter((w) => w && !STOP_WORDS.has(w));
    const got = new Set(normalize(transcript).split(" "));
    if (!exp.length) return transcript ? 0.8 : 0;
    if (normalize(transcript) === normalize(expected)) return 1;
    const matched = exp.filter((w) => got.has(w)).length;
    return matched / exp.length;
  }

  function startListening() {
    if (state.finished || state.listening) return;
    state.listening = true;
    state.transcript = "";
    micBtn.classList.add("listening");
    micHint.textContent = I18n.t(state.mode === "free" ? "mic.listeningFree" : "mic.listening");

    if (window.LBAudio && window.LBAudio.canListen && window.LBAudio.canListen()) {
      state.rec = window.LBAudio.startListen({
        lang: "en-GB",
        onresult: (t) => { state.transcript = t; },
        onend: () => { if (state.pendingEval) { state.pendingEval = false; finishSpoken(); } },
        onerror: () => {},
      });
    }
  }

  function stopListening() {
    if (!state.listening) return;
    state.listening = false;
    micBtn.classList.remove("listening");

    if (state.rec) {
      state.pendingEval = true;
      try { state.rec.stop(); } catch (e) {}
      state.rec = null;
      // Safety net if onend never fires.
      setTimeout(() => { if (state.pendingEval) { state.pendingEval = false; finishSpoken(); } }, 1600);
    } else {
      // No speech recognition available — fall back to a neutral pass-through.
      evaluateResponse(0.72, null);
    }
  }

  function finishSpoken() {
    const acc = scoreTranscript(state.transcript, expectedPhrase());
    evaluateResponse(acc, state.transcript);
  }

  // accuracy 0..1 from voice scoring. Low score -> the NPC asks you to retry.
  function evaluateResponse(accuracy, transcript) {
    const noisePenalty = state.noise > 55 ? 0.12 : 0;   // a loud hall hurts recognition
    const eff = Math.max(0, Math.min(1, accuracy - noisePenalty));
    const STEP_PASS = 0.5;

    if (eff < STEP_PASS && state.retries < 2) {
      state.retries += 1;
      state.struggleHits += 1;
      state.patience = Math.max(0, state.patience - 9);
      micHint.textContent = transcript ? ("“" + transcript + "” — " + I18n.t("mic.retry")) : I18n.t("mic.retry");
      if (window.LBAudio) window.LBAudio.speakLine(currentTurn().text, 0.72);  // slow, clear retry prompt
      renderMeters();
      if (state.patience <= 0) endScene(false, "conseq.reasonImpatient");
      return; // stay on the same step
    }

    // Accepted.
    state.accs.push(eff);
    if (eff < 0.7) state.struggleHits += 1;
    const base = state.mode === "free" ? 16 : 11;
    state.xp += base * (0.5 + eff);
    state.patience = Math.min(100, state.patience + 6 + eff * 10);
    state.retries = 0;
    renderMeters();
    micHint.textContent = transcript ? ("“" + transcript + "”") : I18n.t(eff > 0.8 ? "mic.great" : "mic.hint");

    state.turn += 1;
    if (state.turn >= TURNS.length) setTimeout(() => endScene(true), 800);
    else setTimeout(renderTurn, 800);
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

    const avgAcc = state.accs.length ? state.accs.reduce((a, b) => a + b, 0) / state.accs.length : 0.7;
    const totalRetries = state.struggleHits;
    const score = Math.round(Math.min(100, 38 + avgAcc * 46 + state.patience * 0.16));
    const passedFinal = passed && score >= sceneThreshold;   // scene threshold (>= rules' 80)

    state.conseq = { passedFinal: passedFinal, score: score, xp: Math.round(state.xp), reasonKey: reasonKey, selfie: sceneSelfie && passedFinal };

    body.classList.toggle("mood-pleased", passedFinal);
    el("consequence").classList.toggle("rejected", !passedFinal);

    // Write the result through the Hard Gate, with real metrics for the radar.
    try {
      if (window.LBProgress && typeof window.LBProgress.submit === "function") {
        const writeScore = passedFinal ? Math.max(score, 80) : Math.min(score, 79);
        const assist = state.struggleHits >= 2;
        const res = await window.LBProgress.submit(writeScore, {
          assist: assist,
          accuracy: avgAcc,
          patienceEnd: state.patience,
          retries: totalRetries,
          mode: state.mode,
        });
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
    const shareBtn = el("share-victory");
    if (shareBtn) shareBtn.hidden = !c.selfie;   // viral loop: only on bonus victory
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

  /* ---------- Viral loop: victory selfie (bonus modules) ---------- */
  const shareVictoryBtn = el("share-victory");
  if (shareVictoryBtn) shareVictoryBtn.addEventListener("click", () => {
    const ov = sceneSelfieOverlay || {};
    if (window.LBSelfie) window.LBSelfie.open({
      eyebrow: ov.eyebrow || "London Tourist",
      title: I18n.t("conseq.shareTitle"),
      captureLabel: I18n.t("conseq.capture"),
      shareLabel: I18n.t("conseq.share"),
      retakeLabel: I18n.t("conseq.retake"),
      closeLabel: I18n.t("conseq.close"),
      tagline: ov.tagline || "London Tourist — Survived Day 1",
      shareText: ov.shareText || "I survived my first day in London with LinguoBound! \uD83C\uDDEC\uD83C\uDDE7",
    });
  });

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
    if (window.LBProgress && window.LBProgress.level) learnerLevel = window.LBProgress.level;
    if (window.LBProgress && window.LBProgress.module) adoptModule(window.LBProgress.module);
  });

  /* ---------- Boot ---------- */
  if (window.LBProgress && window.LBProgress.level) learnerLevel = window.LBProgress.level;
  renderSceneMeta();
  loadScene(null); // default scene until the real module/content arrives
  if (window.LBProgress && window.LBProgress.module) adoptModule(window.LBProgress.module);
})();
