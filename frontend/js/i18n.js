/* ============================================================
 *  LinguoBound — i18n engine (scalable localization)
 *
 *  - Flat dictionary keyed by dotted strings, per language.
 *  - t(key, params) with {placeholder} substitution + EN fallback.
 *  - Persists choice in localStorage; detects pt-* browsers.
 *  - Declarative DOM binding:
 *      data-i18n            -> textContent
 *      data-i18n-title      -> title attribute
 *      data-i18n-aria-label -> aria-label attribute
 *      data-i18n-placeholder-> placeholder attribute
 *      <html data-i18n-doctitle="key"> -> document.title
 *  - Language toggle: any [data-set-lang="en|pt-BR"] button.
 *  - Dynamic renderers (dashboard.js / hud.js) call I18n.t and
 *    listen for the "i18n:change" event to re-render.
 *
 *  IMPORTANT: NPC learning content (English the user is learning)
 *  is intentionally NOT stored here — it lives in hud.js TURNS and
 *  always stays English.
 * ============================================================ */

(function (global) {
  "use strict";

  var STORAGE_KEY = "linguobound.lang";
  var DEFAULT_LANG = "pt-BR";              // Brazil-first product
  var SUPPORTED = ["en", "pt-BR"];

  var DICT = {
    en: {
      /* document titles */
      "doc.dashTitle": "LinguoBound · Dashboard",
      "doc.simTitle": "LinguoBound · Customs Control",
      "doc.authTitle": "LinguoBound · Access",
      "common.signout": "Sign out",
      "session.checking": "Verifying session…",

      /* landing / authentication */
      "auth.eyebrow": "Real-Life Social Simulator",
      "auth.tagline": "You do not buy cities. You <span class=\"metal\">conquer</span> the right to live in them.",
      "auth.stampTop": "ENTRY",
      "auth.stampBottom": "· VISA ·",
      "auth.secureAccess": "Secure Access",
      "auth.citizenLogin": "Citizen Login",
      "auth.citizenSignup": "New Citizenship",
      "auth.email": "Email",
      "auth.passphrase": "Passphrase",
      "auth.enterCity": "Enter the City",
      "auth.createAccount": "Create account",
      "auth.or": "or",
      "auth.faceId": "Authenticate with FaceID",
      "auth.google": "Sign in with Google",
      "auth.levelQuestion": "What is your current level?",
      "auth.levelBeginner": "Absolute Beginner",
      "auth.levelIntermediate": "Intermediate",
      "auth.levelFluent": "Fluent",
      "auth.noCitizenship": "No citizenship yet?",
      "auth.requestVisa": "Request entry visa",
      "auth.haveCitizenship": "Already a citizen?",
      "auth.doLogin": "Log in",
      "auth.signingIn": "Signing in…",
      "auth.creating": "Creating account…",
      "auth.errInvalid": "Invalid email or password.",
      "auth.errEmailInUse": "This email is already registered.",
      "auth.errWeakPass": "Password must be at least 6 characters.",
      "auth.errEmptyFields": "Please enter your email and passphrase.",
      "auth.errGeneric": "Could not authenticate. Please try again.",
      "auth.bioNoSession": "Use your email and passphrase to sign in.",
      "auth.faceStep1": "Aligning facial geometry…",
      "auth.faceStep2": "Mapping 30,000 reference points…",
      "auth.faceStep3": "Verifying liveness…",
      "auth.faceStep4": "Matching citizen identity…",
      "auth.faceConfirmed": "Identity confirmed",

      /* dashboard chrome */
      "nav.overview": "Overview",
      "nav.itinerary": "Itinerary",
      "nav.certifications": "Certifications",
      "tier.base": "Base Citizen",
      "tier.global": "Global Citizen",
      "dash.activeCitizenship": "Active Citizenship",
      "dash.loadingEnv": "Loading environment…",
      "dash.progressMeta": "Block {block} · Module {module} / {total}",
      "dash.resume": "Resume Simulation",
      "dash.perfAnalytics": "Performance Analytics",
      "dash.fluencyProfile": "Fluency Profile",
      "dash.radarAria": "Radar chart of fluency metrics",
      "dash.currentLoop": "Current Module Loop",
      "dash.hierarchy": "Citizenship Hierarchy",
      "dash.conquerNext": "Conquer the Next Capital",
      "loop.step1": "Action — Approach the officer",
      "loop.step2": "Obstacle — Hostile officer, accent",
      "loop.step3": "Consequence — Entry stamp / rejection",
      "tool.mentalTranslation": "Mental Translation",
      "tool.earpiece": "Earpiece",
      "tool.freeFlightXp": "Free Flight +XP",

      /* radar axes */
      "radar.fluency": "Fluency",
      "radar.vocabulary": "Vocabulary",
      "radar.confidence": "Confidence",
      "radar.reaction": "Reaction",
      "radar.listening": "Listening",
      "radar.pronunciation": "Pronunciation",

      /* hierarchy states */
      "state.conquered": "Conquered",
      "state.inProgress": "In Progress",
      "state.locked": "Locked · Earn Certification",

      /* cities */
      "city.London": "London",
      "city.Berlin": "Berlin",
      "city.Madrid": "Madrid",
      "city.New York": "New York",

      /* weather */
      "weather.rain": "Rain · 11°C",

      /* simulation chrome */
      "sim.exitAria": "Leave simulation",
      "sim.location": "{city} · Block {block} · Module {module}",
      "scene.customs": "Customs Control",
      "audio.replay": "Replay",
      "audio.slow": "Slow & clear",
      "audio.natural": "Natural",
      "audio.sound": "Sound",
      "meter.patience": "Patience",
      "meter.patienceTitle": "NPC patience — runs out if you hesitate",
      "meter.noise": "Noise",
      "meter.noiseTitle": "Ambient noise degrades NPC comprehension",
      "npc.officerName": "Border Officer",
      "npc.officerInitials": "BO",
      "npc.moodImpatient": "Impatient · Formal",
      "npc.moodLosing": "Losing patience",
      "npc.tapAria": "Tap to reveal translation",
      "npc.tapHint": "Tap for Mental Translation",
      "tp.basic": "Basic",
      "tp.fluent": "Fluent",
      "tp.free": "Free Flight",
      "tp.say": "Say",
      "tp.openMic": "Open mic · No script",
      "tp.freeXp": "+40% XP",
      "ctl.earpiece": "Earpiece",
      "ctl.translate": "Translate",
      "mic.holdAria": "Hold to speak",
      "mic.hint": "Hold the mic to respond",
      "mic.listening": "Listening…",
      "mic.listeningFree": "Listening · Free Flight",
      "mic.retry": "I didn't catch that. Say it again.",
      "mic.great": "Perfect!",

      /* consequence */
      "conseq.stampAdmitted": "ADMITTED",
      "conseq.stampDenied": "DENIED",
      "conseq.label": "Consequence",
      "conseq.labelPassed": "Consequence · Passed",
      "conseq.labelFailed": "Consequence · Failed",
      "conseq.titleGranted": "Entry Granted",
      "conseq.titleRefused": "Entry Refused",
      "conseq.bodyPass": "The officer stamps your passport and nods you through. Module 11 proficiency recorded.",
      "conseq.bodyFail": "You hesitated too long and the officer lost patience. Replay the module to proceed.",
      "conseq.reasonImpatient": "The officer waves the next traveller forward.",
      "conseq.chipProficiency": "Proficiency",
      "conseq.chipXp": "XP",
      "conseq.chipMode": "Mode",
      "conseq.continue": "Continue",
      "conseq.continueNext": "Continue to the next module",
      "conseq.replay": "Replay module",
      "mode.basic": "Basic",
      "mode.fluent": "Fluent",
      "mode.free": "Free Flight",
    },

    "pt-BR": {
      /* document titles */
      "doc.dashTitle": "LinguoBound · Painel",
      "doc.simTitle": "LinguoBound · Controle Alfandegário",
      "doc.authTitle": "LinguoBound · Acesso",
      "common.signout": "Sair",
      "session.checking": "Verificando sessão…",

      /* landing / authentication */
      "auth.eyebrow": "Simulador social da vida real",
      "auth.tagline": "Você não compra cidades. Você <span class=\"metal\">conquista</span> o direito de viver nelas.",
      "auth.stampTop": "ENTRADA",
      "auth.stampBottom": "· VISTO ·",
      "auth.secureAccess": "Acesso Seguro",
      "auth.citizenLogin": "Login de Cidadão",
      "auth.citizenSignup": "Nova Cidadania",
      "auth.email": "E-mail",
      "auth.passphrase": "Senha",
      "auth.enterCity": "Entrar na cidade",
      "auth.createAccount": "Criar conta",
      "auth.or": "ou",
      "auth.faceId": "Autenticar com FaceID",
      "auth.google": "Entrar com Google",
      "auth.levelQuestion": "Qual é o seu nível atual?",
      "auth.levelBeginner": "Iniciante Absoluto",
      "auth.levelIntermediate": "Intermediário",
      "auth.levelFluent": "Fluente",
      "auth.noCitizenship": "Ainda não tem cidadania?",
      "auth.requestVisa": "Solicite visto de entrada",
      "auth.haveCitizenship": "Já tem cidadania?",
      "auth.doLogin": "Fazer login",
      "auth.signingIn": "Entrando…",
      "auth.creating": "Criando conta…",
      "auth.errInvalid": "E-mail ou senha inválidos.",
      "auth.errEmailInUse": "Este e-mail já está cadastrado.",
      "auth.errWeakPass": "A senha deve ter ao menos 6 caracteres.",
      "auth.errEmptyFields": "Informe seu e-mail e senha.",
      "auth.errGeneric": "Não foi possível autenticar. Tente novamente.",
      "auth.bioNoSession": "Use seu e-mail e senha para entrar.",
      "auth.faceStep1": "Alinhando geometria facial…",
      "auth.faceStep2": "Mapeando 30.000 pontos de referência…",
      "auth.faceStep3": "Verificando vivacidade…",
      "auth.faceStep4": "Confrontando identidade do cidadão…",
      "auth.faceConfirmed": "Identidade confirmada",

      /* dashboard chrome */
      "nav.overview": "Visão Geral",
      "nav.itinerary": "Itinerário",
      "nav.certifications": "Certificações",
      "tier.base": "Cidadão Base",
      "tier.global": "Cidadão Global",
      "dash.activeCitizenship": "Cidadania Ativa",
      "dash.loadingEnv": "Carregando ambiente…",
      "dash.progressMeta": "Bloco {block} · Módulo {module} / {total}",
      "dash.resume": "Retomar Simulação",
      "dash.perfAnalytics": "Análise de Desempenho",
      "dash.fluencyProfile": "Perfil de Fluência",
      "dash.radarAria": "Gráfico radar de métricas de fluência",
      "dash.currentLoop": "Ciclo do Módulo Atual",
      "dash.hierarchy": "Hierarquia de Cidadania",
      "dash.conquerNext": "Conquiste a Próxima Capital",
      "loop.step1": "Ação — Aborde o oficial",
      "loop.step2": "Obstáculo — Oficial hostil, sotaque",
      "loop.step3": "Consequência — Carimbo de entrada / rejeição",
      "tool.mentalTranslation": "Tradução Mental",
      "tool.earpiece": "Ponto Eletrônico",
      "tool.freeFlightXp": "Voo Livre +XP",

      /* radar axes */
      "radar.fluency": "Fluência",
      "radar.vocabulary": "Vocabulário",
      "radar.confidence": "Confiança",
      "radar.reaction": "Reação",
      "radar.listening": "Escuta",
      "radar.pronunciation": "Pronúncia",

      /* hierarchy states */
      "state.conquered": "Conquistada",
      "state.inProgress": "Em Progresso",
      "state.locked": "Bloqueada · Obtenha Certificação",

      /* cities */
      "city.London": "Londres",
      "city.Berlin": "Berlim",
      "city.Madrid": "Madri",
      "city.New York": "Nova York",

      /* weather */
      "weather.rain": "Chuva · 11°C",

      /* simulation chrome */
      "sim.exitAria": "Sair da simulação",
      "sim.location": "{city} · Bloco {block} · Módulo {module}",
      "scene.customs": "Controle Alfandegário",
      "audio.replay": "Repetir",
      "audio.slow": "Devagar",
      "audio.natural": "Natural",
      "audio.sound": "Som",
      "meter.patience": "Paciência",
      "meter.patienceTitle": "Paciência do NPC — acaba se você hesitar",
      "meter.noise": "Ruído",
      "meter.noiseTitle": "O ruído ambiente prejudica a compreensão do NPC",
      "npc.officerName": "Oficial de Fronteira",
      "npc.officerInitials": "OF",
      "npc.moodImpatient": "Impaciente · Formal",
      "npc.moodLosing": "Perdendo a paciência",
      "npc.tapAria": "Toque para revelar a tradução",
      "npc.tapHint": "Toque para Tradução Mental",
      "tp.basic": "Básico",
      "tp.fluent": "Fluente",
      "tp.free": "Voo Livre",
      "tp.say": "Diga",
      "tp.openMic": "Microfone aberto · Sem roteiro",
      "tp.freeXp": "+40% XP",
      "ctl.earpiece": "Ponto",
      "ctl.translate": "Traduzir",
      "mic.holdAria": "Segure para falar",
      "mic.hint": "Segure o microfone para responder",
      "mic.listening": "Ouvindo…",
      "mic.listeningFree": "Ouvindo · Voo Livre",
      "mic.retry": "Não entendi. Fale de novo.",
      "mic.great": "Perfeito!",

      /* consequence */
      "conseq.stampAdmitted": "ADMITIDO",
      "conseq.stampDenied": "NEGADO",
      "conseq.label": "Consequência",
      "conseq.labelPassed": "Consequência · Aprovado",
      "conseq.labelFailed": "Consequência · Reprovado",
      "conseq.titleGranted": "Entrada Concedida",
      "conseq.titleRefused": "Entrada Recusada",
      "conseq.bodyPass": "O oficial carimba seu passaporte e acena para você passar. Proficiência do Módulo 11 registrada.",
      "conseq.bodyFail": "Você hesitou demais e o oficial perdeu a paciência. Refaça o módulo para prosseguir.",
      "conseq.reasonImpatient": "O oficial chama o próximo viajante.",
      "conseq.chipProficiency": "Proficiência",
      "conseq.chipXp": "XP",
      "conseq.chipMode": "Modo",
      "conseq.continue": "Continuar",
      "conseq.continueNext": "Continuar para o próximo módulo",
      "conseq.replay": "Refazer módulo",
      "mode.basic": "Básico",
      "mode.fluent": "Fluente",
      "mode.free": "Voo Livre",
    },
  };

  function detect() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage blocked */ }
    var nav = (global.navigator && global.navigator.language || "").toLowerCase();
    if (nav.indexOf("pt") === 0) return "pt-BR";
    if (nav.indexOf("en") === 0) return "en";
    return DEFAULT_LANG;
  }

  var current = detect();

  function t(key, params) {
    var table = DICT[current] || {};
    var s = table[key];
    if (s == null) {
      var en = DICT.en[key];
      s = (en == null) ? key : en;   // fall back to EN, then to the key itself
    }
    if (params) {
      s = s.replace(/\{(\w+)\}/g, function (_, k) {
        return params[k] != null ? params[k] : "{" + k + "}";
      });
    }
    return s;
  }

  var ATTR_BINDINGS = {
    "data-i18n-title": "title",
    "data-i18n-aria-label": "aria-label",
    "data-i18n-placeholder": "placeholder",
  };

  function apply(root) {
    root = root || document;

    root.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });

    // Rich strings that contain inline markup (e.g. a <span> accent).
    // Values come only from our own dictionary, so innerHTML is safe here.
    root.querySelectorAll("[data-i18n-html]").forEach(function (node) {
      node.innerHTML = t(node.getAttribute("data-i18n-html"));
    });

    Object.keys(ATTR_BINDINGS).forEach(function (dataAttr) {
      root.querySelectorAll("[" + dataAttr + "]").forEach(function (node) {
        node.setAttribute(ATTR_BINDINGS[dataAttr], t(node.getAttribute(dataAttr)));
      });
    });

    var docKey = document.documentElement.getAttribute("data-i18n-doctitle");
    if (docKey) document.title = t(docKey);

    document.documentElement.lang = current;
    updateToggle();
  }

  function updateToggle() {
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var on = btn.getAttribute("data-set-lang") === current;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", String(on));
    });
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1 || lang === current) return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    apply(document);
    global.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: lang } }));
  }

  function init() {
    document.documentElement.lang = current;
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-set-lang"));
      });
    });
    apply(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.I18n = {
    t: t,
    setLang: setLang,
    getLang: function () { return current; },
    apply: apply,
    SUPPORTED: SUPPORTED,
  };
})(window);
