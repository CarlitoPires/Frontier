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
      "visa.tourist": "Tourist Visa",
      "visa.resident": "Resident Visa",
      "visa.citizen": "Citizen Visa",
      "visa.diplomat": "Diplomat Visa",
      "streak.title": "day streak",
      "dash.invite": "Your invite code",
      "auth.invite": "Invite code (optional)",
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
      "conseq.share": "Share your victory",
      "conseq.shareTitle": "Broadcast your victory",
      "conseq.capture": "Capture",
      "conseq.retake": "Retake",
      "conseq.close": "Close",
      "mode.basic": "Basic",
      "mode.fluent": "Fluent",
      "mode.free": "Free Flight",

      /* ===== Sales landing page (lp.*) ===== */
      "doc.landingTitle": "LinguoBound · Conquer the City",
      "lp.navPlans": "Plans",
      "lp.navHow": "How it works",
      "lp.navLogin": "Citizen Login",
      "lp.heroEyebrow": "Real-Life Survival Simulator",
      "lp.heroTitle": "You land in a foreign city.<br>No one speaks your language.<br>The clock is <span class=\"metal\">already running</span>.",
      "lp.heroSub": "LinguoBound is not an English course. It is a reality-shock survival engine that turns a lost tourist into a confident local — across 500 missions, one impossible conversation at a time.",
      "lp.heroCtaPrimary": "Conquer my access",
      "lp.heroCtaSecondary": "I'm already a citizen",
      "lp.heroTrust": "7-day guarantee · PIX & Credit Card · Cancel anytime",
      "lp.scarcity": "Founding Citizen pricing — first cohort closes in",
      "lp.nightmareEyebrow": "The Reality Shock",
      "lp.nightmareTitle": "The nightmare every immigrant knows",
      "lp.nm1Title": "The hostile officer",
      "lp.nm1Body": "Customs. A cold stare. A question you don't understand. The queue behind you sighs.",
      "lp.nm2Title": "The Immigration Gate",
      "lp.nm2Body": "The booth. One question decides if you're let in — and you didn't catch a word of it.",
      "lp.nm3Title": "The Lost Luggage Chaos",
      "lp.nm3Body": "The carousel empties. Your bag never comes. Now describe it, in a form you can't read.",
      "lp.nm4Title": "The First Night Alone",
      "lp.nm4Body": "A strange room. No signal, no friends, no plan. Just silence — and the question: now what?",
      "lp.nightmareCta": "Walk in already knowing how every one of these ends.",
      "lp.transformEyebrow": "The Transformation",
      "lp.transformTitle": "From lost tourist to local — by force of reality",
      "lp.transformBody": "You don't memorise lists. You survive scenarios under pressure, with impatient AI characters who react to your hesitation, your accent, and the noise around you. Fluency stops being a subject. It becomes who you are.",
      "lp.stageTourist": "Tourist",
      "lp.stageResident": "Resident",
      "lp.stageLocal": "Local",
      "lp.stageMaster": "Master of the City",
      "lp.howEyebrow": "The Engine",
      "lp.howTitle": "How the reality-shock works",
      "lp.how1Title": "Action → Obstacle → Consequence",
      "lp.how1Body": "Every one of the 500 modules is a real-world mission with a social obstacle and a consequence. Hesitate, and the NPC walks away.",
      "lp.how2Title": "The Hard Gate",
      "lp.how2Body": "Module N+1 stays locked until the AI certifies Module N as ‘Proficiency Passed’. No skipping. You earn every step.",
      "lp.how3Title": "Living AI characters",
      "lp.how3Body": "Officers, bouncers, recruiters and doctors — impatient, regional, reactive. They judge your attitude over the background noise.",
      "lp.valueEyebrow": "What you're really buying",
      "lp.valueTitle": "Not lessons. Survival confidence.",
      "lp.v1Title": "500 reality-shock modules",
      "lp.v1Body": "A full 125-hour city arc — airport to citizenship — across 20 survival blocks.",
      "lp.v2Title": "Streak-based Visa System",
      "lp.v2Body": "Your daily streak IS your immigration status. Tourist → Resident → Citizen → Diplomat. Lapse, and you're downgraded.",
      "lp.v3Title": "Viral Victory Selfies",
      "lp.v3Body": "Every milestone mints a cinematic share-card — proof of how far you've come.",
      "lp.v4Title": "Predictive AI Metrics",
      "lp.v4Body": "A command-center radar tracks fluency, confidence, reaction time, and your personal Struggle Zones.",
      "lp.v5Title": "Hyper-real procedural audio",
      "lp.v5Body": "Terminal hum, techno-club roar, rain on the street — the soundscape adapts to every scene.",
      "lp.v6Title": "Bilingual support (EN/PT-BR)",
      "lp.v6Body": "Mental Translation, the Earpiece, and phonetic coaching — in your native tongue, until you don't need them.",
      "lp.pricingEyebrow": "Citizenship Hierarchy",
      "lp.pricingTitle": "Choose your visa",
      "lp.pricingSub": "You don't buy cities. You conquer the right to live in them.",
      "lp.billMonthly": "Monthly",
      "lp.billAnnual": "Annual",
      "lp.billSave": "Save 34%",
      "lp.perMonth": "/mo",
      "lp.perYear": "/yr",
      "lp.annualEquiv": "≈ {value}/mo, billed annually",
      "lp.recommended": "Most chosen",
      "lp.planResName": "Resident",
      "lp.planResTagline": "Your base city, full survival arc.",
      "lp.planCitName": "Citizen",
      "lp.planCitTagline": "The committed path — best value.",
      "lp.planGloName": "Global Citizen",
      "lp.planGloTagline": "Two cities, two languages, at once.",
      "lp.featAllModules": "All 500 modules of your base city",
      "lp.featVisa": "Streak Visa System + Victory Selfies",
      "lp.featRadar": "Predictive performance radar",
      "lp.featCert": "AI Proficiency Certification",
      "lp.featPriority": "Priority access to new cities",
      "lp.featTwoCities": "Two cities / languages in parallel",
      "lp.featConcierge": "Founding-citizen concierge support",
      "lp.choosePlan": "Choose {plan}",
      "lp.valueFraming": "Less than one private lesson — for an entire city, forever in your pocket.",
      "lp.guaranteeTitle": "7-day unconditional guarantee",
      "lp.guaranteeBody": "Try it risk-free. Don't feel the shift? Email us within 7 days for a full refund — your legal right of regret under Art. 49 of the Brazilian Consumer Code (CDC).",
      "lp.proofEyebrow": "Why it works",
      "lp.proofTitle": "Built like nothing else",
      "lp.stat1": "500", "lp.stat1Label": "reality-shock modules",
      "lp.stat2": "20", "lp.stat2Label": "survival blocks",
      "lp.stat3": "125h", "lp.stat3Label": "of city gameplay",
      "lp.stat4": "AI", "lp.stat4Label": "proficiency gating",
      "lp.founderNote": "“We didn't build a language app. We built the year of your life that language apps skip — the terrifying, transformative first year in a new country.” — Carlito Pires, Architect",
      "lp.faqTitle": "Questions before you board",
      "lp.faqQ1": "Is this a subscription? Can I cancel?",
      "lp.faqA1": "Yes. Plans renew automatically at the end of each cycle. You can cancel anytime in your dashboard or via Mercado Pago — no penalty, and you keep access until the period ends.",
      "lp.faqQ2": "How does the refund work?",
      "lp.faqA2": "Within 7 days of purchase you may request a full refund for any reason (Art. 49 CDC). Just email the address below; we process it through Mercado Pago.",
      "lp.faqQ3": "I'm an absolute beginner. Is that okay?",
      "lp.faqA3": "It's designed for ‘Absolute Zero’. The Prologue teaches you the first vital words on the plane before you ever land. You build from nothing.",
      "lp.faqQ4": "Which payment methods are accepted?",
      "lp.faqA4": "PIX (instant) and credit card, securely processed by Mercado Pago. We never see or store your card details.",
      "lp.faqQ5": "What about my data (LGPD)?",
      "lp.faqA5": "We collect only what's needed to run your account, under Brazil's LGPD. You can request access or deletion of your data anytime via the contact below.",
      "lp.footTagline": "Conquer the city. One impossible conversation at a time.",
      "lp.footPrivacy": "Privacy Policy (LGPD)",
      "lp.footTerms": "Terms of Use",
      "lp.footRefund": "Refund Policy",
      "lp.footContact": "Contact",
      "lp.footTransparency": "Prices in Brazilian Reais (BRL), taxes included. Subscriptions renew automatically until cancelled. Payments processed by Mercado Pago.",
      "lp.footLgpd": "We process personal data in accordance with Law 13.709/2018 (LGPD). See our Privacy Policy for your rights of access, correction and deletion.",
      "lp.footCompany": "LinguoBound · Architectural Prompt Engineering · CNPJ 00.000.000/0001-00",

      /* ===== Checkout (pay.*) ===== */
      "pay.title": "Secure Checkout",
      "pay.orderSummary": "Order summary",
      "pay.plan": "Plan",
      "pay.billing": "Billing",
      "pay.method": "Payment method",
      "pay.pix": "PIX",
      "pay.pixHint": "Instant approval",
      "pay.card": "Credit card",
      "pay.cardHint": "Up to 12× (issuer)",
      "pay.total": "Total today",
      "pay.identify": "Identify yourself",
      "pay.identifyHint": "We link your purchase to your citizen account.",
      "pay.email": "Account email",
      "pay.loginToContinue": "Log in to continue",
      "pay.createAccount": "Create my account",
      "pay.payNow": "Pay securely",
      "pay.securedBy": "Encrypted & processed by Mercado Pago",
      "pay.redirecting": "Opening secure payment…",
      "pay.confirming": "Confirming your payment…",
      "pay.confirmingHint": "This can take a few seconds after PIX. Keep this page open.",
      "pay.success": "Welcome, Citizen.",
      "pay.successBody": "Your access is active. The city awaits.",
      "pay.goDash": "Enter the City",
      "pay.pending": "Payment received — activating access",
      "pay.pendingBody": "Mercado Pago is confirming your payment. Your tier unlocks automatically the moment it clears.",
      "pay.failed": "Payment not completed",
      "pay.failedBody": "No charge was made. You can try again or pick another method.",
      "pay.retry": "Try again",
      "pay.close": "Close",
      "pay.recurring": "By continuing you authorise recurring billing for {plan} until cancelled, and agree to the Terms of Use and Privacy Policy.",
      "pay.needLoginTitle": "One step first",
      "pay.needLoginBody": "Create your free citizen account (or log in), then complete checkout to upgrade.",
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
      "visa.tourist": "Visto de Turista",
      "visa.resident": "Visto de Residente",
      "visa.citizen": "Visto de Cidadão",
      "visa.diplomat": "Visto Diplomático",
      "streak.title": "dias de ofensiva",
      "dash.invite": "Seu código de convite",
      "auth.invite": "Código de convite (opcional)",
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
      "conseq.share": "Compartilhar vitória",
      "conseq.shareTitle": "Transmita sua vitória",
      "conseq.capture": "Capturar",
      "conseq.retake": "Refazer foto",
      "conseq.close": "Fechar",
      "mode.basic": "Básico",
      "mode.fluent": "Fluente",
      "mode.free": "Voo Livre",

      /* ===== Página de vendas (lp.*) ===== */
      "doc.landingTitle": "LinguoBound · Conquiste a Cidade",
      "lp.navPlans": "Planos",
      "lp.navHow": "Como funciona",
      "lp.navLogin": "Entrar",
      "lp.heroEyebrow": "Simulador de Sobrevivência da Vida Real",
      "lp.heroTitle": "Você pousa numa cidade estrangeira.<br>Ninguém fala a sua língua.<br>O relógio <span class=\"metal\">já está correndo</span>.",
      "lp.heroSub": "LinguoBound não é um curso de inglês. É um motor de choque de realidade que transforma um turista perdido em um morador confiante — ao longo de 500 missões, uma conversa impossível de cada vez.",
      "lp.heroCtaPrimary": "Conquistar meu acesso",
      "lp.heroCtaSecondary": "Já sou cidadão",
      "lp.heroTrust": "Garantia de 7 dias · PIX & Cartão · Cancele quando quiser",
      "lp.scarcity": "Preço de Cidadão Fundador — a primeira turma fecha em",
      "lp.nightmareEyebrow": "O Choque de Realidade",
      "lp.nightmareTitle": "O pesadelo que todo imigrante conhece",
      "lp.nm1Title": "O oficial hostil",
      "lp.nm1Body": "Alfândega. Um olhar gelado. Uma pergunta que você não entende. A fila atrás de você suspira.",
      "lp.nm2Title": "O Portão da Imigração",
      "lp.nm2Body": "A cabine. Uma pergunta decide se você entra — e você não entendeu uma palavra.",
      "lp.nm3Title": "O Caos da Bagagem Perdida",
      "lp.nm3Body": "A esteira esvazia. Sua mala nunca vem. Agora descreva-a, num formulário que você não consegue ler.",
      "lp.nm4Title": "A Primeira Noite Sozinho",
      "lp.nm4Body": "Um quarto estranho. Sem sinal, sem amigos, sem plano. Só o silêncio — e a pergunta: e agora?",
      "lp.nightmareCta": "Entre já sabendo como cada uma dessas cenas termina.",
      "lp.transformEyebrow": "A Transformação",
      "lp.transformTitle": "De turista perdido a morador — na marra da realidade",
      "lp.transformBody": "Você não decora listas. Você sobrevive a cenários sob pressão, com personagens de IA impacientes que reagem à sua hesitação, ao seu sotaque e ao barulho ao redor. A fluência deixa de ser matéria. Ela passa a ser quem você é.",
      "lp.stageTourist": "Turista",
      "lp.stageResident": "Residente",
      "lp.stageLocal": "Local",
      "lp.stageMaster": "Mestre da Cidade",
      "lp.howEyebrow": "O Motor",
      "lp.howTitle": "Como o choque de realidade funciona",
      "lp.how1Title": "Ação → Obstáculo → Consequência",
      "lp.how1Body": "Cada um dos 500 módulos é uma missão do mundo real com um obstáculo social e uma consequência. Hesite, e o personagem vai embora.",
      "lp.how2Title": "O Portão Rígido (Hard Gate)",
      "lp.how2Body": "O Módulo N+1 fica trancado até a IA certificar o Módulo N como ‘Proficiência Aprovada’. Sem pular etapas. Você conquista cada passo.",
      "lp.how3Title": "Personagens de IA vivos",
      "lp.how3Body": "Oficiais, seguranças, recrutadores e médicos — impacientes, regionais, reativos. Eles julgam sua atitude por cima do ruído de fundo.",
      "lp.valueEyebrow": "O que você está realmente comprando",
      "lp.valueTitle": "Não são aulas. É confiança para sobreviver.",
      "lp.v1Title": "500 módulos de choque de realidade",
      "lp.v1Body": "Um arco completo de 125 horas — do aeroporto à cidadania — em 20 blocos de sobrevivência.",
      "lp.v2Title": "Sistema de Visto por Ofensiva",
      "lp.v2Body": "Sua ofensiva diária É o seu status de imigração. Turista → Residente → Cidadão → Diplomata. Falhou, foi rebaixado.",
      "lp.v3Title": "Selfies Virais de Vitória",
      "lp.v3Body": "Cada marco gera um cartão cinematográfico para compartilhar — a prova do quanto você evoluiu.",
      "lp.v4Title": "Métricas Preditivas de IA",
      "lp.v4Body": "Um radar de centro de comando acompanha fluência, confiança, tempo de reação e suas Zonas de Dificuldade pessoais.",
      "lp.v5Title": "Áudio procedural hiper-real",
      "lp.v5Body": "Zumbido do terminal, estrondo da balada techno, chuva na rua — a paisagem sonora se adapta a cada cena.",
      "lp.v6Title": "Suporte bilíngue (EN/PT-BR)",
      "lp.v6Body": "Tradução Mental, o Ponto Eletrônico e treino fonético — na sua língua, até você não precisar mais.",
      "lp.pricingEyebrow": "Hierarquia de Cidadania",
      "lp.pricingTitle": "Escolha o seu visto",
      "lp.pricingSub": "Você não compra cidades. Você conquista o direito de viver nelas.",
      "lp.billMonthly": "Mensal",
      "lp.billAnnual": "Anual",
      "lp.billSave": "Economize 34%",
      "lp.perMonth": "/mês",
      "lp.perYear": "/ano",
      "lp.annualEquiv": "≈ {value}/mês, cobrado anualmente",
      "lp.recommended": "Mais escolhido",
      "lp.planResName": "Residente",
      "lp.planResTagline": "Sua cidade-base, arco completo de sobrevivência.",
      "lp.planCitName": "Cidadão",
      "lp.planCitTagline": "O caminho comprometido — melhor custo-benefício.",
      "lp.planGloName": "Cidadão Global",
      "lp.planGloTagline": "Duas cidades, dois idiomas, ao mesmo tempo.",
      "lp.featAllModules": "Todos os 500 módulos da sua cidade-base",
      "lp.featVisa": "Sistema de Visto por Ofensiva + Selfies de Vitória",
      "lp.featRadar": "Radar preditivo de desempenho",
      "lp.featCert": "Certificação de Proficiência por IA",
      "lp.featPriority": "Acesso prioritário a novas cidades",
      "lp.featTwoCities": "Duas cidades / idiomas em paralelo",
      "lp.featConcierge": "Suporte concierge de cidadão fundador",
      "lp.choosePlan": "Escolher {plan}",
      "lp.valueFraming": "Menos que uma aula particular — por uma cidade inteira, para sempre no seu bolso.",
      "lp.guaranteeTitle": "Garantia incondicional de 7 dias",
      "lp.guaranteeBody": "Teste sem risco. Não sentiu a virada? Escreva pra gente em até 7 dias e receba reembolso integral — seu direito de arrependimento garantido pelo Art. 49 do Código de Defesa do Consumidor (CDC).",
      "lp.proofEyebrow": "Por que funciona",
      "lp.proofTitle": "Construído como nada que existe",
      "lp.stat1": "500", "lp.stat1Label": "módulos de choque de realidade",
      "lp.stat2": "20", "lp.stat2Label": "blocos de sobrevivência",
      "lp.stat3": "125h", "lp.stat3Label": "de gameplay na cidade",
      "lp.stat4": "IA", "lp.stat4Label": "trava por proficiência",
      "lp.founderNote": "“Não construímos um aplicativo de idiomas. Construímos o ano da sua vida que os apps de idioma pulam — o primeiro ano, aterrorizante e transformador, num país novo.” — Carlito Pires, Arquiteto",
      "lp.faqTitle": "Dúvidas antes de embarcar",
      "lp.faqQ1": "É uma assinatura? Posso cancelar?",
      "lp.faqA1": "Sim. Os planos renovam automaticamente ao fim de cada ciclo. Você cancela quando quiser, no painel ou pelo Mercado Pago — sem multa, e mantém o acesso até o fim do período.",
      "lp.faqQ2": "Como funciona o reembolso?",
      "lp.faqA2": "Em até 7 dias da compra você pode pedir reembolso integral por qualquer motivo (Art. 49 do CDC). Basta escrever para o e-mail abaixo; processamos pelo Mercado Pago.",
      "lp.faqQ3": "Sou iniciante absoluto. Tudo bem?",
      "lp.faqA3": "Foi feito para o ‘Zero Absoluto’. O Prólogo te ensina as primeiras palavras vitais ainda no avião, antes de você pousar. Você constrói do nada.",
      "lp.faqQ4": "Quais formas de pagamento são aceitas?",
      "lp.faqA4": "PIX (instantâneo) e cartão de crédito, processados com segurança pelo Mercado Pago. Nunca vemos nem armazenamos os dados do seu cartão.",
      "lp.faqQ5": "E os meus dados (LGPD)?",
      "lp.faqA5": "Coletamos apenas o necessário para operar sua conta, conforme a LGPD. Você pode solicitar acesso ou exclusão dos seus dados a qualquer momento pelo contato abaixo.",
      "lp.footTagline": "Conquiste a cidade. Uma conversa impossível de cada vez.",
      "lp.footPrivacy": "Política de Privacidade (LGPD)",
      "lp.footTerms": "Termos de Uso",
      "lp.footRefund": "Política de Reembolso",
      "lp.footContact": "Contato",
      "lp.footTransparency": "Preços em Reais (BRL), impostos incluídos. As assinaturas renovam automaticamente até o cancelamento. Pagamentos processados pelo Mercado Pago.",
      "lp.footLgpd": "Tratamos dados pessoais conforme a Lei 13.709/2018 (LGPD). Consulte nossa Política de Privacidade para seus direitos de acesso, correção e exclusão.",
      "lp.footCompany": "LinguoBound · Architectural Prompt Engineering · CNPJ 00.000.000/0001-00",

      /* ===== Checkout (pay.*) ===== */
      "pay.title": "Checkout Seguro",
      "pay.orderSummary": "Resumo do pedido",
      "pay.plan": "Plano",
      "pay.billing": "Cobrança",
      "pay.method": "Forma de pagamento",
      "pay.pix": "PIX",
      "pay.pixHint": "Aprovação instantânea",
      "pay.card": "Cartão de crédito",
      "pay.cardHint": "Até 12× (emissor)",
      "pay.total": "Total hoje",
      "pay.identify": "Identifique-se",
      "pay.identifyHint": "Vinculamos sua compra à sua conta de cidadão.",
      "pay.email": "E-mail da conta",
      "pay.loginToContinue": "Entrar para continuar",
      "pay.createAccount": "Criar minha conta",
      "pay.payNow": "Pagar com segurança",
      "pay.securedBy": "Criptografado e processado pelo Mercado Pago",
      "pay.redirecting": "Abrindo pagamento seguro…",
      "pay.confirming": "Confirmando seu pagamento…",
      "pay.confirmingHint": "Pode levar alguns segundos após o PIX. Mantenha esta página aberta.",
      "pay.success": "Bem-vindo, Cidadão.",
      "pay.successBody": "Seu acesso está ativo. A cidade espera por você.",
      "pay.goDash": "Entrar na Cidade",
      "pay.pending": "Pagamento recebido — ativando acesso",
      "pay.pendingBody": "O Mercado Pago está confirmando seu pagamento. Seu nível é liberado automaticamente assim que aprovar.",
      "pay.failed": "Pagamento não concluído",
      "pay.failedBody": "Nenhuma cobrança foi feita. Você pode tentar de novo ou escolher outra forma.",
      "pay.retry": "Tentar de novo",
      "pay.close": "Fechar",
      "pay.recurring": "Ao continuar, você autoriza a cobrança recorrente do plano {plan} até o cancelamento, e concorda com os Termos de Uso e a Política de Privacidade.",
      "pay.needLoginTitle": "Um passo antes",
      "pay.needLoginBody": "Crie sua conta de cidadão gratuita (ou entre) e depois conclua o checkout para fazer o upgrade.",
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
