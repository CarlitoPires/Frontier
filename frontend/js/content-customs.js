/* ============================================================
 *  LinguoBound — Content prototype: "Customs" scenario (modules 1–5)
 *
 *  Canonical scene data, authored to the schema in docs/CONTENT_SCHEMA.md.
 *  Used as:
 *   1) the seed pushed to Firestore `content/{sequence}` (admin seeder), and
 *   2) a client-side fallback so scenes render even before seeding.
 *
 *  LEARNING CONTENT (text / basic / fluent) is English by design.
 * ============================================================ */

export const CUSTOMS_MODULES = [
  {
    sequence: 1,
    blockId: 1,
    indexInBlock: 1,
    threshold: 80,
    sceneTitle: { en: "Customs — First Contact", "pt-BR": "Imigração — Primeiro Contato" },
    contextDescription: {
      en: "Heathrow arrivals. A cold, fluorescent-lit booth. The officer doesn't look up.",
      "pt-BR": "Desembarque em Heathrow. Uma cabine fria, sob luz fluorescente. O oficial não levanta os olhos.",
    },
    environment: { mood: "hostile", baseNoise: 22 },
    npc: { name: { en: "Border Officer", "pt-BR": "Oficial de Fronteira" }, initials: "BO" },
    dialogueSteps: [
      {
        text: "Passport, please. What is the purpose of your visit?",
        tr: { en: "He's asking why you're visiting.", "pt-BR": "Ele está perguntando o motivo da sua visita." },
        ear: { en: "Relax the jaw: <b>“pur-puhs”</b>, not “purpouse”.", "pt-BR": "Relaxe a mandíbula: <b>“pér-pôs”</b>, não “purpouse”." },
        audioPrompt: "Officer, flat and firm: “Passport, please. What is the purpose of your visit?”",
        basic: "Tourism.",
        fluent: "Tourism — I'm here on holiday.",
      },
      {
        text: "Business or tourism? Which is it?",
        tr: { en: "He wants a clear one-word answer.", "pt-BR": "Ele quer uma resposta clara, em uma palavra." },
        ear: { en: "Hard ‘B’ in <b>“business”</b>; keep it short.", "pt-BR": "‘B’ forte em <b>“business”</b>; seja breve." },
        audioPrompt: "Officer, impatient: “Business or tourism? Which is it?”",
        basic: "Tourism.",
        fluent: "Tourism. Just visiting for a week.",
      },
    ],
  },

  {
    sequence: 2,
    blockId: 1,
    indexInBlock: 2,
    threshold: 80,
    sceneTitle: { en: "Customs — Length of Stay", "pt-BR": "Imigração — Tempo de Permanência" },
    contextDescription: {
      en: "The officer scans your passport. The queue murmurs behind you.",
      "pt-BR": "O oficial passa o leitor no seu passaporte. A fila murmura atrás de você.",
    },
    environment: { mood: "neutral", baseNoise: 26 },
    npc: { name: { en: "Border Officer", "pt-BR": "Oficial de Fronteira" }, initials: "BO" },
    dialogueSteps: [
      {
        text: "How long do you plan to stay?",
        tr: { en: "He's asking the duration of your trip.", "pt-BR": "Ele está perguntando quanto tempo você vai ficar." },
        ear: { en: "<b>“lóng”</b> — short and low.", "pt-BR": "<b>“lóng”</b> — curto e grave." },
        audioPrompt: "Officer, neutral: “How long do you plan to stay?”",
        basic: "One week.",
        fluent: "About a week — seven days.",
      },
      {
        text: "And where will you be staying?",
        tr: { en: "He wants your address in the city.", "pt-BR": "Ele quer o seu endereço na cidade." },
        ear: { en: "<b>“stay-ing”</b> — don't rush the ending.", "pt-BR": "<b>“stay-ing”</b> — não corra no final." },
        audioPrompt: "Officer, neutral: “And where will you be staying?”",
        basic: "A hotel in Camden.",
        fluent: "At a small hotel in Camden, near the market.",
      },
    ],
  },

  {
    sequence: 3,
    blockId: 1,
    indexInBlock: 3,
    threshold: 80,
    sceneTitle: { en: "Customs — Return & Funds", "pt-BR": "Imigração — Volta e Recursos" },
    contextDescription: {
      en: "The officer's eyes narrow. This is the part that decides things.",
      "pt-BR": "Os olhos do oficial se estreitam. Esta é a parte que decide tudo.",
    },
    environment: { mood: "hostile", baseNoise: 30 },
    npc: { name: { en: "Border Officer", "pt-BR": "Oficial de Fronteira" }, initials: "BO" },
    dialogueSteps: [
      {
        text: "Do you have a return ticket?",
        tr: { en: "He's asking if you have a ticket back.", "pt-BR": "Ele está perguntando se você tem passagem de volta." },
        ear: { en: "<b>“ri-TURN”</b> — stress the second part.", "pt-BR": "<b>“ri-TÂRN”</b> — enfatize a segunda parte." },
        audioPrompt: "Officer, suspicious: “Do you have a return ticket?”",
        basic: "Yes, next Sunday.",
        fluent: "Yes — I fly back next Sunday evening.",
      },
      {
        text: "How will you support yourself during your stay?",
        tr: { en: "He's asking how you'll pay for things.", "pt-BR": "Ele está perguntando como você vai se manter." },
        ear: { en: "<b>“su-PORT”</b> — stress the second syllable.", "pt-BR": "<b>“su-PÓRT”</b> — enfatize a segunda sílaba." },
        audioPrompt: "Officer, probing: “How will you support yourself during your stay?”",
        basic: "I have savings.",
        fluent: "I've saved enough, and I have my cards with me.",
      },
    ],
  },

  {
    sequence: 4,
    blockId: 1,
    indexInBlock: 4,
    threshold: 80,
    sceneTitle: { en: "Customs — Declarations", "pt-BR": "Imigração — Declarações" },
    contextDescription: {
      en: "A busy baggage hall. Carts rattle; a dog handler passes by.",
      "pt-BR": "Um saguão de bagagens movimentado. Carrinhos chacoalham; um adestrador passa com um cão.",
    },
    environment: { mood: "neutral", baseNoise: 34 },
    npc: { name: { en: "Customs Officer", "pt-BR": "Oficial da Alfândega" }, initials: "CO" },
    dialogueSteps: [
      {
        text: "Do you have anything to declare?",
        tr: { en: "He's asking if you carry taxable/restricted goods.", "pt-BR": "Ele pergunta se você traz itens a declarar." },
        ear: { en: "<b>“di-CLAIR”</b> — open the vowel.", "pt-BR": "<b>“di-CLÉR”</b> — abra a vogal." },
        audioPrompt: "Officer, brisk over hall noise: “Do you have anything to declare?”",
        basic: "No, nothing.",
        fluent: "No, nothing to declare.",
      },
      {
        text: "Any food, or more than ten thousand pounds in cash?",
        tr: { en: "He's asking about food and large amounts of cash.", "pt-BR": "Ele pergunta sobre alimentos e grandes quantias em dinheiro." },
        ear: { en: "<b>“cash”</b> — short ‘a’, sharp ending.", "pt-BR": "<b>“cash”</b> — ‘a’ curto, final seco." },
        audioPrompt: "Officer, routine: “Any food, or more than ten thousand pounds in cash?”",
        basic: "No, neither.",
        fluent: "No food, and well under that in cash.",
      },
    ],
  },

  {
    sequence: 5,
    blockId: 1,
    indexInBlock: 5,
    threshold: 80,
    sceneTitle: { en: "Customs — The Decision", "pt-BR": "Imigração — A Decisão" },
    contextDescription: {
      en: "Pulled aside for secondary questioning. Stay calm — this is the last gate.",
      "pt-BR": "Levado para questionamento secundário. Mantenha a calma — este é o último portão.",
    },
    environment: { mood: "hostile", baseNoise: 28 },
    npc: { name: { en: "Senior Officer", "pt-BR": "Oficial Sênior" }, initials: "SO" },
    dialogueSteps: [
      {
        text: "Step aside, please. Just a few more questions.",
        tr: { en: "He's asking you to move aside for more questions.", "pt-BR": "Ele pede que você se afaste para mais perguntas." },
        ear: { en: "<b>“a-SIDE”</b> — stress the second part.", "pt-BR": "<b>“a-SÁID”</b> — enfatize a segunda parte." },
        audioPrompt: "Senior officer, controlled: “Step aside, please. Just a few more questions.”",
        basic: "Of course.",
        fluent: "Of course — no problem.",
      },
      {
        text: "What do you do for a living back home?",
        tr: { en: "He's asking about your job back home.", "pt-BR": "Ele está perguntando qual é o seu trabalho no seu país." },
        ear: { en: "<b>“lí-ving”</b> — light, quick.", "pt-BR": "<b>“lí-ving”</b> — leve e rápido." },
        audioPrompt: "Senior officer, even: “What do you do for a living back home?”",
        basic: "I'm a designer.",
        fluent: "I'm a designer — I work at a studio.",
      },
      {
        text: "Alright. Welcome to London. Next, please.",
        tr: { en: "You're cleared — he's welcoming you in.", "pt-BR": "Você foi liberado — ele está te dando as boas-vindas." },
        ear: { en: "<b>“wel-cuhm”</b> — soft, unstressed ending.", "pt-BR": "<b>“uél-cãm”</b> — final suave, átono." },
        audioPrompt: "Senior officer, warmer: “Alright. Welcome to London. Next, please.”",
        basic: "Thank you.",
        fluent: "Thank you — have a good day.",
      },
    ],
  },
];

// Lookup by sequence (number or string).
export const CUSTOMS_BY_SEQUENCE = CUSTOMS_MODULES.reduce((acc, m) => {
  acc[m.sequence] = m;
  return acc;
}, {});
