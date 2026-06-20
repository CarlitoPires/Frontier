/* ============================================================
 *  FRONTIER — In-Simulation NPC Dialogue HUD
 *  Scene: Customs Control (London · Block 04 · Module 11)
 *
 *  Implements the PRD Survival Panel:
 *   - Mental Translation (tap NPC line)
 *   - Earpiece / Ponto Eletronico (whispered pronunciation tip,
 *     spelled with the user's native-text sounds)
 *   - 3-Way Teleprompter: Basic | Fluent | Free Flight (+XP)
 *   - Impatient NPC: patience decays while you hesitate
 *   - Background noise degrades comprehension
 *   - Action -> Obstacle -> Consequence loop
 *
 *  All client-side / illustrative. Real grading comes from the AI
 *  engine via POST /api/modules/:id/grade (see backend).
 * ============================================================ */

(function () {
  "use strict";

  /* ---------- Scene script ---------- *
   * pron = native-text pronunciation (pt-BR speaker) per the
   * "Reverse Engineering of Speech" mechanic.                  */
  const TURNS = [
    {
      text: "Passport. What is the purpose of your visit?",
      tr: "Passaporte. Qual é o motivo da sua visita?",
      ear: "Relax the jaw. <b>“pér-pôs”</b>, not “purpouse”.",
      basic: "Tourism. One week.",
      fluent: "I'm here on holiday — staying about a week.",
    },
    {
      text: "Where are you staying while you're in London?",
      tr: "Onde você vai ficar enquanto estiver em Londres?",
      ear: "Soft ‘th’ in <b>“stay-ing”</b>; don't rush it.",
      basic: "A hotel in Camden.",
      fluent: "At a small hotel in Camden, near the market.",
    },
    {
      text: "Do you have a return ticket?",
      tr: "Você tem passagem de volta?",
      ear: "<b>“ri-TÂRN”</b> — stress the second part.",
      basic: "Yes, next Sunday.",
      fluent: "Yes — I fly back next Sunday evening.",
    },
  ];

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
  };

  /* ---------- Elements ---------- */
  const el = (id) => document.getElementById(id);
  const body = document.body;
  const npcLine = el("npc-line");
  const npcText = el("npc-text");
  const npcTrans = el("npc-translation");
  const tapHint = el("tap-hint");
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

  /* ---------- Rendering ---------- */
  function renderMeters() {
    patienceFill.style.width = state.patience + "%";
    noiseFill.style.width = state.noise + "%";
    patienceFill.classList.toggle("low", state.patience < 35);
    if (state.patience < 30) {
      npcMood.textContent = "Losing patience";
      body.classList.add("mood-hostile");
    } else if (state.patience > 70) {
      npcMood.textContent = "Impatient · Formal";
    }
  }

  function renderTurn() {
    const t = TURNS[state.turn];

    // NPC speaks (shimmer), then settles
    npcLine.classList.remove("revealed");
    npcLine.classList.add("speaking");
    npcText.textContent = t.text;
    npcTrans.textContent = t.tr;
    tapHint.textContent = "Tap for Mental Translation";
    setTimeout(() => npcLine.classList.remove("speaking"), 1400);

    // Teleprompter
    renderTeleprompter();

    // Earpiece
    if (state.earpiece) earpieceText.innerHTML = t.ear;

    micHint.textContent = "Hold the mic to respond";
  }

  function renderTeleprompter() {
    const t = TURNS[state.turn];
    if (state.mode === "free") {
      tpScript.hidden = true;
      tpFree.hidden = false;
    } else {
      tpScript.hidden = false;
      tpFree.hidden = true;
      tpText.textContent = state.mode === "fluent" ? t.fluent : t.basic;
    }
  }

  /* ---------- Mental Translation ---------- */
  npcLine.addEventListener("click", () => {
    npcLine.classList.toggle("revealed");
  });

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
    if (state.earpiece) earpieceText.innerHTML = TURNS[state.turn].ear;
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
    if (state.patience <= 0) endScene(false, "The officer waves the next traveller forward.");
  }, 700);

  /* ---------- Mic / respond loop ---------- */
  function startListening() {
    if (state.finished || state.listening) return;
    state.listening = true;
    micBtn.classList.add("listening");
    micHint.textContent = state.mode === "free" ? "Listening · Free Flight" : "Listening…";
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
    // Noise penalty — NPC mishears in a loud hall.
    const noisePenalty = state.noise > 50 ? 6 : 0;
    // Earpiece slightly improves delivery.
    const earBonus = state.earpiece ? 4 : 0;

    state.patience = Math.min(100, state.patience + 12 + earBonus - noisePenalty);
    state.xp += gain * (state.mode === "free" ? 1.4 : 1);
    renderMeters();

    micHint.textContent = noisePenalty ? "“Sorry? It's loud in here.”" : "Understood.";

    state.turn += 1;
    if (state.turn >= TURNS.length) {
      setTimeout(() => endScene(true), 700);
    } else {
      setTimeout(renderTurn, 700);
    }
  }

  // Pointer (works for mouse + touch) — hold to talk
  micBtn.addEventListener("pointerdown", (e) => { e.preventDefault(); startListening(); });
  micBtn.addEventListener("pointerup", stopListening);
  micBtn.addEventListener("pointerleave", () => { if (state.listening) stopListening(); });
  // Keyboard accessibility — space/enter toggles
  micBtn.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !state.listening) { e.preventDefault(); startListening(); }
  });
  micBtn.addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "Enter") stopListening();
  });

  /* ---------- Consequence ---------- */
  function endScene(passed, reason) {
    if (state.finished) return;
    state.finished = true;
    clearInterval(decay);

    const overlay = el("consequence");
    const score = Math.round(Math.min(100, 55 + state.patience * 0.4 + state.xp * 0.2));
    const passedFinal = passed && score >= 70;

    body.classList.toggle("mood-pleased", passedFinal);
    overlay.classList.toggle("rejected", !passedFinal);

    el("stamp-text").textContent = passedFinal ? "ADMITTED" : "DENIED";
    el("conseq-label").textContent = passedFinal ? "Consequence · Passed" : "Consequence · Failed";
    el("conseq-title").textContent = passedFinal ? "Entry Granted" : "Entry Refused";
    el("conseq-body").textContent = passedFinal
      ? "The officer stamps your passport and nods you through. Module 11 proficiency recorded."
      : reason || "You hesitated too long and the officer lost patience. Replay the module to proceed.";

    el("conseq-scores").innerHTML = `
      <span class="score-chip">Proficiency <b>${score}</b></span>
      <span class="score-chip">XP <b>+${Math.round(state.xp)}</b></span>
      <span class="score-chip">Mode <b>${state.mode === "free" ? "Free Flight" : state.mode}</b></span>`;

    el("conseq-continue").textContent = passedFinal ? "Continue to Module 12" : "Replay Module 11";
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
  }

  el("conseq-continue").addEventListener("click", () => {
    body.style.transition = "opacity 500ms var(--ease-cine)";
    body.style.opacity = "0";
    setTimeout(() => (window.location.href = "dashboard.html"), 480);
  });

  el("exit-btn").addEventListener("click", () => (window.location.href = "dashboard.html"));

  /* ---------- Boot ---------- */
  renderMeters();
  renderTurn();
})();
