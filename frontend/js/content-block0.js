/* ============================================================
 *  LinguoBound — City 01: London · BLOCK 01 (Modules 01–25)
 *  "The Survival Arc" — 5 narrative sub-blocks:
 *    1.1 The Flight        (01–05)  cabin survival
 *    1.2 Hostile Customs   (06–10)  passport / financial interrogation
 *    1.3 Baggage Chaos     (11–15)  lost luggage / describing bags / toilet
 *    1.4 Connection        (16–20)  UK SIM card / data plan / activation
 *    1.5 Escape & Reward   (21–25)  Tube / Oyster / broken machine / BONUS
 *
 *  Supports the 3-level pedagogy engine (HUD adapts):
 *   - Absolute Beginner: pt-BR phonetic spellings in `ear`/`drills` + slow TTS.
 *   - Intermediate: standard text, normal TTS, higher time pressure.
 *   - Fluent (Free Flight): open mic, no subtitles, heavy ambient noise.
 *
 *  Schema: docs/CONTENT_SCHEMA.md. LEARNING CONTENT (text/basic/fluent) is
 *  English; tr/ear/objective/drills.note are bilingual {en, "pt-BR"}.
 * ============================================================ */

export const BLOCK0_MODULES = [
  /* ===================== 1.1 — THE FLIGHT ===================== */
  {
    sequence: 1, blockId: 1, indexInBlock: 1, phase: 1, subBlock: "1.1", threshold: 80,
    sceneTitle: { en: "Boarding — Find Your Seat", "pt-BR": "Embarque — Ache Seu Assento" },
    contextDescription: {
      en: "A narrow cabin, recycled air, the whine of the APU, and a queue pressing behind you. The crew member blocks the aisle, waiting.",
      "pt-BR": "Cabine estreita, ar reciclado, o zumbido da APU e uma fila empurrando atrás de você. O comissário bloqueia o corredor, esperando.",
    },
    objective: { en: "Greet, show your boarding pass, understand a seat number.", "pt-BR": "Cumprimentar, mostrar o cartão de embarque, entender o número do assento." },
    environment: { mood: "neutral", baseNoise: 40 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a)" }, initials: "CC" },
    drills: [{ word: "excuse me", say: "iks-KIÚZ mi", note: { en: "To pass / get attention.", "pt-BR": "Para passar / chamar atenção." } }],
    dialogueSteps: [
      { text: "Good evening. Boarding pass, please.", tr: { en: "She wants your boarding pass.", "pt-BR": "Ela quer seu cartão de embarque." }, ear: { en: "<b>“bor-ding pass”</b>", "pt-BR": "<b>“bór-din pés”</b>" }, audioPrompt: "Crew, brisk: “Good evening. Boarding pass, please.”", basic: "Here.", fluent: "Here you are." },
      { text: "Twenty-two A. Window seat, on your left.", tr: { en: "Seat 22A, window, left.", "pt-BR": "Assento 22A, janela, à esquerda." }, ear: { en: "<b>“win-doh”</b>", "pt-BR": "<b>“uín-dô”</b>" }, audioPrompt: "Crew, pointing: “Twenty-two A. Window seat, on your left.”", basic: "Thank you.", fluent: "Thank you very much." },
    ],
  },
  {
    sequence: 2, blockId: 1, indexInBlock: 2, phase: 1, subBlock: "1.1", threshold: 80,
    sceneTitle: { en: "Seatbelt & Safety", "pt-BR": "Cinto & Segurança" },
    contextDescription: {
      en: "Lights dim, a safety chime sounds, and the crew sweeps the aisle fast before pushback.",
      "pt-BR": "As luzes baixam, um aviso sonoro toca e a tripulação percorre o corredor rápido antes do recuo.",
    },
    objective: { en: "Obey safety commands instantly; clear yes/no.", "pt-BR": "Obedecer comandos de segurança na hora; sim/não claros." },
    environment: { mood: "neutral", baseNoise: 44 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a)" }, initials: "CC" },
    drills: [{ word: "yes / no", say: "IÉS / NÔU", note: { en: "Your two lifelines.", "pt-BR": "Suas duas tábuas de salvação." } }],
    dialogueSteps: [
      { text: "Fasten your seatbelt, please.", tr: { en: "Buckle your seatbelt.", "pt-BR": "Afivele o cinto." }, ear: { en: "<b>“sít-bélt”</b>", "pt-BR": "<b>“sít-bélt”</b>" }, audioPrompt: "Crew, leaning in: “Fasten your seatbelt, please.”", basic: "Okay.", fluent: "Done." },
      { text: "Tray table up. We're departing.", tr: { en: "Tray up; we're leaving.", "pt-BR": "Mesinha para cima; vamos partir." }, ear: { en: "<b>“trêi”</b> (rhymes with day)", "pt-BR": "<b>“trêi”</b> (rima com day)" }, audioPrompt: "Crew, brisk: “Tray table up. We're departing.”", basic: "Okay.", fluent: "Sure, up now." },
    ],
  },
  {
    sequence: 3, blockId: 1, indexInBlock: 3, phase: 1, subBlock: "1.1", threshold: 80,
    sceneTitle: { en: "Turbulence — Follow Orders", "pt-BR": "Turbulência — Siga as Ordens" },
    contextDescription: {
      en: "The plane drops. Bins shudder, a tray crashes, the seatbelt sign chimes hard. The crew shouts urgent commands — no time to translate.",
      "pt-BR": "O avião despenca. Compartimentos tremem, uma bandeja cai, o aviso do cinto toca forte. A tripulação grita comandos urgentes — sem tempo para traduzir.",
    },
    objective: { en: "Understand and obey urgent commands instantly.", "pt-BR": "Entender e obedecer comandos urgentes na hora." },
    environment: { mood: "hostile", baseNoise: 64 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a)" }, initials: "CC" },
    drills: [{ word: "right now", say: "RÁIT NÁU", note: { en: "Act, don't think.", "pt-BR": "Aja, não pense." } }],
    dialogueSteps: [
      { text: "Return to your seat immediately!", tr: { en: "Go back to your seat now!", "pt-BR": "Volte ao seu assento agora!" }, ear: { en: "<b>“i-MÍ-di-êt-li”</b>", "pt-BR": "<b>“i-MÍ-di-êt-li”</b>" }, audioPrompt: "Crew, shouting over alarms: “Return to your seat immediately!”", basic: "Okay!", fluent: "Okay — right now!" },
      { text: "Fasten your seatbelt. Stay calm.", tr: { en: "Buckle up. Stay calm.", "pt-BR": "Afivele o cinto. Mantenha a calma." }, ear: { en: "<b>“stêi KÁM”</b> (silent L)", "pt-BR": "<b>“stêi KÁM”</b> (L mudo)" }, audioPrompt: "Crew, firm and loud: “Fasten your seatbelt. Stay calm.”", basic: "Yes!", fluent: "I understand." },
    ],
  },
  {
    sequence: 4, blockId: 1, indexInBlock: 4, phase: 1, subBlock: "1.1", threshold: 80,
    sceneTitle: { en: "Feeling Unwell", "pt-BR": "Mal-Estar" },
    contextDescription: {
      en: "Two hours in: tight chest, thin air, cold hands. A crew member crouches by your seat, voice low and steady.",
      "pt-BR": "Duas horas de voo: peito apertado, ar rarefeito, mãos geladas. Um comissário se agacha ao seu lado, voz baixa e firme.",
    },
    objective: { en: "Name a feeling and accept help, staying calm.", "pt-BR": "Nomear um sentimento e aceitar ajuda, mantendo a calma." },
    environment: { mood: "pleased", baseNoise: 46 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a)" }, initials: "CC" },
    drills: [{ word: "I feel sick", say: "ai fíl SÍK", note: { en: "= unwell / nauseous.", "pt-BR": "= enjoado / mal." } }],
    dialogueSteps: [
      { text: "Are you alright? You look pale.", tr: { en: "Are you okay? You look pale.", "pt-BR": "Você está bem? Está pálido(a)." }, ear: { en: "<b>“ol-RÁIT”</b>", "pt-BR": "<b>“ol-RÁIT”</b>" }, audioPrompt: "Crew, gentle: “Are you alright? You look pale.”", basic: "I feel sick.", fluent: "I feel a little sick." },
      { text: "Breathe slowly. Do you want water?", tr: { en: "Breathe slowly — want water?", "pt-BR": "Respire devagar — quer água?" }, ear: { en: "<b>“bríth”</b> (soft th)", "pt-BR": "<b>“bríth”</b> (th suave)" }, audioPrompt: "Crew, calm: “Breathe slowly. Do you want water?”", basic: "Yes, please.", fluent: "Yes, please. Thank you." },
    ],
  },
  {
    sequence: 5, blockId: 1, indexInBlock: 5, phase: 1, subBlock: "1.1", threshold: 80,
    sceneTitle: { en: "The Immigration Form", "pt-BR": "O Cartão de Imigração" },
    contextDescription: {
      en: "Landing cards handed out before descent. The crew explains the fields — you'll say these exact words to the officer soon.",
      "pt-BR": "Cartões de desembarque distribuídos antes da descida. A tripulação explica os campos — você dirá essas mesmas palavras ao oficial em breve.",
    },
    objective: { en: "Learn form words reused at customs: surname, purpose, sign.", "pt-BR": "Aprender palavras do formulário reusadas na imigração: surname, purpose, sign." },
    environment: { mood: "neutral", baseNoise: 45 },
    npc: { name: { en: "Cabin Crew", "pt-BR": "Comissário(a)" }, initials: "CC" },
    drills: [
      { word: "surname", say: "SÂR-nêim", note: { en: "= family name.", "pt-BR": "= sobrenome." } },
      { word: "purpose", say: "PÂR-pâs", note: { en: "= reason for the trip.", "pt-BR": "= motivo da viagem." } },
    ],
    dialogueSteps: [
      { text: "Write your surname here, and your purpose of visit.", tr: { en: "Fill in family name + reason.", "pt-BR": "Preencha sobrenome + motivo." }, ear: { en: "<b>“PÂR-pâs”</b>", "pt-BR": "<b>“PÂR-pâs”</b>" }, audioPrompt: "Crew, pointing at the card: “Write your surname here, and your purpose of visit.”", basic: "Tourism.", fluent: "Tourism — got it." },
      { text: "Good. Sign at the bottom, please.", tr: { en: "Now sign at the bottom.", "pt-BR": "Agora assine embaixo." }, ear: { en: "<b>“sáin”</b> (silent G)", "pt-BR": "<b>“sáin”</b> (G mudo)" }, audioPrompt: "Crew, tapping the line: “Good. Sign at the bottom, please.”", basic: "Here?", fluent: "Right here?" },
    ],
  },

  /* ===================== 1.2 — HOSTILE CUSTOMS ===================== */
  {
    sequence: 6, blockId: 1, indexInBlock: 6, phase: 2, subBlock: "1.2", threshold: 80,
    sceneTitle: { en: "Passport Control", "pt-BR": "Controle de Passaporte" },
    contextDescription: {
      en: "A vast, echoing terminal. A cold queue snakes to glass booths. The officer doesn't smile, doesn't look up.",
      "pt-BR": "Um terminal vasto e ecoante. Uma fila fria serpenteia até cabines de vidro. O oficial não sorri, não levanta os olhos.",
    },
    objective: { en: "Survive the first authority encounter: purpose + duration.", "pt-BR": "Sobreviver ao primeiro encontro com a autoridade: motivo + duração." },
    environment: { mood: "hostile", baseNoise: 30 },
    npc: { name: { en: "Border Officer", "pt-BR": "Oficial de Fronteira" }, initials: "BO" },
    drills: [{ word: "I don't understand", say: "ai dôunt ãn-dâr-STÉND", note: { en: "Buys you time. Stress under-STAND.", "pt-BR": "Ganha tempo. Acentue under-STAND." } }],
    dialogueSteps: [
      { text: "Passport. Purpose of your visit?", tr: { en: "Show passport; why are you here?", "pt-BR": "Mostre o passaporte; por que veio?" }, ear: { en: "<b>“PÁS-port”</b>", "pt-BR": "<b>“PÁS-port”</b>" }, audioPrompt: "Officer, flat, not looking up: “Passport. Purpose of your visit?”", basic: "Tourism.", fluent: "Tourism — I'm here on holiday." },
      { text: "How long are you staying?", tr: { en: "How many days here?", "pt-BR": "Quantos dias aqui?" }, ear: { en: "<b>“rau lóng”</b>", "pt-BR": "<b>“rau lóng”</b>" }, audioPrompt: "Officer, clipped: “How long are you staying?”", basic: "One week.", fluent: "About a week." },
    ],
  },
  {
    sequence: 7, blockId: 1, indexInBlock: 7, phase: 2, subBlock: "1.2", threshold: 80,
    sceneTitle: { en: "Where Are You Staying?", "pt-BR": "Onde Vai Ficar?" },
    contextDescription: {
      en: "The booth beeps as your passport is scanned. The officer's eyes flick up — testing whether your story holds.",
      "pt-BR": "A cabine apita ao escanear o passaporte. Os olhos do oficial sobem — testando se sua história se sustenta.",
    },
    objective: { en: "State your accommodation clearly and without hesitation.", "pt-BR": "Dizer sua hospedagem com clareza e sem hesitar." },
    environment: { mood: "hostile", baseNoise: 28 },
    npc: { name: { en: "Border Officer", "pt-BR": "Oficial de Fronteira" }, initials: "BO" },
    drills: [{ word: "a hotel in Camden", say: "ã rô-TÉL in KÉM-dên", note: { en: "Have your address ready.", "pt-BR": "Tenha o endereço na ponta da língua." } }],
    dialogueSteps: [
      { text: "Where will you be staying?", tr: { en: "What's your address here?", "pt-BR": "Qual seu endereço aqui?" }, ear: { en: "<b>“STÊI-in”</b>", "pt-BR": "<b>“STÊI-in”</b>" }, audioPrompt: "Officer, reading the screen: “Where will you be staying?”", basic: "A hotel in Camden.", fluent: "At a hotel in Camden, near the market." },
      { text: "Alone, or with someone?", tr: { en: "Are you traveling alone?", "pt-BR": "Está viajando sozinho(a)?" }, ear: { en: "<b>“a-LÔUN”</b>", "pt-BR": "<b>“a-LÔUN”</b>" }, audioPrompt: "Officer, probing: “Alone, or with someone?”", basic: "Alone.", fluent: "Alone, just me." },
    ],
  },
  {
    sequence: 8, blockId: 1, indexInBlock: 8, phase: 2, subBlock: "1.2", threshold: 80,
    sceneTitle: { en: "Financial Questions", "pt-BR": "Perguntas Financeiras" },
    contextDescription: {
      en: "This is the part that decides things. The officer leans in: can you afford to be here, and will you leave?",
      "pt-BR": "Esta é a parte que decide tudo. O oficial se inclina: você pode se sustentar aqui e vai embora?",
    },
    objective: { en: "Prove funds and intent to leave: savings + return ticket.", "pt-BR": "Provar recursos e intenção de sair: economias + passagem de volta." },
    environment: { mood: "hostile", baseNoise: 32 },
    npc: { name: { en: "Border Officer", "pt-BR": "Oficial de Fronteira" }, initials: "BO" },
    drills: [{ word: "return ticket", say: "ri-TÂRN TÍ-kët", note: { en: "Proof you'll leave.", "pt-BR": "Prova de que você vai voltar." } }],
    dialogueSteps: [
      { text: "How will you support yourself here?", tr: { en: "How will you pay for things?", "pt-BR": "Como vai se manter aqui?" }, ear: { en: "<b>“su-PÓRT”</b>", "pt-BR": "<b>“su-PÓRT”</b>" }, audioPrompt: "Officer, hard: “How will you support yourself here?”", basic: "I have savings.", fluent: "I've saved enough, and I have my cards." },
      { text: "Do you have a return ticket?", tr: { en: "A ticket back home?", "pt-BR": "Passagem de volta?" }, ear: { en: "<b>“ri-TÂRN”</b>", "pt-BR": "<b>“ri-TÂRN”</b>" }, audioPrompt: "Officer, eyes up: “Do you have a return ticket?”", basic: "Yes, next Sunday.", fluent: "Yes — I fly back next Sunday." },
    ],
  },
  {
    sequence: 9, blockId: 1, indexInBlock: 9, phase: 2, subBlock: "1.2", threshold: 80,
    sceneTitle: { en: "Secondary Questioning", "pt-BR": "Questionamento Secundário" },
    contextDescription: {
      en: "Pulled aside. A harder voice, sharper questions about your life back home. Stay calm — contradictions sink you.",
      "pt-BR": "Levado para o lado. Voz mais dura, perguntas afiadas sobre sua vida no seu país. Mantenha a calma — contradições afundam você.",
    },
    objective: { en: "Answer about your job/life consistently and briefly.", "pt-BR": "Responder sobre trabalho/vida de forma consistente e breve." },
    environment: { mood: "hostile", baseNoise: 30 },
    npc: { name: { en: "Senior Officer", "pt-BR": "Oficial Sênior" }, initials: "SO" },
    drills: [{ word: "I'm a designer", say: "aim a di-ZÁI-nâr", note: { en: "Say your job simply.", "pt-BR": "Diga sua profissão de forma simples." } }],
    dialogueSteps: [
      { text: "What do you do for a living back home?", tr: { en: "What's your job back home?", "pt-BR": "Qual seu trabalho no seu país?" }, ear: { en: "<b>“lí-ving”</b>", "pt-BR": "<b>“lí-ving”</b>" }, audioPrompt: "Senior officer, even: “What do you do for a living back home?”", basic: "I'm a designer.", fluent: "I'm a designer — I work at a studio." },
      { text: "And you'll go back to that job?", tr: { en: "You'll return to your job?", "pt-BR": "Você vai voltar para esse emprego?" }, ear: { en: "<b>“gôu bék”</b>", "pt-BR": "<b>“gôu bék”</b>" }, audioPrompt: "Senior officer, testing: “And you'll go back to that job?”", basic: "Yes.", fluent: "Yes, of course." },
    ],
  },
  {
    sequence: 10, blockId: 1, indexInBlock: 10, phase: 2, subBlock: "1.2", threshold: 80,
    sceneTitle: { en: "The Stamp — Decision", "pt-BR": "O Carimbo — A Decisão" },
    contextDescription: {
      en: "A long pause. The officer studies you, then reaches for the stamp — or doesn't. Your last words decide it.",
      "pt-BR": "Uma longa pausa. O oficial te estuda, então pega o carimbo — ou não. Suas últimas palavras decidem.",
    },
    objective: { en: "Close confidently and read the outcome.", "pt-BR": "Encerrar com confiança e entender o resultado." },
    environment: { mood: "hostile", baseNoise: 28 },
    npc: { name: { en: "Border Officer", "pt-BR": "Oficial de Fronteira" }, initials: "BO" },
    drills: [{ word: "thank you", say: "TÉNK iu", note: { en: "Close politely.", "pt-BR": "Encerre com educação." } }],
    dialogueSteps: [
      { text: "Enjoy your stay. Next, please.", tr: { en: "You're cleared — move on.", "pt-BR": "Você foi liberado(a) — siga." }, ear: { en: "<b>“en-DJÓI”</b>", "pt-BR": "<b>“en-DJÓI”</b>" }, audioPrompt: "Officer, stamping the passport: “Enjoy your stay. Next, please.”", basic: "Thank you.", fluent: "Thank you — have a good day." },
    ],
  },

  /* ===================== 1.3 — BAGGAGE CHAOS ===================== */
  {
    sequence: 11, blockId: 1, indexInBlock: 11, phase: 2, subBlock: "1.3", threshold: 80,
    sceneTitle: { en: "Finding the Belt", "pt-BR": "Achando a Esteira" },
    contextDescription: {
      en: "Carousels groan and circle. Screens flicker flight numbers. You must find the right belt fast.",
      "pt-BR": "Esteiras rangem e giram. Telas piscam números de voo. Você precisa achar a esteira certa rápido.",
    },
    objective: { en: "Ask which belt serves your flight.", "pt-BR": "Perguntar qual esteira atende seu voo." },
    environment: { mood: "neutral", baseNoise: 46 },
    npc: { name: { en: "Ground Staff", "pt-BR": "Funcionário(a) de Solo" }, initials: "GS" },
    drills: [{ word: "which belt?", say: "UÍTCH bélt", note: { en: "belt = baggage carousel.", "pt-BR": "belt = esteira de bagagem." } }],
    dialogueSteps: [
      { text: "Flight BA-246? Belt 5, over there.", tr: { en: "Your bags are on belt 5.", "pt-BR": "Suas malas estão na esteira 5." }, ear: { en: "<b>“bélt fáiv”</b>", "pt-BR": "<b>“bélt fáiv”</b>" }, audioPrompt: "Staff, pointing across the hall: “Flight BA-246? Belt 5, over there.”", basic: "Thank you.", fluent: "Thanks — belt 5." },
    ],
  },
  {
    sequence: 12, blockId: 1, indexInBlock: 12, phase: 2, subBlock: "1.3", threshold: 80,
    sceneTitle: { en: "The Missing Bag", "pt-BR": "A Mala Sumida" },
    contextDescription: {
      en: "Bags come and go — but not yours. The belt slows, then stops. Panic rises. You must report it clearly.",
      "pt-BR": "Malas vêm e vão — menos a sua. A esteira desacelera e para. O pânico sobe. Você precisa relatar com clareza.",
    },
    objective: { en: "Report that your bag didn't arrive.", "pt-BR": "Relatar que sua mala não chegou." },
    environment: { mood: "neutral", baseNoise: 44 },
    npc: { name: { en: "Ground Staff", "pt-BR": "Funcionário(a) de Solo" }, initials: "GS" },
    drills: [{ word: "I can't find it", say: "ai ként FÁIND it", note: { en: "Report something missing.", "pt-BR": "Relatar algo sumido." } }],
    dialogueSteps: [
      { text: "The belt's empty now. Is your bag here?", tr: { en: "Did your bag arrive?", "pt-BR": "Sua mala chegou?" }, ear: { en: "<b>“ÉM-ti”</b>", "pt-BR": "<b>“ÉM-ti”</b>" }, audioPrompt: "Staff, checking the belt: “The belt's empty now. Is your bag here?”", basic: "No. I can't find it.", fluent: "No — my bag isn't here." },
    ],
  },
  {
    sequence: 13, blockId: 1, indexInBlock: 13, phase: 2, subBlock: "1.3", threshold: 80,
    sceneTitle: { en: "Describing Your Bag", "pt-BR": "Descrevendo a Mala" },
    contextDescription: {
      en: "At the desk, an agent opens a form. They need details — colour, size, anything that marks it out.",
      "pt-BR": "No balcão, um agente abre um formulário. Precisam de detalhes — cor, tamanho, algo que a destaque.",
    },
    objective: { en: "Describe a bag: colour, size, distinguishing marks.", "pt-BR": "Descrever a mala: cor, tamanho, marcas." },
    environment: { mood: "neutral", baseNoise: 42 },
    npc: { name: { en: "Lost Luggage Agent", "pt-BR": "Agente de Bagagem" }, initials: "LA" },
    drills: [
      { word: "black, medium", say: "BLÉK, MÍ-dium", note: { en: "Colour + size.", "pt-BR": "Cor + tamanho." } },
      { word: "a red ribbon", say: "a RÉD RÍ-bãn", note: { en: "A distinguishing mark.", "pt-BR": "Uma marca distintiva." } },
    ],
    dialogueSteps: [
      { text: "Describe it for me. Colour and size?", tr: { en: "What does it look like?", "pt-BR": "Como ela é?" }, ear: { en: "<b>“KÂ-lâr”</b>", "pt-BR": "<b>“KÂ-lâr”</b>" }, audioPrompt: "Agent, pen ready: “Describe it for me. Colour and size?”", basic: "Black, medium.", fluent: "It's black, medium-sized, with a red ribbon." },
    ],
  },
  {
    sequence: 14, blockId: 1, indexInBlock: 14, phase: 2, subBlock: "1.3", threshold: 80,
    sceneTitle: { en: "The Claim", "pt-BR": "O Registro" },
    contextDescription: {
      en: "Paperwork. A reference number. A promise that it 'should' arrive tomorrow. You need to confirm how they'll reach you.",
      "pt-BR": "Papelada. Um número de referência. A promessa de que 'deve' chegar amanhã. Você precisa confirmar como vão te contatar.",
    },
    objective: { en: "Give contact info and confirm next steps.", "pt-BR": "Dar contato e confirmar os próximos passos." },
    environment: { mood: "neutral", baseNoise: 40 },
    npc: { name: { en: "Lost Luggage Agent", "pt-BR": "Agente de Bagagem" }, initials: "LA" },
    drills: [{ word: "my phone number", say: "mai FÔUN NÂM-bâr", note: { en: "How they'll contact you.", "pt-BR": "Como vão te contatar." } }],
    dialogueSteps: [
      { text: "We'll deliver it. What's your phone number?", tr: { en: "They need your phone number.", "pt-BR": "Precisam do seu telefone." }, ear: { en: "<b>“NÂM-bâr”</b>", "pt-BR": "<b>“NÂM-bâr”</b>" }, audioPrompt: "Agent, typing: “We'll deliver it. What's your phone number?”", basic: "One moment.", fluent: "Sure — let me give it to you." },
      { text: "Here's your reference number. Keep it.", tr: { en: "Keep this claim number.", "pt-BR": "Guarde este número de referência." }, ear: { en: "<b>“RÉ-frâns”</b>", "pt-BR": "<b>“RÉ-frâns”</b>" }, audioPrompt: "Agent, handing a slip: “Here's your reference number. Keep it.”", basic: "Thank you.", fluent: "Thank you, I'll keep it safe." },
    ],
  },
  {
    sequence: 15, blockId: 1, indexInBlock: 15, phase: 2, subBlock: "1.3", threshold: 80,
    sceneTitle: { en: "Finding the Toilet", "pt-BR": "Achando o Banheiro" },
    contextDescription: {
      en: "After the stress, an urgent, very human need. You stop a passing cleaner — fast.",
      "pt-BR": "Depois do estresse, uma necessidade urgente e muito humana. Você para um faxineiro que passa — rápido.",
    },
    objective: { en: "Ask for the toilet and understand directions.", "pt-BR": "Perguntar pelo banheiro e entender a direção." },
    environment: { mood: "neutral", baseNoise: 48 },
    npc: { name: { en: "Cleaner", "pt-BR": "Faxineiro(a)" }, initials: "CL" },
    drills: [{ word: "where is the toilet?", say: "UÉR iz dâ TÓI-lët", note: { en: "UK: toilet, not bathroom.", "pt-BR": "Reino Unido: toilet, não bathroom." } }],
    dialogueSteps: [
      { text: "Toilets? Straight ahead, on the right.", tr: { en: "Toilets are ahead, on the right.", "pt-BR": "Os banheiros são em frente, à direita." }, ear: { en: "<b>“strêit a-RÉD”</b>", "pt-BR": "<b>“strêit a-RÉD”</b>" }, audioPrompt: "Cleaner, pointing: “Toilets? Straight ahead, on the right.”", basic: "Thank you.", fluent: "Thanks a lot." },
    ],
  },

  /* ===================== 1.4 — CONNECTION (UK SIM) ===================== */
  {
    sequence: 16, blockId: 1, indexInBlock: 16, phase: 3, subBlock: "1.4", threshold: 80,
    sceneTitle: { en: "Finding a SIM Shop", "pt-BR": "Achando uma Loja de SIM" },
    contextDescription: {
      en: "Arrivals hall: bright kiosks, rolling suitcases, announcements overlapping. You need a phone connection before anything else.",
      "pt-BR": "Saguão de chegadas: quiosques iluminados, malas rolando, avisos sobrepostos. Você precisa de conexão antes de tudo.",
    },
    objective: { en: "Ask where to buy a SIM card.", "pt-BR": "Perguntar onde comprar um chip (SIM)." },
    environment: { mood: "neutral", baseNoise: 50 },
    npc: { name: { en: "Info Desk", "pt-BR": "Balcão de Informações" }, initials: "ID" },
    drills: [{ word: "a SIM card", say: "a SÍM kard", note: { en: "The phone chip.", "pt-BR": "O chip do celular." } }],
    dialogueSteps: [
      { text: "A SIM card? The shop's just past Costa, on the left.", tr: { en: "The shop is past the café, on the left.", "pt-BR": "A loja fica depois do café, à esquerda." }, ear: { en: "<b>“past KÓS-ta”</b>", "pt-BR": "<b>“pést KÓS-ta”</b>" }, audioPrompt: "Info desk, pointing: “A SIM card? The shop's just past Costa, on the left.”", basic: "Thank you.", fluent: "Great, thank you." },
    ],
  },
  {
    sequence: 17, blockId: 1, indexInBlock: 17, phase: 3, subBlock: "1.4", threshold: 80,
    sceneTitle: { en: "Buying a SIM", "pt-BR": "Comprando o Chip" },
    contextDescription: {
      en: "A tiny shop, a bored clerk, a wall of plans. You need a tourist SIM — say it simply.",
      "pt-BR": "Loja pequena, atendente entediado, uma parede de planos. Você precisa de um chip de turista — diga de forma simples.",
    },
    objective: { en: "Ask for a tourist SIM clearly.", "pt-BR": "Pedir um chip de turista com clareza." },
    environment: { mood: "neutral", baseNoise: 48 },
    npc: { name: { en: "Shop Clerk", "pt-BR": "Atendente" }, initials: "SC" },
    drills: [{ word: "for a tourist", say: "for a TÚR-ist", note: { en: "Short-term visitor plan.", "pt-BR": "Plano de visitante de curto prazo." } }],
    dialogueSteps: [
      { text: "Hiya. What are you after?", tr: { en: "Hello — what do you want?", "pt-BR": "Olá — o que você procura?" }, ear: { en: "<b>“RÁI-ya”</b> = casual hello", "pt-BR": "<b>“RÁI-ya”</b> = oi informal" }, audioPrompt: "Clerk, casual: “Hiya. What are you after?”", basic: "A SIM card, please.", fluent: "A tourist SIM card, please." },
      { text: "Sure. How long are you here for?", tr: { en: "For how long?", "pt-BR": "Por quanto tempo?" }, ear: { en: "<b>“rir for”</b>", "pt-BR": "<b>“rir for”</b>" }, audioPrompt: "Clerk: “Sure. How long are you here for?”", basic: "One week.", fluent: "About a week." },
    ],
  },
  {
    sequence: 18, blockId: 1, indexInBlock: 18, phase: 3, subBlock: "1.4", threshold: 80,
    sceneTitle: { en: "Choosing a Data Plan", "pt-BR": "Escolhendo o Plano de Dados" },
    contextDescription: {
      en: "Numbers fly: gigabytes, pounds, validity. You must compare and pick — and confirm the price.",
      "pt-BR": "Números voam: gigabytes, libras, validade. Você precisa comparar e escolher — e confirmar o preço.",
    },
    objective: { en: "Compare data, confirm price, decide.", "pt-BR": "Comparar dados, confirmar preço, decidir." },
    environment: { mood: "neutral", baseNoise: 46 },
    npc: { name: { en: "Shop Clerk", "pt-BR": "Atendente" }, initials: "SC" },
    drills: [{ word: "how much?", say: "rau MÂTCH", note: { en: "Ask the price.", "pt-BR": "Pergunte o preço." } }],
    dialogueSteps: [
      { text: "Ten gigs is fifteen quid. Twenty is twenty.", tr: { en: "10GB = £15, 20GB = £20. ('quid' = pounds)", "pt-BR": "10GB = £15, 20GB = £20. ('quid' = libras)" }, ear: { en: "<b>“kwid”</b> = pounds (slang)", "pt-BR": "<b>“kuíd”</b> = libras (gíria)" }, audioPrompt: "Clerk, fast: “Ten gigs is fifteen quid. Twenty is twenty.”", basic: "The ten, please.", fluent: "I'll take the ten gigs, please." },
      { text: "Lovely. That's fifteen pounds.", tr: { en: "Okay — £15.", "pt-BR": "Ok — £15." }, ear: { en: "<b>“LÂV-li”</b> = great (UK)", "pt-BR": "<b>“LÂV-li”</b> = ótimo (UK)" }, audioPrompt: "Clerk, tapping the till: “Lovely. That's fifteen pounds.”", basic: "Here.", fluent: "Here you go." },
    ],
  },
  {
    sequence: 19, blockId: 1, indexInBlock: 19, phase: 3, subBlock: "1.4", threshold: 80,
    sceneTitle: { en: "It's Not Working", "pt-BR": "Não Está Funcionando" },
    contextDescription: {
      en: "Outside the shop, the SIM is in — but no signal, no data. Frustration mounts. You go back in.",
      "pt-BR": "Fora da loja, o chip está dentro — mas sem sinal, sem dados. A frustração cresce. Você volta lá dentro.",
    },
    objective: { en: "Explain a problem: no signal / not activated.", "pt-BR": "Explicar um problema: sem sinal / não ativado." },
    environment: { mood: "hostile", baseNoise: 50 },
    npc: { name: { en: "Shop Clerk", "pt-BR": "Atendente" }, initials: "SC" },
    drills: [{ word: "it's not working", say: "its NÓT UÂR-kin", note: { en: "Report a fault.", "pt-BR": "Relatar um defeito." } }],
    dialogueSteps: [
      { text: "Back already? What's wrong?", tr: { en: "What's the problem?", "pt-BR": "Qual é o problema?" }, ear: { en: "<b>“uâts róng”</b>", "pt-BR": "<b>“uâts róng”</b>" }, audioPrompt: "Clerk, surprised: “Back already? What's wrong?”", basic: "It's not working.", fluent: "It's not working — there's no signal." },
      { text: "No signal at all? Let me see it.", tr: { en: "Let me check the phone.", "pt-BR": "Deixa eu ver o celular." }, ear: { en: "<b>“SÍG-nâl”</b>", "pt-BR": "<b>“SÍG-nâl”</b>" }, audioPrompt: "Clerk, holding out a hand: “No signal at all? Let me see it.”", basic: "Here.", fluent: "Sure — here it is." },
    ],
  },
  {
    sequence: 20, blockId: 1, indexInBlock: 20, phase: 3, subBlock: "1.4", threshold: 80,
    sceneTitle: { en: "Demanding a Fix", "pt-BR": "Exigindo Solução" },
    contextDescription: {
      en: "The clerk shrugs: 'should activate in an hour.' Not good enough. You hold your ground — politely, firmly.",
      "pt-BR": "O atendente dá de ombros: 'deve ativar em uma hora.' Não basta. Você se impõe — com educação e firmeza.",
    },
    objective: { en: "Insist on activation now, or a refund.", "pt-BR": "Insistir na ativação agora, ou reembolso." },
    environment: { mood: "hostile", baseNoise: 52 },
    npc: { name: { en: "Shop Clerk", "pt-BR": "Atendente" }, initials: "SC" },
    drills: [{ word: "activate it now", say: "ÉK-ti-vêit it náu", note: { en: "Demand action.", "pt-BR": "Exigir ação." } }],
    dialogueSteps: [
      { text: "It should activate within the hour.", tr: { en: "It'll work in an hour (he says).", "pt-BR": "Vai funcionar em uma hora (diz ele)." }, ear: { en: "<b>“ÉK-ti-vêit”</b>", "pt-BR": "<b>“ÉK-ti-vêit”</b>" }, audioPrompt: "Clerk, dismissive: “It should activate within the hour.”", basic: "Activate it now, please.", fluent: "Please activate it now, or refund me." },
      { text: "Alright, alright. Give me a minute.", tr: { en: "Okay — he'll do it now.", "pt-BR": "Ok — ele vai fazer agora." }, ear: { en: "<b>“ã MÍ-nit”</b>", "pt-BR": "<b>“ã MÍ-nit”</b>" }, audioPrompt: "Clerk, relenting: “Alright, alright. Give me a minute.”", basic: "Thank you.", fluent: "Thank you, I appreciate it." },
    ],
  },

  /* ===================== 1.5 — THE ESCAPE & REWARD ===================== */
  {
    sequence: 21, blockId: 1, indexInBlock: 21, phase: 3, subBlock: "1.5", threshold: 80,
    sceneTitle: { en: "Finding the Tube", "pt-BR": "Achando o Metrô" },
    contextDescription: {
      en: "Down toward the Underground: tiled tunnels, rushing commuters, a warm gust from the trains and a wall of signs.",
      "pt-BR": "Descendo para o Underground: túneis de azulejo, passageiros apressados, uma rajada quente dos trens e uma parede de placas.",
    },
    objective: { en: "Ask the way to the Underground.", "pt-BR": "Perguntar o caminho para o metrô." },
    environment: { mood: "neutral", baseNoise: 58 },
    npc: { name: { en: "Commuter", "pt-BR": "Passageiro(a)" }, initials: "PC" },
    drills: [{ word: "the Underground", say: "di ÂN-dâr-graund", note: { en: "= the Tube / metro.", "pt-BR": "= o metrô de Londres." } }],
    dialogueSteps: [
      { text: "The Tube? Follow the blue signs, down the escalator.", tr: { en: "Follow blue signs, down the escalator.", "pt-BR": "Siga as placas azuis, desça a escada rolante." }, ear: { en: "<b>“tiúb”</b>", "pt-BR": "<b>“tiúb”</b>" }, audioPrompt: "Commuter, hurried: “The Tube? Follow the blue signs, down the escalator.”", basic: "Thank you.", fluent: "Thanks — blue signs, got it." },
    ],
  },
  {
    sequence: 22, blockId: 1, indexInBlock: 22, phase: 3, subBlock: "1.5", threshold: 80,
    sceneTitle: { en: "Buying an Oyster Card", "pt-BR": "Comprando o Oyster Card" },
    contextDescription: {
      en: "A staffed ticket window beside the gates. You need an Oyster card and some credit to get into town.",
      "pt-BR": "Uma bilheteria ao lado das catracas. Você precisa de um Oyster card e crédito para chegar à cidade.",
    },
    objective: { en: "Buy an Oyster card and top it up.", "pt-BR": "Comprar um Oyster card e colocar crédito." },
    environment: { mood: "neutral", baseNoise: 54 },
    npc: { name: { en: "Station Staff", "pt-BR": "Funcionário(a) da Estação" }, initials: "ST" },
    drills: [
      { word: "an Oyster card", say: "ãn ÓIS-târ kard", note: { en: "London travel card.", "pt-BR": "Cartão de transporte de Londres." } },
      { word: "top up", say: "TÓP âp", note: { en: "= add credit.", "pt-BR": "= adicionar crédito." } },
    ],
    dialogueSteps: [
      { text: "Next! What can I do for you?", tr: { en: "How can I help?", "pt-BR": "Como posso ajudar?" }, ear: { en: "<b>“nékst”</b>", "pt-BR": "<b>“nékst”</b>" }, audioPrompt: "Staff, through glass: “Next! What can I do for you?”", basic: "An Oyster card, please.", fluent: "An Oyster card, and top up ten pounds, please." },
      { text: "Ten pounds on it. Anything else?", tr: { en: "£10 added — anything more?", "pt-BR": "£10 adicionados — mais algo?" }, ear: { en: "<b>“É-ni-thin éls”</b>", "pt-BR": "<b>“É-ni-thin éls”</b>" }, audioPrompt: "Staff, sliding the card: “Ten pounds on it. Anything else?”", basic: "No, thank you.", fluent: "No, that's all, thanks." },
    ],
  },
  {
    sequence: 23, blockId: 1, indexInBlock: 23, phase: 3, subBlock: "1.5", threshold: 80,
    sceneTitle: { en: "The Broken Machine", "pt-BR": "A Máquina Quebrada" },
    contextDescription: {
      en: "At the gate, your card won't tap. The machine flashes red, beeps, and a queue builds behind you, sighing.",
      "pt-BR": "Na catraca, seu cartão não passa. A máquina pisca vermelho, apita, e uma fila se forma atrás de você, suspirando.",
    },
    objective: { en: "Report a broken machine and ask for help.", "pt-BR": "Relatar uma máquina quebrada e pedir ajuda." },
    environment: { mood: "hostile", baseNoise: 56 },
    npc: { name: { en: "Station Staff", "pt-BR": "Funcionário(a) da Estação" }, initials: "ST" },
    drills: [{ word: "it won't work", say: "it UÔUNT UÂRK", note: { en: "Report a fault, fast.", "pt-BR": "Relatar defeito, rápido." } }],
    dialogueSteps: [
      { text: "Tap again. Still red? Stand aside, please.", tr: { en: "Try again; if it fails, step aside.", "pt-BR": "Tente de novo; se falhar, saia da frente." }, ear: { en: "<b>“tép a-GÉN”</b>", "pt-BR": "<b>“tép a-GÉN”</b>" }, audioPrompt: "Staff, over the queue noise: “Tap again. Still red? Stand aside, please.”", basic: "It won't work.", fluent: "It won't work — the machine's broken." },
      { text: "Okay, I'll let you through this gate.", tr: { en: "He'll open the gate for you.", "pt-BR": "Ele vai te liberar pela catraca." }, ear: { en: "<b>“let iu thrú”</b>", "pt-BR": "<b>“let iu thrú”</b>" }, audioPrompt: "Staff, opening the side gate: “Okay, I'll let you through this gate.”", basic: "Thank you!", fluent: "Thank you so much!" },
    ],
  },
  {
    sequence: 24, blockId: 1, indexInBlock: 24, phase: 3, subBlock: "1.5", threshold: 80,
    sceneTitle: { en: "Mind the Gap", "pt-BR": "Cuidado com o Vão" },
    contextDescription: {
      en: "On the platform: a roar of wind, screeching brakes, the famous announcement, and doors that close in seconds.",
      "pt-BR": "Na plataforma: um rugido de vento, freios guinchando, o famoso aviso, e portas que fecham em segundos.",
    },
    objective: { en: "Confirm the right line/direction and board in time.", "pt-BR": "Confirmar a linha/direção certa e embarcar a tempo." },
    environment: { mood: "neutral", baseNoise: 64 },
    npc: { name: { en: "Commuter", "pt-BR": "Passageiro(a)" }, initials: "PC" },
    drills: [{ word: "is this the right train?", say: "iz dis dâ RÁIT trêin", note: { en: "Confirm before boarding.", "pt-BR": "Confirme antes de embarcar." } }],
    dialogueSteps: [
      { text: "Central line to the city? Yeah, this one. Quick!", tr: { en: "Yes, this is your train — hurry!", "pt-BR": "Sim, é o seu trem — rápido!" }, ear: { en: "<b>“iéa, dis uân”</b>", "pt-BR": "<b>“iéa, dis uân”</b>" }, audioPrompt: "Commuter, shouting over the train: “Central line to the city? Yeah, this one. Quick!”", basic: "Thank you!", fluent: "Thanks — just in time!" },
    ],
  },
  {
    sequence: 25, blockId: 1, indexInBlock: 25, phase: 3, subBlock: "1.5", threshold: 75,
    kind: "bonus",
    triggerSelfieShare: true,
    selfieOverlay: { eyebrow: "Day One Survivor", tagline: "Tourist — I Survived London's First Day", shareText: "I landed in London knowing nothing — hostile customs, an impatient cabbie, the lot — and I made it to a coffee by the Thames. Day one: survived. 🇬🇧☕ #LinguoBound" },
    sceneTitle: { en: "Bonus — Coffee by the River", "pt-BR": "Bônus — Café à Beira do Rio" },
    contextDescription: {
      en: "You made it. The chaos fades. Sunlight on the Thames, Big Ben behind you, a quiet café. Order a coffee and breathe — you survived London's first day.",
      "pt-BR": "Você conseguiu. O caos se dissolve. Sol no Tâmisa, o Big Ben atrás de você, um café tranquilo. Peça um café e respire — você sobreviveu ao primeiro dia em Londres.",
    },
    objective: { en: "A relaxed reward: order a coffee and enjoy the victory.", "pt-BR": "Uma recompensa tranquila: pedir um café e celebrar a vitória." },
    environment: { mood: "pleased", baseNoise: 30 },
    npc: { name: { en: "Barista", "pt-BR": "Barista" }, initials: "BA" },
    drills: [{ word: "a flat white, please", say: "a FLÉT UÁIT, plíz", note: { en: "A classic London coffee.", "pt-BR": "Um café clássico de Londres." } }],
    dialogueSteps: [
      { text: "Lovely day, isn't it? What can I get you?", tr: { en: "Nice day — what would you like?", "pt-BR": "Belo dia — o que você quer?" }, ear: { en: "<b>“LÂV-li dêi”</b>", "pt-BR": "<b>“LÂV-li dêi”</b>" }, audioPrompt: "Barista, warm and relaxed: “Lovely day, isn't it? What can I get you?”", basic: "A coffee, please.", fluent: "A flat white, please." },
      { text: "Coming right up. First time in London?", tr: { en: "Sure — first time here?", "pt-BR": "Claro — primeira vez aqui?" }, ear: { en: "<b>“fârst táim”</b>", "pt-BR": "<b>“fârst táim”</b>" }, audioPrompt: "Barista, making the coffee: “Coming right up. First time in London?”", basic: "Yes. I made it.", fluent: "Yes — and I made it through the airport!" },
    ],
  },
];

// Lookup by sequence (number or string id).
export const BLOCK0_BY_SEQUENCE = BLOCK0_MODULES.reduce((acc, m) => {
  acc[m.sequence] = m;
  return acc;
}, {});
