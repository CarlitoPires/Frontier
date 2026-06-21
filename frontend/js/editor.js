/* ============================================================
 *  LinguoBound — Content Editor logic (the factory)
 *
 *  Load / create / edit a module and save it straight to the Firestore
 *  `content/{sequence}` collection (admin-only per firestore.rules).
 *  Lets the Architect build all 500 modules from forms — no source code.
 * ============================================================ */

import { auth, db, isAdmin, onAuthStateChanged, doc, getDoc, setDoc, CONFIG_READY } from "./firebase-init.js";
import { BLOCK0_BY_SEQUENCE } from "./content-block0.js";

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const intv = (v, d) => (Number.isFinite(parseInt(v, 10)) ? parseInt(v, 10) : d);
  let model = blankModule(21);

  /* ---------- model helpers ---------- */
  function blankStep() {
    return { text: "", tr: { en: "", "pt-BR": "" }, ear: { en: "", "pt-BR": "" }, audioPrompt: "", basic: "", fluent: "" };
  }
  function blankModule(seq) {
    return {
      sequence: seq,
      phase: seq <= 12 ? 1 : seq <= 16 ? 2 : 3,
      blockId: Math.ceil(seq / 25),
      indexInBlock: ((seq - 1) % 25) + 1,
      threshold: 80,
      sceneTitle: { en: "", "pt-BR": "" },
      contextDescription: { en: "", "pt-BR": "" },
      objective: { en: "", "pt-BR": "" },
      environment: { mood: "neutral", baseNoise: 40 },
      npc: { name: { en: "", "pt-BR": "" }, initials: "" },
      drills: [],
      dialogueSteps: [blankStep()],
    };
  }
  function ensureShape(m) {
    m.sceneTitle = m.sceneTitle || { en: "", "pt-BR": "" };
    m.contextDescription = m.contextDescription || { en: "", "pt-BR": "" };
    m.objective = m.objective || { en: "", "pt-BR": "" };
    m.environment = m.environment || { mood: "neutral", baseNoise: 40 };
    m.npc = m.npc || { name: { en: "", "pt-BR": "" }, initials: "" };
    m.npc.name = m.npc.name || { en: "", "pt-BR": "" };
    m.drills = Array.isArray(m.drills) ? m.drills : [];
    m.dialogueSteps = Array.isArray(m.dialogueSteps) && m.dialogueSteps.length ? m.dialogueSteps : [blankStep()];
    return m;
  }

  // dotted path get/set with 'pt' -> 'pt-BR' aliasing.
  function assign(target, path, value) {
    const p = path.split(".");
    if (p.length === 1) { target[p[0]] = value; return; }
    const k1 = p[1] === "pt" ? "pt-BR" : p[1];
    target[p[0]] = target[p[0]] || {};
    target[p[0]][k1] = value;
  }
  function read(obj, path) {
    const p = path.split(".");
    if (p.length === 1) return obj[p[0]] != null ? obj[p[0]] : "";
    const k1 = p[1] === "pt" ? "pt-BR" : p[1];
    return obj[p[0]] && obj[p[0]][k1] != null ? obj[p[0]][k1] : "";
  }

  /* ---------- dynamic lists ---------- */
  function stepCardHTML(i) {
    return (
      '<div class="step-card" data-index="' + i + '">' +
        '<div class="step-head"><span class="step-no">Passo ' + (i + 1) + '</span>' +
          '<div class="step-ctl">' +
            '<button type="button" class="icon-btn" data-act="up" title="Subir">&#8593;</button>' +
            '<button type="button" class="icon-btn" data-act="down" title="Descer">&#8595;</button>' +
            '<button type="button" class="icon-btn del" data-act="del" title="Remover">&#10005;</button>' +
          '</div>' +
        '</div>' +
        '<label>Fala do NPC — inglês (conteúdo de aprendizado)<input data-f="text" type="text" /></label>' +
        '<div class="two-col"><label>Tradução mental (EN)<input data-f="tr.en" type="text" /></label>' +
          '<label>Tradução mental (PT)<input data-f="tr.pt" type="text" /></label></div>' +
        '<div class="two-col"><label>Pronúncia (EN)<input data-f="ear.en" type="text" /></label>' +
          '<label>Pronúncia (PT)<input data-f="ear.pt" type="text" /></label></div>' +
        '<label>Prompt de áudio (TTS / ponto)<input data-f="audioPrompt" type="text" /></label>' +
        '<div class="two-col"><label>Resposta básica (EN)<input data-f="basic" type="text" /></label>' +
          '<label>Resposta fluente (EN)<input data-f="fluent" type="text" /></label></div>' +
      '</div>'
    );
  }
  function drillRowHTML(i) {
    return (
      '<div class="drill-row" data-index="' + i + '">' +
        '<label>Palavra/frase<input data-f="word" type="text" /></label>' +
        '<label>Som (pt-BR)<input data-f="say" type="text" /></label>' +
        '<label>Nota (EN)<input data-f="note.en" type="text" /></label>' +
        '<label>Nota (PT)<input data-f="note.pt" type="text" /></label>' +
        '<button type="button" class="icon-btn del" data-act="del" title="Remover">&#10005;</button>' +
      '</div>'
    );
  }
  function renderSteps() {
    const c = $("steps");
    c.innerHTML = model.dialogueSteps.map((_, i) => stepCardHTML(i)).join("");
    model.dialogueSteps.forEach((s, i) => {
      c.querySelector('.step-card[data-index="' + i + '"]').querySelectorAll("[data-f]")
        .forEach((inp) => { inp.value = read(s, inp.getAttribute("data-f")); });
    });
  }
  function renderDrills() {
    const c = $("drills");
    c.innerHTML = model.drills.map((_, i) => drillRowHTML(i)).join("");
    model.drills.forEach((d, i) => {
      c.querySelector('.drill-row[data-index="' + i + '"]').querySelectorAll("[data-f]")
        .forEach((inp) => { inp.value = read(d, inp.getAttribute("data-f")); });
    });
  }

  /* ---------- form <-> model ---------- */
  function syncLists() {
    const steps = [];
    document.querySelectorAll("#steps .step-card").forEach((card) => {
      const s = { text: "", tr: {}, ear: {}, audioPrompt: "", basic: "", fluent: "" };
      card.querySelectorAll("[data-f]").forEach((inp) => assign(s, inp.getAttribute("data-f"), inp.value));
      steps.push(s);
    });
    model.dialogueSteps = steps.length ? steps : [blankStep()];

    const drills = [];
    document.querySelectorAll("#drills .drill-row").forEach((row) => {
      const d = { word: "", say: "", note: {} };
      row.querySelectorAll("[data-f]").forEach((inp) => assign(d, inp.getAttribute("data-f"), inp.value));
      if (d.word || d.say) drills.push(d);
    });
    model.drills = drills;
  }
  function syncScalars() {
    model.sequence = intv($("f-seq").value, 1);
    model.phase = intv($("f-phase").value, 1);
    model.blockId = intv($("f-block").value, Math.ceil(model.sequence / 25));
    model.indexInBlock = intv($("f-index").value, ((model.sequence - 1) % 25) + 1);
    model.threshold = Math.max(80, intv($("f-threshold").value, 80));
    model.sceneTitle = { en: $("f-title-en").value, "pt-BR": $("f-title-pt").value };
    model.contextDescription = { en: $("f-context-en").value, "pt-BR": $("f-context-pt").value };
    model.objective = { en: $("f-obj-en").value, "pt-BR": $("f-obj-pt").value };
    model.environment = { mood: $("f-mood").value, baseNoise: intv($("f-noise").value, 40) };
    model.npc = { name: { en: $("f-npc-en").value, "pt-BR": $("f-npc-pt").value }, initials: $("f-npc-initials").value };
  }
  function collect() { syncScalars(); syncLists(); return model; }

  function populate(m) {
    model = ensureShape(m);
    $("f-seq").value = model.sequence;
    $("f-phase").value = model.phase || 1;
    $("f-block").value = model.blockId || Math.ceil(model.sequence / 25);
    $("f-index").value = model.indexInBlock || ((model.sequence - 1) % 25) + 1;
    $("f-threshold").value = model.threshold || 80;
    $("f-title-en").value = read(model, "sceneTitle.en");
    $("f-title-pt").value = read(model, "sceneTitle.pt");
    $("f-context-en").value = read(model, "contextDescription.en");
    $("f-context-pt").value = read(model, "contextDescription.pt");
    $("f-obj-en").value = read(model, "objective.en");
    $("f-obj-pt").value = read(model, "objective.pt");
    $("f-mood").value = model.environment.mood || "neutral";
    $("f-noise").value = model.environment.baseNoise != null ? model.environment.baseNoise : 40;
    $("f-noise-out").textContent = $("f-noise").value;
    $("f-npc-en").value = read(model.npc, "name.en");
    $("f-npc-pt").value = read(model.npc, "name.pt");
    $("f-npc-initials").value = model.npc.initials || "";
    renderDrills();
    renderSteps();
    updatePlayLink();
  }

  /* ---------- status / validation ---------- */
  function status(msg, err) {
    const el = $("ed-status");
    el.textContent = msg;
    el.classList.toggle("err", !!err);
  }
  function validate(m) {
    const e = [];
    if (!(m.sequence >= 1 && m.sequence <= 500)) e.push("Sequência deve estar entre 1 e 500.");
    if (m.threshold < 80) e.push("Threshold deve ser ≥ 80 (regra do Hard Gate).");
    if (!read(m, "sceneTitle.en")) e.push("Título da cena (EN) é obrigatório.");
    if (!m.dialogueSteps.length || !m.dialogueSteps.some((s) => s.text)) e.push("Adicione ao menos um passo com fala do NPC.");
    return e;
  }
  function updatePlayLink() {
    $("play-link").href = "simulation.html?seq=" + (intv($("f-seq").value, model.sequence) || 1);
  }

  /* ---------- load / save ---------- */
  async function loadModule(seq) {
    status("Carregando módulo " + seq + "…");
    let data = null;
    if (CONFIG_READY) {
      try { const s = await getDoc(doc(db, "content", String(seq))); if (s.exists()) data = s.data(); } catch (e) {}
    }
    if (!data && BLOCK0_BY_SEQUENCE[seq]) data = JSON.parse(JSON.stringify(BLOCK0_BY_SEQUENCE[seq]));
    if (!data) { populate(blankModule(seq)); status("Módulo " + seq + " não existe — criando do zero."); }
    else { populate(data); status("Módulo " + seq + " carregado" + (CONFIG_READY ? "." : " (fonte: pacote local).")); }
  }

  async function saveModule() {
    collect();
    const errs = validate(model);
    if (errs.length) { status(errs[0], true); return; }
    if (!CONFIG_READY) { status("Pré-visualização: configure o Firebase para salvar.", true); return; }
    status("Salvando…");
    try {
      await setDoc(doc(db, "content", String(model.sequence)), model);  // full replace
      status("✓ Salvo em content/" + model.sequence + ".");
    } catch (e) {
      status("Falha ao salvar: " + ((e && e.code) || (e && e.message) || "erro"), true);
    }
  }

  /* ---------- wiring ---------- */
  function wire() {
    $("load-btn").addEventListener("click", () => loadModule(intv($("load-seq").value, 21)));
    $("new-btn").addEventListener("click", () => { populate(blankModule(intv($("load-seq").value, 21))); status("Novo módulo em branco."); });
    $("save-btn").addEventListener("click", saveModule);
    $("save-btn-2").addEventListener("click", saveModule);
    $("add-step").addEventListener("click", () => { syncLists(); model.dialogueSteps.push(blankStep()); renderSteps(); });
    $("add-drill").addEventListener("click", () => { syncLists(); model.drills.push({ word: "", say: "", note: { en: "", "pt-BR": "" } }); renderDrills(); });

    $("steps").addEventListener("click", (ev) => {
      const btn = ev.target.closest(".icon-btn"); if (!btn) return;
      const card = ev.target.closest(".step-card"); const i = parseInt(card.dataset.index, 10);
      const act = btn.dataset.act;
      syncLists();
      if (act === "del") { model.dialogueSteps.splice(i, 1); if (!model.dialogueSteps.length) model.dialogueSteps.push(blankStep()); }
      else if (act === "up" && i > 0) { const t = model.dialogueSteps[i - 1]; model.dialogueSteps[i - 1] = model.dialogueSteps[i]; model.dialogueSteps[i] = t; }
      else if (act === "down" && i < model.dialogueSteps.length - 1) { const t = model.dialogueSteps[i + 1]; model.dialogueSteps[i + 1] = model.dialogueSteps[i]; model.dialogueSteps[i] = t; }
      renderSteps();
    });
    $("drills").addEventListener("click", (ev) => {
      const btn = ev.target.closest(".icon-btn"); if (!btn) return;
      const i = parseInt(ev.target.closest(".drill-row").dataset.index, 10);
      syncLists(); model.drills.splice(i, 1); renderDrills();
    });

    $("f-noise").addEventListener("input", () => { $("f-noise-out").textContent = $("f-noise").value; });
    $("f-seq").addEventListener("input", updatePlayLink);
  }

  function start() {
    wire();
    loadModule(intv($("load-seq").value, 21));
  }

  /* ---------- admin gate ---------- */
  const gate = $("admin-gate");
  const gateMsg = $("gate-msg");
  function deny(msg) { if (gate) gate.hidden = false; if (gateMsg) gateMsg.textContent = msg; }

  if (!CONFIG_READY) {
    if (gate) gate.hidden = true;
    start();
    status("Pré-visualização: Firebase não configurado — edição local (sem salvar).", true);
  } else {
    deny("Verificando credenciais…");
    onAuthStateChanged(auth, async (user) => {
      if (!user) { deny("Faça login como administrador."); return; }
      const ok = await isAdmin(user);
      if (!ok) { deny("Sua conta não possui acesso de administrador."); return; }
      if (gate) gate.hidden = true;
      start();
    });
  }
})();
