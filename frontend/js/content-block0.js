/* ============================================================
 *  LinguoBound — City 01: London Immersion
 *  BLOCK ZERO — "The Survival Journey" (Modules 01–20)
 *
 *  Narrative arc (you do not leave the plane until you can survive):
 *    Phase 1 — The Flight (cabin survival)            modules 01–12
 *    Phase 2 — The Landing/Arrival (customs/baggage)  modules 13–16
 *    Phase 3 — Arrival (transport/hotel/food/help)    modules 17–20
 *
 *  Authored for the ABSOLUTE BEGINNER baseline: short survival phrases,
 *  phonetics (pt-BR sound-spelling in `ear` + `drills`), and high-pressure
 *  auditory repetition. The HUD adapts difficulty by the learner's level.
 *
 *  Schema: see docs/CONTENT_SCHEMA.md. LEARNING CONTENT (text/basic/fluent)
 *  stays English by design; `tr`/`ear`/`objective`/`drills.note` are bilingual.
 * ============================================================ */

export const BLOCK0_MODULES = [
  /* ===================== PHASE 1 — THE FLIGHT ===================== */
  {
    sequence: 1, blockId: 1, indexInBlock: 1, phase: 1, threshold: 80,
    sceneTitle: { en: "Boarding — Find Your Seat", "pt-BR": "Embarque — Ache Seu Assento" },
    contextDescription: {
      en: "The jet bridge hums. You step into a narrow cabin: recycled air, the whine of the APU, a queue pressing behind you. A crew member blocks the aisle, waiting.",
      "pt-BR": "A ponte de embarque vibra. Você entra numa cabine estreita: ar reciclado, o zumbido da APU, uma fila empurrando atrás de você. Um comissário bloqueia o corredor, esperando.",
    },
    objective: {
      en: "From zero: greet, hand over your boarding pass, and understand a seat number. Survival verbs: show, find, sit.",
      "pt-BR": "Do zero: cumprimentar, entregar o cartão de embarque e entender o número do assento. Verbos de sobrevivência: mostrar, achar, sentar.",
    },
    environment: { mood: "neutral", baseNoise: 40 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "excuse me", say: "iks-KIÚZ mi", note: { en: "The magic phrase to pass / get attention.", "pt-BR": "A frase mágica para passar / chamar atenção." } },
      { word: "twenty-two A", say: "TUÉN-ti-tchú ÊI", note: { en: "Seat numbers: number + letter.", "pt-BR": "Assentos: número + letra." } },
    ],
    dialogueSteps: [
      {
        text: "Good evening. Boarding pass, please.",
        tr: { en: "She wants to see your boarding pass.", "pt-BR": "Ela quer ver seu cartão de embarque." },
        ear: { en: "<b>“bor-ding pass”</b> — two calm beats.", "pt-BR": "<b>“bór-din pés”</b> — dois tempos calmos." },
        audioPrompt: "Crew, polite but brisk: “Good evening. Boarding pass, please.”",
        basic: "Here.", fluent: "Here you are.",
      },
      {
        text: "Twenty-two A. Window seat, on your left.",
        tr: { en: "Your seat is 22A, a window on the left.", "pt-BR": "Seu assento é o 22A, janela à esquerda." },
        ear: { en: "<b>“win-doh”</b>, not “window-uh”.", "pt-BR": "<b>“uín-dô”</b>, sem “u” no fim." },
        audioPrompt: "Crew, pointing down the aisle: “Twenty-two A. Window seat, on your left.”",
        basic: "Thank you.", fluent: "Thank you very much.",
      },
    ],
  },
  {
    sequence: 2, blockId: 1, indexInBlock: 2, phase: 1, threshold: 80,
    sceneTitle: { en: "The Overhead Locker", "pt-BR": "O Compartimento Superior" },
    contextDescription: {
      en: "Your bag is heavy and the bin is full. Passengers behind you sigh. The crew member reaches to help — but needs a word from you.",
      "pt-BR": "Sua mala é pesada e o compartimento está cheio. Os passageiros atrás suspiram. O comissário se aproxima para ajudar — mas precisa de uma palavra sua.",
    },
    objective: {
      en: "Accept/ask for help and follow a simple instruction. Words: bag, help, please.",
      "pt-BR": "Aceitar/pedir ajuda e seguir uma instrução simples. Palavras: bag, help, please.",
    },
    environment: { mood: "neutral", baseNoise: 42 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "help, please", say: "RÉLP, plíz", note: { en: "Aspirated H — push air.", "pt-BR": "H aspirado — solte o ar." } },
    ],
    dialogueSteps: [
      {
        text: "Please put your bag in the locker above.",
        tr: { en: "Put your bag in the bin above your head.", "pt-BR": "Coloque sua mala no compartimento acima." },
        ear: { en: "<b>“lock-er”</b> — short ‘o’.", "pt-BR": "<b>“ló-kâr”</b> — ‘o’ curto." },
        audioPrompt: "Crew, gesturing up: “Please put your bag in the locker above.”",
        basic: "Okay.", fluent: "Sure, one moment.",
      },
      {
        text: "Do you need a hand?",
        tr: { en: "Do you need help?", "pt-BR": "Você precisa de ajuda?" },
        ear: { en: "<b>“need a hand”</b> = need help.", "pt-BR": "<b>“níd a rénd”</b> = precisar de ajuda." },
        audioPrompt: "Crew, reaching for the bag: “Do you need a hand?”",
        basic: "Yes, please.", fluent: "Yes, please — it's heavy.",
      },
    ],
  },
  {
    sequence: 3, blockId: 1, indexInBlock: 3, phase: 1, threshold: 80,
    sceneTitle: { en: "Seatbelt & Safety", "pt-BR": "Cinto & Segurança" },
    contextDescription: {
      en: "Seated at last. The cabin lights dim. A safety chime sounds. The crew works the aisle fast, checking everyone before pushback.",
      "pt-BR": "Finalmente sentado. As luzes baixam. Um aviso sonoro toca. A tripulação percorre o corredor rápido, checando todos antes do recuo.",
    },
    objective: {
      en: "Obey safety commands instantly; say yes/no clearly. Words: seatbelt, up, please.",
      "pt-BR": "Obedecer comandos de segurança na hora; dizer sim/não com clareza. Palavras: seatbelt, up, please.",
    },
    environment: { mood: "neutral", baseNoise: 44 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "yes / no", say: "IÉS / NÔU", note: { en: "Clear vowels — your two lifelines.", "pt-BR": "Vogais claras — suas duas tábuas de salvação." } },
    ],
    dialogueSteps: [
      {
        text: "Fasten your seatbelt, please.",
        tr: { en: "Buckle your seatbelt.", "pt-BR": "Afivele o cinto de segurança." },
        ear: { en: "<b>“seat-belt”</b> — two clear parts.", "pt-BR": "<b>“sít-bélt”</b> — duas partes claras." },
        audioPrompt: "Crew, leaning in: “Fasten your seatbelt, please.”",
        basic: "Okay.", fluent: "Done.",
      },
      {
        text: "Tray table up. We're departing.",
        tr: { en: "Put the tray table up; we are leaving.", "pt-BR": "Levante a mesinha; vamos partir." },
        ear: { en: "<b>“tray”</b> rhymes with “day”.", "pt-BR": "<b>“trêi”</b> rima com “day”." },
        audioPrompt: "Crew, brisk: “Tray table up. We're departing.”",
        basic: "Okay.", fluent: "Sure, up now.",
      },
    ],
  },
  {
    sequence: 4, blockId: 1, indexInBlock: 4, phase: 1, threshold: 80,
    sceneTitle: { en: "“I Don't Understand”", "pt-BR": "“Eu Não Entendo”" },
    contextDescription: {
      en: "The engines spool up to a steady roar. A crew member rattles off a fast question over the noise. This is the most important survival skill: stopping the conversation safely.",
      "pt-BR": "As turbinas sobem a um ronco constante. Um comissário dispara uma pergunta rápida por cima do barulho. Esta é a habilidade de sobrevivência mais importante: pausar a conversa com segurança.",
    },
    objective: {
      en: "The core survival kit: 'Sorry?', 'I don't understand', 'Slowly, please'. These keep you alive in every later module.",
      "pt-BR": "O kit central de sobrevivência: 'Sorry?', 'I don't understand', 'Slowly, please'. Eles te salvam em todos os módulos seguintes.",
    },
    environment: { mood: "neutral", baseNoise: 52 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "I don't understand", say: "ai dôunt ãn-dâr-STÉND", note: { en: "Stress the last part: under-STAND.", "pt-BR": "Acentue o final: under-STAND." } },
      { word: "slowly, please", say: "SLÔU-li, plíz", note: { en: "Ask people to slow down.", "pt-BR": "Peça para falarem devagar." } },
    ],
    dialogueSteps: [
      {
        text: "Wouldyoulikeanyduty-freeitemstoday?",
        tr: { en: "(Said too fast) He's offering duty-free shopping.", "pt-BR": "(Dito rápido demais) Ele oferece compras duty-free." },
        ear: { en: "Don't guess — stop it: <b>“Sorry, I don't understand.”</b>", "pt-BR": "Não chute — pause: <b>“Sorry, I don't understand.”</b>" },
        audioPrompt: "Crew, far too fast over engine noise: “Would-you-like-any-duty-free-items-today?”",
        basic: "I don't understand.", fluent: "Sorry, I don't understand. Slowly, please.",
      },
      {
        text: "No problem. Du-ty free. Per-fume?",
        tr: { en: "He slows down: duty-free perfume?", "pt-BR": "Ele desacelera: perfume duty-free?" },
        ear: { en: "<b>“per-fume”</b> — two clear beats.", "pt-BR": "<b>“pâr-fium”</b> — dois tempos claros." },
        audioPrompt: "Crew, slower and kinder: “No problem. Du-ty free. Per-fume?”",
        basic: "No, thank you.", fluent: "No, thank you.",
      },
    ],
  },
  {
    sequence: 5, blockId: 1, indexInBlock: 5, phase: 1, threshold: 80,
    sceneTitle: { en: "Drinks Service", "pt-BR": "Serviço de Bebidas" },
    contextDescription: {
      en: "A trolley rolls down the aisle, ice rattling. The crew member works fast — three rows a minute. You get one chance to answer.",
      "pt-BR": "Um carrinho desce o corredor, gelo chacoalhando. O comissário trabalha rápido — três fileiras por minuto. Você tem uma chance de responder.",
    },
    objective: {
      en: "Make a one-word request and a simple choice. Words: water, please; still/sparkling.",
      "pt-BR": "Fazer um pedido de uma palavra e uma escolha simples. Palavras: water, please; still/sparkling.",
    },
    environment: { mood: "neutral", baseNoise: 50 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "water, please", say: "UÓ-târ, plíz", note: { en: "British ‘water’: soft T.", "pt-BR": "‘water’ britânico: T suave." } },
    ],
    dialogueSteps: [
      {
        text: "Something to drink? Water, juice, coffee?",
        tr: { en: "What would you like to drink?", "pt-BR": "O que você quer beber?" },
        ear: { en: "<b>“juice”</b> = “djus”.", "pt-BR": "<b>“juice”</b> = “djus”." },
        audioPrompt: "Crew over trolley clatter: “Something to drink? Water, juice, coffee?”",
        basic: "Water, please.", fluent: "Water, please.",
      },
      {
        text: "Still or sparkling?",
        tr: { en: "Flat water or fizzy water?", "pt-BR": "Água sem gás ou com gás?" },
        ear: { en: "<b>“still”</b> = sem gás; <b>“sparkling”</b> = com gás.", "pt-BR": "<b>“still”</b> = sem gás; <b>“sparkling”</b> = com gás." },
        audioPrompt: "Crew, holding two bottles: “Still or sparkling?”",
        basic: "Still.", fluent: "Still, please.",
      },
    ],
  },
  {
    sequence: 6, blockId: 1, indexInBlock: 6, phase: 1, threshold: 80,
    sceneTitle: { en: "Meal Service", "pt-BR": "Serviço de Refeição" },
    contextDescription: {
      en: "Hot trays, a narrow choice, and no time. The crew member holds two foil dishes and an eyebrow raised.",
      "pt-BR": "Bandejas quentes, escolha curta e sem tempo. O comissário segura dois pratos de alumínio e uma sobrancelha erguida.",
    },
    objective: {
      en: "Choose between two options and decline politely. Words: chicken/pasta, no thank you.",
      "pt-BR": "Escolher entre duas opções e recusar com educação. Palavras: chicken/pasta, no thank you.",
    },
    environment: { mood: "neutral", baseNoise: 48 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "chicken", say: "TCHÍ-kën", note: { en: "Two syllables, soft ending.", "pt-BR": "Duas sílabas, final suave." } },
    ],
    dialogueSteps: [
      {
        text: "Chicken or pasta?",
        tr: { en: "Which meal: chicken or pasta?", "pt-BR": "Qual refeição: frango ou massa?" },
        ear: { en: "<b>“pasta”</b> = “pás-ta” (UK).", "pt-BR": "<b>“pasta”</b> = “pás-ta” (Reino Unido)." },
        audioPrompt: "Crew, two trays raised: “Chicken or pasta?”",
        basic: "Chicken, please.", fluent: "Chicken, please.",
      },
      {
        text: "Anything to drink with your meal?",
        tr: { en: "Do you want a drink with the food?", "pt-BR": "Quer uma bebida com a comida?" },
        ear: { en: "<b>“with”</b> — soft ‘th’, tongue out.", "pt-BR": "<b>“with”</b> — ‘th’ suave, língua entre os dentes." },
        audioPrompt: "Crew, pouring: “Anything to drink with your meal?”",
        basic: "No, thank you.", fluent: "Just water, thanks.",
      },
    ],
  },
  {
    sequence: 7, blockId: 1, indexInBlock: 7, phase: 1, threshold: 80,
    sceneTitle: { en: "Anxiety — Feeling Unwell", "pt-BR": "Ansiedade — Mal-Estar" },
    contextDescription: {
      en: "Two hours in. Your chest is tight, the air feels thin, your hands are cold. A crew member crouches by your seat, voice low and steady.",
      "pt-BR": "Duas horas de voo. O peito aperta, o ar parece rarefeito, suas mãos estão geladas. Um comissário se agacha ao seu lado, voz baixa e firme.",
    },
    objective: {
      en: "Name a feeling and accept help — staying calm under pressure. Words: sick, nervous, water, breathe.",
      "pt-BR": "Nomear um sentimento e aceitar ajuda — mantendo a calma sob pressão. Palavras: sick, nervous, water, breathe.",
    },
    environment: { mood: "pleased", baseNoise: 46 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "I feel sick", say: "ai fíl SÍK", note: { en: "‘sick’ = unwell/nauseous.", "pt-BR": "‘sick’ = enjoado/mal." } },
      { word: "I'm nervous", say: "aim NÂR-vâs", note: { en: "Say how you feel; help comes faster.", "pt-BR": "Diga como se sente; a ajuda vem mais rápido." } },
    ],
    dialogueSteps: [
      {
        text: "Are you alright? You look pale.",
        tr: { en: "Are you okay? You look pale.", "pt-BR": "Você está bem? Está pálido(a)." },
        ear: { en: "<b>“alright”</b> = “ol-RÁIT”.", "pt-BR": "<b>“alright”</b> = “ol-RÁIT”." },
        audioPrompt: "Crew, gentle, crouching: “Are you alright? You look pale.”",
        basic: "I feel sick.", fluent: "I feel a little sick.",
      },
      {
        text: "Breathe slowly. Do you want water?",
        tr: { en: "Breathe slowly — do you want water?", "pt-BR": "Respire devagar — quer água?" },
        ear: { en: "<b>“breathe”</b> = “bríth” (soft th).", "pt-BR": "<b>“breathe”</b> = “bríth” (th suave)." },
        audioPrompt: "Crew, calm and slow: “Breathe slowly. Do you want water?”",
        basic: "Yes, please.", fluent: "Yes, please. Thank you.",
      },
    ],
  },
  {
    sequence: 8, blockId: 1, indexInBlock: 8, phase: 1, threshold: 80,
    sceneTitle: { en: "Asking for Things", "pt-BR": "Pedindo Coisas" },
    contextDescription: {
      en: "The cabin is cold and dark; most passengers sleep. You need two things — and you must start the conversation yourself.",
      "pt-BR": "A cabine está fria e escura; quase todos dormem. Você precisa de duas coisas — e precisa iniciar a conversa sozinho(a).",
    },
    objective: {
      en: "Initiate a polite request and ask where something is. Words: blanket, where, toilet.",
      "pt-BR": "Iniciar um pedido educado e perguntar onde fica algo. Palavras: blanket, where, toilet.",
    },
    environment: { mood: "neutral", baseNoise: 43 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "Could I have…?", say: "kud ai RÉV", note: { en: "Polite request opener.", "pt-BR": "Abertura de pedido educado." } },
      { word: "Where is…?", say: "UÉR iz", note: { en: "Ask for any location.", "pt-BR": "Pergunte por qualquer lugar." } },
    ],
    dialogueSteps: [
      {
        text: "Can I help you with anything?",
        tr: { en: "Do you need anything?", "pt-BR": "Você precisa de alguma coisa?" },
        ear: { en: "<b>“anything”</b> = “É-ni-thin”.", "pt-BR": "<b>“anything”</b> = “É-ni-thin”." },
        audioPrompt: "Crew, quiet in the dark cabin: “Can I help you with anything?”",
        basic: "A blanket, please.", fluent: "Could I have a blanket, please?",
      },
      {
        text: "Of course. Anything else?",
        tr: { en: "Sure — anything more?", "pt-BR": "Claro — mais alguma coisa?" },
        ear: { en: "<b>“toilet”</b> = “TÓI-lët” (UK).", "pt-BR": "<b>“toilet”</b> = “TÓI-lët” (Reino Unido)." },
        audioPrompt: "Crew, handing a blanket: “Of course. Anything else?”",
        basic: "Where is the toilet?", fluent: "Yes — where is the toilet?",
      },
    ],
  },
  {
    sequence: 9, blockId: 1, indexInBlock: 9, phase: 1, threshold: 80,
    sceneTitle: { en: "Turbulence — Follow Orders", "pt-BR": "Turbulência — Siga as Ordens" },
    contextDescription: {
      en: "The plane drops. Overhead bins shudder, a tray crashes, the seatbelt sign chimes hard. The crew shouts clear, urgent commands. No time to translate — only to obey.",
      "pt-BR": "O avião despenca. Os compartimentos tremem, uma bandeja cai, o aviso do cinto toca forte. A tripulação grita comandos claros e urgentes. Sem tempo para traduzir — só para obedecer.",
    },
    objective: {
      en: "Understand and obey urgent commands instantly. Words: seat, now, fasten, stay calm.",
      "pt-BR": "Entender e obedecer comandos urgentes na hora. Palavras: seat, now, fasten, stay calm.",
    },
    environment: { mood: "hostile", baseNoise: 64 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "right now", say: "RÁIT NÁU", note: { en: "Immediacy — act, don't think.", "pt-BR": "Imediato — aja, não pense." } },
    ],
    dialogueSteps: [
      {
        text: "Return to your seat immediately!",
        tr: { en: "Go back to your seat now!", "pt-BR": "Volte ao seu assento agora!" },
        ear: { en: "<b>“immediately”</b> = “i-MÍ-di-êt-li”.", "pt-BR": "<b>“immediately”</b> = “i-MÍ-di-êt-li”." },
        audioPrompt: "Crew, shouting over alarms: “Return to your seat immediately!”",
        basic: "Okay!", fluent: "Okay — right now!",
      },
      {
        text: "Fasten your seatbelt. Stay calm.",
        tr: { en: "Buckle up. Stay calm.", "pt-BR": "Afivele o cinto. Mantenha a calma." },
        ear: { en: "<b>“stay calm”</b> = “stêi KÁM” (silent L).", "pt-BR": "<b>“stay calm”</b> = “stêi KÁM” (L mudo)." },
        audioPrompt: "Crew, firm and loud: “Fasten your seatbelt. Stay calm.”",
        basic: "Yes!", fluent: "I understand.",
      },
    ],
  },
  {
    sequence: 10, blockId: 1, indexInBlock: 10, phase: 1, threshold: 80,
    sceneTitle: { en: "Your Neighbor", "pt-BR": "Seu Vizinho de Assento" },
    contextDescription: {
      en: "Calm again. The passenger beside you smiles and tries to chat. Low stakes, but your first real conversation — small talk is a survival skill too.",
      "pt-BR": "Tudo calmo de novo. O passageiro ao lado sorri e puxa conversa. Baixo risco, mas seu primeiro papo de verdade — conversa fiada também é sobrevivência.",
    },
    objective: {
      en: "Survive small talk: answer where you're from and yes/no. Words: yes, from, Brazil, first time.",
      "pt-BR": "Sobreviver à conversa fiada: dizer de onde você é e sim/não. Palavras: yes, from, Brazil, first time.",
    },
    environment: { mood: "pleased", baseNoise: 41 },
    npc: { name: { en: "Fellow Passenger", "pt-BR": "Passageiro(a) ao Lado" }, initials: "PA" },
    drills: [
      { word: "I'm from Brazil", say: "aim from bra-ZÍL", note: { en: "Stress the country's last syllable.", "pt-BR": "Acentue a última sílaba do país." } },
    ],
    dialogueSteps: [
      {
        text: "First time in London?",
        tr: { en: "Is this your first visit to London?", "pt-BR": "É sua primeira vez em Londres?" },
        ear: { en: "<b>“first”</b> = “fârst” (curl the R).", "pt-BR": "<b>“first”</b> = “fârst” (enrole o R)." },
        audioPrompt: "Passenger, friendly: “First time in London?”",
        basic: "Yes.", fluent: "Yes, my first time.",
      },
      {
        text: "Nice. Where are you from?",
        tr: { en: "Where do you come from?", "pt-BR": "De onde você é?" },
        ear: { en: "<b>“where are you”</b> blends: “UÉ-ra-iú”.", "pt-BR": "<b>“where are you”</b> junta: “UÉ-ra-iú”." },
        audioPrompt: "Passenger, leaning in: “Nice. Where are you from?”",
        basic: "Brazil.", fluent: "I'm from Brazil.",
      },
    ],
  },
  {
    sequence: 11, blockId: 1, indexInBlock: 11, phase: 1, threshold: 80,
    sceneTitle: { en: "The Immigration Form", "pt-BR": "O Cartão de Imigração" },
    contextDescription: {
      en: "The crew hands out landing cards before descent. The English on the form is dense; the crew member explains the fields you must fill in — and you'll repeat these exact words to the officer soon.",
      "pt-BR": "A tripulação distribui os cartões de desembarque antes da descida. O inglês do formulário é denso; o comissário explica os campos que você deve preencher — e você repetirá essas mesmas palavras ao oficial em breve.",
    },
    objective: {
      en: "Learn form vocabulary you'll reuse at customs: surname, purpose, address, sign.",
      "pt-BR": "Aprender o vocabulário do formulário que você reusará na imigração: surname, purpose, address, sign.",
    },
    environment: { mood: "neutral", baseNoise: 45 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "surname", say: "SÂR-nêim", note: { en: "= family name / last name.", "pt-BR": "= sobrenome." } },
      { word: "purpose", say: "PÂR-pâs", note: { en: "= the reason for your trip.", "pt-BR": "= o motivo da viagem." } },
    ],
    dialogueSteps: [
      {
        text: "Here's your landing card. Write your surname here.",
        tr: { en: "Fill in your family name in this box.", "pt-BR": "Escreva seu sobrenome neste campo." },
        ear: { en: "<b>“landing card”</b> = “LÉN-din kard”.", "pt-BR": "<b>“landing card”</b> = “LÉN-din kard”." },
        audioPrompt: "Crew, handing a small card and pen: “Here's your landing card. Write your surname here.”",
        basic: "Okay.", fluent: "Okay, thank you.",
      },
      {
        text: "Purpose of visit — tourism or business?",
        tr: { en: "Why are you visiting — tourism or business?", "pt-BR": "Qual o motivo — turismo ou negócios?" },
        ear: { en: "<b>“tourism”</b> = “TÚ-ri-zm”.", "pt-BR": "<b>“tourism”</b> = “TÚ-ri-zm”." },
        audioPrompt: "Crew, pointing at the box: “Purpose of visit — tourism or business?”",
        basic: "Tourism.", fluent: "Tourism.",
      },
      {
        text: "Good. Sign at the bottom, please.",
        tr: { en: "Now sign your name at the bottom.", "pt-BR": "Agora assine na parte de baixo." },
        ear: { en: "<b>“sign”</b> = “sáin” (silent G).", "pt-BR": "<b>“sign”</b> = “sáin” (G mudo)." },
        audioPrompt: "Crew, tapping the line: “Good. Sign at the bottom, please.”",
        basic: "Here?", fluent: "Right here?",
      },
    ],
  },
  {
    sequence: 12, blockId: 1, indexInBlock: 12, phase: 1, threshold: 80,
    sceneTitle: { en: "Descent & Landing", "pt-BR": "Descida & Pouso" },
    contextDescription: {
      en: "Ears pop as the plane drops through cloud. A final announcement crackles overhead. Seats up, belts on — London is below. Survive this and the doors open.",
      "pt-BR": "Os ouvidos tampam enquanto o avião desce pelas nuvens. Um último aviso estala no alto. Encostos retos, cintos afivelados — Londres está logo abaixo. Sobreviva a isto e as portas se abrem.",
    },
    objective: {
      en: "Follow the final landing instructions and close Phase 1. Words: upright, landing, welcome.",
      "pt-BR": "Seguir as instruções finais do pouso e encerrar a Fase 1. Palavras: upright, landing, welcome.",
    },
    environment: { mood: "neutral", baseNoise: 55 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a) de Bordo" }, initials: "CC" },
    drills: [
      { word: "seat upright", say: "sít âp-RÁIT", note: { en: "Bring the seat forward.", "pt-BR": "Traga o encosto para frente." } },
    ],
    dialogueSteps: [
      {
        text: "Seat upright, please. We're landing.",
        tr: { en: "Put your seat up; we are landing.", "pt-BR": "Endireite o encosto; vamos pousar." },
        ear: { en: "<b>“landing”</b> = “LÉN-din”.", "pt-BR": "<b>“landing”</b> = “LÉN-din”." },
        audioPrompt: "Crew, final check, brisk: “Seat upright, please. We're landing.”",
        basic: "Okay.", fluent: "Done.",
      },
      {
        text: "Welcome to London. Local time is 6 a.m.",
        tr: { en: "Welcome to London — it's 6 in the morning.", "pt-BR": "Bem-vindo a Londres — são 6 da manhã." },
        ear: { en: "<b>“welcome”</b> = “UÉL-câm”.", "pt-BR": "<b>“welcome”</b> = “UÉL-câm”." },
        audioPrompt: "Captain on the PA, warm: “Welcome to London. Local time is 6 a.m.”",
        basic: "Thank you.", fluent: "Thank you.",
      },
    ],
  },

  /* ===================== PHASE 2 — THE LANDING / ARRIVAL ===================== */
  {
    sequence: 13, blockId: 1, indexInBlock: 13, phase: 2, threshold: 80,
    sceneTitle: { en: "Passport Control", "pt-BR": "Controle de Passaporte" },
    contextDescription: {
      en: "Off the plane into a vast, echoing terminal. A cold queue snakes toward glass booths. The officer doesn't smile. Everything you wrote on the landing card, you now must say out loud.",
      "pt-BR": "Para fora do avião, num terminal vasto e ecoante. Uma fila fria serpenteia até cabines de vidro. O oficial não sorri. Tudo o que você escreveu no cartão, agora precisa dizer em voz alta.",
    },
    objective: {
      en: "Survive the first authority encounter: state purpose and duration. Words: passport, tourism, one week.",
      "pt-BR": "Sobreviver ao primeiro encontro com a autoridade: dizer motivo e duração. Palavras: passport, tourism, one week.",
    },
    environment: { mood: "hostile", baseNoise: 30 },
    npc: { name: { en: "Border Officer", "pt-BR": "Oficial de Fronteira" }, initials: "BO" },
    drills: [
      { word: "tourism", say: "TÚ-ri-zm", note: { en: "Same word from the form — reuse it.", "pt-BR": "Mesma palavra do formulário — reutilize." } },
    ],
    dialogueSteps: [
      {
        text: "Passport. Purpose of your visit?",
        tr: { en: "Show your passport; why are you here?", "pt-BR": "Mostre o passaporte; por que você veio?" },
        ear: { en: "<b>“passport”</b> = “PÁS-port”.", "pt-BR": "<b>“passport”</b> = “PÁS-port”." },
        audioPrompt: "Officer, flat, not looking up: “Passport. Purpose of your visit?”",
        basic: "Tourism.", fluent: "Tourism — I'm here on holiday.",
      },
      {
        text: "How long are you staying?",
        tr: { en: "How many days will you be here?", "pt-BR": "Quantos dias você vai ficar?" },
        ear: { en: "<b>“how long”</b> = “rau lóng”.", "pt-BR": "<b>“how long”</b> = “rau lóng”." },
        audioPrompt: "Officer, clipped: “How long are you staying?”",
        basic: "One week.", fluent: "About a week.",
      },
    ],
  },
  {
    sequence: 14, blockId: 1, indexInBlock: 14, phase: 2, threshold: 80,
    sceneTitle: { en: "Customs — Where & Return", "pt-BR": "Imigração — Onde & Volta" },
    contextDescription: {
      en: "The officer scans your passport; the booth beeps. Two more questions stand between you and the city. Hesitate, and the questions multiply.",
      "pt-BR": "O oficial passa o leitor; a cabine apita. Duas perguntas separam você da cidade. Hesite, e as perguntas se multiplicam.",
    },
    objective: {
      en: "Say where you'll stay and confirm a return ticket. Words: hotel, return ticket, Sunday.",
      "pt-BR": "Dizer onde vai ficar e confirmar a passagem de volta. Palavras: hotel, return ticket, Sunday.",
    },
    environment: { mood: "hostile", baseNoise: 28 },
    npc: { name: { en: "Border Officer", "pt-BR": "Oficial de Fronteira" }, initials: "BO" },
    drills: [
      { word: "return ticket", say: "ri-TÂRN TÍ-kët", note: { en: "Proof you'll leave again.", "pt-BR": "Prova de que você vai voltar." } },
    ],
    dialogueSteps: [
      {
        text: "Where will you be staying?",
        tr: { en: "What's your address here?", "pt-BR": "Onde você vai se hospedar?" },
        ear: { en: "<b>“staying”</b> = “STÊI-in”.", "pt-BR": "<b>“staying”</b> = “STÊI-in”." },
        audioPrompt: "Officer, reading the screen: “Where will you be staying?”",
        basic: "A hotel.", fluent: "At a hotel in Camden.",
      },
      {
        text: "Do you have a return ticket?",
        tr: { en: "Do you have a ticket back home?", "pt-BR": "Você tem passagem de volta?" },
        ear: { en: "<b>“return”</b> = “ri-TÂRN”.", "pt-BR": "<b>“return”</b> = “ri-TÂRN”." },
        audioPrompt: "Officer, eyes up now: “Do you have a return ticket?”",
        basic: "Yes.", fluent: "Yes, next Sunday.",
      },
    ],
  },
  {
    sequence: 15, blockId: 1, indexInBlock: 15, phase: 2, threshold: 80,
    sceneTitle: { en: "Customs — Declarations", "pt-BR": "Alfândega — Declarações" },
    contextDescription: {
      en: "Green channel or red? Trolleys rattle across tile; a sniffer dog works the line. A customs officer steps in front of you.",
      "pt-BR": "Canal verde ou vermelho? Carrinhos chacoalham no piso; um cão farejador trabalha a fila. Um oficial da alfândega para na sua frente.",
    },
    objective: {
      en: "Answer declaration questions with a confident 'no'. Words: declare, nothing, food, cash.",
      "pt-BR": "Responder às perguntas de declaração com um 'não' confiante. Palavras: declare, nothing, food, cash.",
    },
    environment: { mood: "neutral", baseNoise: 36 },
    npc: { name: { en: "Customs Officer", "pt-BR": "Oficial da Alfândega" }, initials: "CO" },
    drills: [
      { word: "nothing to declare", say: "NÂ-thin tu di-CLÉR", note: { en: "The green-channel answer.", "pt-BR": "A resposta do canal verde." } },
    ],
    dialogueSteps: [
      {
        text: "Anything to declare?",
        tr: { en: "Are you carrying goods to declare?", "pt-BR": "Tem algo a declarar?" },
        ear: { en: "<b>“declare”</b> = “di-CLÉR”.", "pt-BR": "<b>“declare”</b> = “di-CLÉR”." },
        audioPrompt: "Officer, stepping in: “Anything to declare?”",
        basic: "No.", fluent: "No, nothing.",
      },
      {
        text: "Any food, or cash over ten thousand pounds?",
        tr: { en: "Food, or a lot of cash?", "pt-BR": "Comida, ou muito dinheiro?" },
        ear: { en: "<b>“cash”</b> = “kéch” (short, sharp).", "pt-BR": "<b>“cash”</b> = “kéch” (curto, seco)." },
        audioPrompt: "Officer, routine: “Any food, or cash over ten thousand pounds?”",
        basic: "No.", fluent: "No, neither.",
      },
    ],
  },
  {
    sequence: 16, blockId: 1, indexInBlock: 16, phase: 2, threshold: 80,
    sceneTitle: { en: "Baggage Claim — Lost Bag", "pt-BR": "Esteira — Mala Perdida" },
    contextDescription: {
      en: "Carousels groan and circle. Bags come and go — but not yours. Panic rises. You must find the right belt, then report a missing suitcase clearly.",
      "pt-BR": "As esteiras rangem e giram. Malas vêm e vão — menos a sua. O pânico sobe. Você precisa achar a esteira certa e relatar a mala sumida com clareza.",
    },
    objective: {
      en: "Ask which belt, then describe a lost bag. Words: belt, suitcase, black, medium.",
      "pt-BR": "Perguntar qual esteira e descrever a mala perdida. Palavras: belt, suitcase, black, medium.",
    },
    environment: { mood: "neutral", baseNoise: 44 },
    npc: { name: { en: "Ground Staff", "pt-BR": "Funcionário(a) de Solo" }, initials: "GS" },
    drills: [
      { word: "suitcase", say: "SÚT-kêis", note: { en: "= your large travel bag.", "pt-BR": "= sua mala grande." } },
      { word: "I can't find it", say: "ai ként FÁIND it", note: { en: "Report something missing.", "pt-BR": "Relatar algo sumido." } },
    ],
    dialogueSteps: [
      {
        text: "Which belt for flight BA-246?",
        tr: { en: "(You ask) Where do bags from BA-246 arrive?", "pt-BR": "(Você pergunta) Onde chegam as malas do BA-246?" },
        ear: { en: "<b>“belt”</b> = “bélt” (baggage carousel).", "pt-BR": "<b>“belt”</b> = “bélt” (esteira)." },
        audioPrompt: "Staff, pointing across the hall: “Belt 5, over there.”",
        basic: "Thank you.", fluent: "Thanks — belt 5.",
      },
      {
        text: "Your bag isn't here? Describe it, please.",
        tr: { en: "Tell me what your bag looks like.", "pt-BR": "Descreva como é a sua mala." },
        ear: { en: "<b>“describe”</b> = “dis-CRÁIB”.", "pt-BR": "<b>“describe”</b> = “dis-CRÁIB”." },
        audioPrompt: "Staff at the desk: “Your bag isn't here? Describe it, please.”",
        basic: "Black, medium.", fluent: "It's black and medium-sized.",
      },
    ],
  },

  /* ===================== PHASE 3 — ARRIVAL (THE CITY) ===================== */
  {
    sequence: 17, blockId: 1, indexInBlock: 17, phase: 3, threshold: 80,
    sceneTitle: { en: "Ground Transport", "pt-BR": "Transporte" },
    contextDescription: {
      en: "Sliding doors open onto grey London air, taxi horns and rain. A black cab pulls up; the driver lowers the window and waits, meter ticking in his head.",
      "pt-BR": "As portas se abrem para o ar cinza de Londres, buzinas de táxi e chuva. Um táxi preto encosta; o motorista abaixa o vidro e espera, o taxímetro já rodando na cabeça dele.",
    },
    objective: {
      en: "State a destination and ask the price. Words: to…, please; how much.",
      "pt-BR": "Dizer o destino e perguntar o preço. Palavras: to…, please; how much.",
    },
    environment: { mood: "neutral", baseNoise: 52 },
    npc: { name: { en: "Taxi Driver", "pt-BR": "Taxista" }, initials: "TX" },
    drills: [
      { word: "how much?", say: "rau MÂTCH", note: { en: "Ask any price.", "pt-BR": "Pergunte qualquer preço." } },
    ],
    dialogueSteps: [
      {
        text: "Where to, mate?",
        tr: { en: "Where are you going?", "pt-BR": "Para onde você vai?" },
        ear: { en: "<b>“where to”</b> = “UÉR-tu”.", "pt-BR": "<b>“where to”</b> = “UÉR-tu”." },
        audioPrompt: "Driver, leaning over, friendly-gruff: “Where to, mate?”",
        basic: "Camden, please.", fluent: "To Camden, please.",
      },
      {
        text: "Camden. About twenty-five pounds.",
        tr: { en: "It'll cost around £25.", "pt-BR": "Vai custar uns £25." },
        ear: { en: "<b>“pounds”</b> = “páunds”.", "pt-BR": "<b>“pounds”</b> = “páunds”." },
        audioPrompt: "Driver, starting the meter: “Camden. About twenty-five pounds.”",
        basic: "Okay.", fluent: "Okay, thank you.",
      },
    ],
  },
  {
    sequence: 18, blockId: 1, indexInBlock: 18, phase: 3, threshold: 80,
    sceneTitle: { en: "Hotel Check-in", "pt-BR": "Check-in no Hotel" },
    contextDescription: {
      en: "A warm, quiet lobby after the cold outside. The receptionist greets you with a practiced smile and a screen full of names. You're exhausted — keep it simple.",
      "pt-BR": "Um lobby quente e silencioso depois do frio lá fora. A recepcionista te cumprimenta com um sorriso ensaiado e uma tela cheia de nomes. Você está exausto(a) — seja simples.",
    },
    objective: {
      en: "Claim a reservation and receive a room. Words: reservation, name, key, room.",
      "pt-BR": "Confirmar a reserva e receber o quarto. Palavras: reservation, name, key, room.",
    },
    environment: { mood: "pleased", baseNoise: 24 },
    npc: { name: { en: "Receptionist", "pt-BR": "Recepcionista" }, initials: "RC" },
    drills: [
      { word: "reservation", say: "re-zâr-VÊI-shân", note: { en: "= a booking under your name.", "pt-BR": "= uma reserva no seu nome." } },
    ],
    dialogueSteps: [
      {
        text: "Good morning. Do you have a reservation?",
        tr: { en: "Did you book a room in advance?", "pt-BR": "Você tem uma reserva?" },
        ear: { en: "<b>“reservation”</b> = “re-zâr-VÊI-shân”.", "pt-BR": "<b>“reservation”</b> = “re-zâr-VÊI-shân”." },
        audioPrompt: "Receptionist, warm: “Good morning. Do you have a reservation?”",
        basic: "Yes.", fluent: "Yes, under Pires.",
      },
      {
        text: "Here's your key. Room 204, second floor.",
        tr: { en: "Take your key — room 204, floor 2.", "pt-BR": "Aqui está a chave — quarto 204, 2º andar." },
        ear: { en: "<b>“second floor”</b> = “SÉ-cãnd flór”.", "pt-BR": "<b>“second floor”</b> = “SÉ-cãnd flór”." },
        audioPrompt: "Receptionist, sliding a key card: “Here's your key. Room 204, second floor.”",
        basic: "Thank you.", fluent: "Thank you very much.",
      },
    ],
  },
  {
    sequence: 19, blockId: 1, indexInBlock: 19, phase: 3, threshold: 80,
    sceneTitle: { en: "Ordering Food", "pt-BR": "Pedindo Comida" },
    contextDescription: {
      en: "A busy corner café: steam, chatter, the hiss of an espresso machine. The server taps a screen and looks up — you have about three seconds to order.",
      "pt-BR": "Um café de esquina movimentado: vapor, conversas, o chiado da máquina de espresso. O atendente toca a tela e te olha — você tem uns três segundos para pedir.",
    },
    objective: {
      en: "Order an item and choose eat-in or takeaway. Words: a coffee, please; take away.",
      "pt-BR": "Pedir um item e escolher comer no local ou levar. Palavras: a coffee, please; take away.",
    },
    environment: { mood: "neutral", baseNoise: 48 },
    npc: { name: { en: "Café Server", "pt-BR": "Atendente do Café" }, initials: "SV" },
    drills: [
      { word: "I'll have…", say: "ail RÉV", note: { en: "Natural way to order.", "pt-BR": "Jeito natural de pedir." } },
    ],
    dialogueSteps: [
      {
        text: "What can I get you?",
        tr: { en: "What would you like to order?", "pt-BR": "O que você vai querer?" },
        ear: { en: "<b>“get you”</b> blends: “gué-tchu”.", "pt-BR": "<b>“get you”</b> junta: “gué-tchu”." },
        audioPrompt: "Server, over café noise: “What can I get you?”",
        basic: "A coffee, please.", fluent: "A coffee and a sandwich, please.",
      },
      {
        text: "Eat in or take away?",
        tr: { en: "Here, or to go?", "pt-BR": "Comer aqui ou levar?" },
        ear: { en: "<b>“take away”</b> = “têik-a-UÊI”.", "pt-BR": "<b>“take away”</b> = “têik-a-UÊI”." },
        audioPrompt: "Server, hand on a cup: “Eat in or take away?”",
        basic: "Take away.", fluent: "Take away, please.",
      },
    ],
  },
  {
    sequence: 20, blockId: 1, indexInBlock: 20, phase: 3, threshold: 80,
    sceneTitle: { en: "Emergency — Get Help", "pt-BR": "Emergência — Peça Ajuda" },
    contextDescription: {
      en: "Rain, unfamiliar streets, no signal on your phone, and a wrong turn. Your chest tightens again — but this time you have words. A police officer notices you.",
      "pt-BR": "Chuva, ruas estranhas, sem sinal no celular e uma curva errada. O peito aperta de novo — mas desta vez você tem palavras. Um policial nota você.",
    },
    objective: {
      en: "Get urgent help fast: say you're lost and ask for a hospital. Words: lost, help, hospital, where.",
      "pt-BR": "Conseguir ajuda urgente rápido: dizer que está perdido(a) e pedir um hospital. Palavras: lost, help, hospital, where.",
    },
    environment: { mood: "hostile", baseNoise: 54 },
    npc: { name: { en: "Police Officer", "pt-BR": "Policial" }, initials: "PO" },
    drills: [
      { word: "I'm lost", say: "aim LÓST", note: { en: "Three words that summon help.", "pt-BR": "Três palavras que trazem ajuda." } },
      { word: "where is the hospital?", say: "UÉR iz dâ RÓS-pi-tâl", note: { en: "Find urgent care.", "pt-BR": "Encontrar atendimento de emergência." } },
    ],
    dialogueSteps: [
      {
        text: "You alright? You look lost.",
        tr: { en: "Are you okay? You seem lost.", "pt-BR": "Você está bem? Parece perdido(a)." },
        ear: { en: "<b>“lost”</b> = “lóst” (short, hard T).", "pt-BR": "<b>“lost”</b> = “lóst” (curto, T seco)." },
        audioPrompt: "Officer, concerned, in the rain: “You alright? You look lost.”",
        basic: "I'm lost.", fluent: "I'm lost. Can you help me?",
      },
      {
        text: "Okay. What do you need?",
        tr: { en: "Tell me what you need.", "pt-BR": "Diga o que você precisa." },
        ear: { en: "<b>“hospital”</b> = “RÓS-pi-tâl”.", "pt-BR": "<b>“hospital”</b> = “RÓS-pi-tâl”." },
        audioPrompt: "Officer, steady, hand on shoulder: “Okay. What do you need?”",
        basic: "A hospital.", fluent: "Where is the nearest hospital?",
      },
    ],
  },
];

// Lookup by sequence (number or string id).
export const BLOCK0_BY_SEQUENCE = BLOCK0_MODULES.reduce((acc, m) => {
  acc[m.sequence] = m;
  return acc;
}, {});
