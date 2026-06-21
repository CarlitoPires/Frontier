/* ============================================================
 *  LinguoBound — City 01: London · BLOCK 02 (Modules 26–50)
 *  "Establishing the Base" — 5 sub-blocks:
 *    2.1 Hotel Check-in     (26–30)  lost reservation
 *    2.2 Supermarket        (31–35)  self-checkout errors
 *    2.3 Street in the Rain (36–40)  navigation under heavy rain
 *    2.4 Pharmacy / Medical (41–45)  symptoms, the "chemist", NHS
 *    2.5 Bank / Currency     (46–50)  exchange, account catch-22, BONUS
 *
 *  Creative layer: real British slang (cheers, quid, brolly, knackered,
 *  the loo, chemist, "you alright?"), cultural-misunderstanding beats
 *  (greeting vs health question, ground/first floor, bag charge, tipping),
 *  and layered ambience (environment.rain triggers a rain overlay).
 *  Module 50 = unique "London Resident" selfie reward.
 * ============================================================ */

export const BLOCK02_MODULES = [
  /* ===================== 2.1 — HOTEL CHECK-IN ===================== */
  {
    sequence: 26, blockId: 2, indexInBlock: 1, phase: 3, subBlock: "2.1", threshold: 80,
    sceneTitle: { en: "Reception — “You Alright?”", "pt-BR": "Recepção — “You Alright?”" },
    contextDescription: {
      en: "A warm lobby, soft jazz, rain tapping the glass behind you. The receptionist beams: “You alright?” — and you freeze, thinking something's wrong.",
      "pt-BR": "Um lobby quente, jazz suave, chuva batendo no vidro atrás de você. A recepcionista sorri: “You alright?” — e você congela, achando que algo está errado.",
    },
    objective: { en: "Decode the British greeting 'You alright?' (= hello, not 'are you sick?') and check in.", "pt-BR": "Decodificar o cumprimento britânico 'You alright?' (= olá, não 'você está doente?') e fazer o check-in." },
    culturalNote: { en: "“You alright?” is just “hi / how's it going”. Reply “Yeah, you?” — never explain your health.", "pt-BR": "“You alright?” é só “oi / tudo bem?”. Responda “Yeah, you?” — nunca explique sua saúde." },
    environment: { mood: "pleased", baseNoise: 26 },
    npc: { name: { en: "Receptionist", "pt-BR": "Recepcionista" }, initials: "RC" },
    drills: [{ word: "Yeah, you?", say: "IÉA, iú?", note: { en: "The correct reply to 'You alright?'", "pt-BR": "A resposta certa para 'You alright?'" } }],
    dialogueSteps: [
      { text: "You alright? Checking in?", tr: { en: "Hello! Are you checking in?", "pt-BR": "Olá! Vai fazer check-in?" }, ear: { en: "<b>“iú ol-RÁIT”</b> = hello", "pt-BR": "<b>“iú ol-RÁIT”</b> = olá" }, audioPrompt: "Receptionist, cheery: “You alright? Checking in?”", basic: "Yeah, you? Checking in.", fluent: "Yeah, you? Yes, I'm checking in." },
      { text: "Lovely. Name, please?", tr: { en: "Great — your name?", "pt-BR": "Ótimo — seu nome?" }, ear: { en: "<b>“LÂV-li”</b> = great", "pt-BR": "<b>“LÂV-li”</b> = ótimo" }, audioPrompt: "Receptionist: “Lovely. Name, please?”", basic: "Pires.", fluent: "It's under Pires." },
    ],
  },
  {
    sequence: 27, blockId: 2, indexInBlock: 2, phase: 3, subBlock: "2.1", threshold: 80,
    sceneTitle: { en: "The Lost Reservation", "pt-BR": "A Reserva Sumida" },
    contextDescription: {
      en: "The smile fades. She types, frowns, types again. “I'm not seeing a booking under that name…” The queue behind you grows.",
      "pt-BR": "O sorriso some. Ela digita, franze a testa, digita de novo. “Não estou vendo uma reserva nesse nome…” A fila atrás de você cresce.",
    },
    objective: { en: "Insist a booking exists; offer proof.", "pt-BR": "Insistir que a reserva existe; oferecer comprovante." },
    environment: { mood: "hostile", baseNoise: 28 },
    npc: { name: { en: "Receptionist", "pt-BR": "Recepcionista" }, initials: "RC" },
    drills: [{ word: "I have a confirmation", say: "ai rév a con-fâr-MÊI-shân", note: { en: "Your proof of booking.", "pt-BR": "Seu comprovante de reserva." } }],
    dialogueSteps: [
      { text: "I'm not seeing a booking under that name.", tr: { en: "I can't find your reservation.", "pt-BR": "Não acho sua reserva." }, ear: { en: "<b>“BÚ-king”</b> = reserva", "pt-BR": "<b>“BÚ-king”</b> = reserva" }, audioPrompt: "Receptionist, frowning at the screen: “I'm not seeing a booking under that name.”", basic: "I have a confirmation.", fluent: "I have a confirmation email — here." },
      { text: "Could you spell the surname for me?", tr: { en: "Spell your last name.", "pt-BR": "Soletre seu sobrenome." }, ear: { en: "<b>“spél”</b> = soletrar", "pt-BR": "<b>“spél”</b> = soletrar" }, audioPrompt: "Receptionist: “Could you spell the surname for me?”", basic: "P-I-R-E-S.", fluent: "Sure — P, I, R, E, S." },
    ],
  },
  {
    sequence: 28, blockId: 2, indexInBlock: 3, phase: 3, subBlock: "2.1", threshold: 80,
    sceneTitle: { en: "Sorting It Out", "pt-BR": "Resolvendo" },
    contextDescription: {
      en: "She finds it — misspelled in the system. Relief. Now the formalities: card for the deposit, ID, a scribbled signature.",
      "pt-BR": "Ela acha — escrito errado no sistema. Alívio. Agora a burocracia: cartão para o depósito, documento, uma assinatura rabiscada.",
    },
    objective: { en: "Hand over card + ID and confirm the deposit.", "pt-BR": "Entregar cartão + documento e confirmar o depósito." },
    environment: { mood: "neutral", baseNoise: 26 },
    npc: { name: { en: "Receptionist", "pt-BR": "Recepcionista" }, initials: "RC" },
    drills: [{ word: "a deposit", say: "a di-PÓ-zit", note: { en: "A hold on your card.", "pt-BR": "Uma reserva de valor no cartão." } }],
    dialogueSteps: [
      { text: "Found it! Just need a card for the deposit.", tr: { en: "Found it — card for the deposit?", "pt-BR": "Achei — cartão para o depósito?" }, ear: { en: "<b>“di-PÓ-zit”</b>", "pt-BR": "<b>“di-PÓ-zit”</b>" }, audioPrompt: "Receptionist, relieved: “Found it! Just need a card for the deposit.”", basic: "Here you are.", fluent: "Of course — here's my card." },
      { text: "Pop your signature here, please.", tr: { en: "Sign here ('pop' = just put).", "pt-BR": "Assine aqui ('pop' = só coloque)." }, ear: { en: "<b>“póp”</b> = just put", "pt-BR": "<b>“póp”</b> = só coloque" }, audioPrompt: "Receptionist, sliding a tablet: “Pop your signature here, please.”", basic: "Here?", fluent: "Right here?" },
    ],
  },
  {
    sequence: 29, blockId: 2, indexInBlock: 4, phase: 3, subBlock: "2.1", threshold: 80,
    sceneTitle: { en: "First Floor ≠ Ground Floor", "pt-BR": "First Floor ≠ Térreo" },
    contextDescription: {
      en: "“Room 204, first floor. The lift's on your right.” You head up one flight — and it's wrong. In the UK, the 'first floor' is one above the ground floor.",
      "pt-BR": "“Quarto 204, first floor. O lift fica à direita.” Você sobe um lance — e está errado. No Reino Unido, o 'first floor' é um andar acima do térreo.",
    },
    objective: { en: "Understand UK floors (ground → first → second) and 'lift'.", "pt-BR": "Entender os andares no Reino Unido (térreo → first → second) e 'lift'." },
    culturalNote: { en: "UK: ground floor = térreo, first floor = 1º andar acima. 'Lift' = elevator.", "pt-BR": "Reino Unido: ground floor = térreo, first floor = 1º andar acima. 'Lift' = elevador." },
    environment: { mood: "neutral", baseNoise: 24 },
    npc: { name: { en: "Receptionist", "pt-BR": "Recepcionista" }, initials: "RC" },
    drills: [{ word: "the lift", say: "dâ LÍFT", note: { en: "= the elevator.", "pt-BR": "= o elevador." } }],
    dialogueSteps: [
      { text: "Room 204 — first floor. The lift's on your right.", tr: { en: "Floor 1 (above ground); elevator on the right.", "pt-BR": "Andar 1 (acima do térreo); elevador à direita." }, ear: { en: "<b>“fârst flór”</b>", "pt-BR": "<b>“fârst flór”</b>" }, audioPrompt: "Receptionist, pointing: “Room 204 — first floor. The lift's on your right.”", basic: "The first floor?", fluent: "So, one floor up — the lift, right?" },
    ],
  },
  {
    sequence: 30, blockId: 2, indexInBlock: 5, phase: 3, subBlock: "2.1", threshold: 80,
    sceneTitle: { en: "Wi-Fi & Breakfast", "pt-BR": "Wi-Fi & Café da Manhã" },
    contextDescription: {
      en: "Settled, but disconnected. You pop back down for the essentials: the Wi-Fi code and when breakfast stops.",
      "pt-BR": "Instalado, mas desconectado. Você desce de novo pelo essencial: a senha do Wi-Fi e até que horas vai o café.",
    },
    objective: { en: "Ask for the Wi-Fi password and breakfast hours.", "pt-BR": "Pedir a senha do Wi-Fi e o horário do café." },
    environment: { mood: "pleased", baseNoise: 25 },
    npc: { name: { en: "Receptionist", "pt-BR": "Recepcionista" }, initials: "RC" },
    drills: [{ word: "the Wi-Fi password", say: "dâ UÁI-fai PÁS-uârd", note: { en: "Essential survival info.", "pt-BR": "Informação de sobrevivência essencial." } }],
    dialogueSteps: [
      { text: "Wi-Fi? The password's on the card. Breakfast till ten.", tr: { en: "Password's on the card; breakfast until 10.", "pt-BR": "Senha no cartão; café até as 10." }, ear: { en: "<b>“til tén”</b>", "pt-BR": "<b>“til tén”</b>" }, audioPrompt: "Receptionist: “Wi-Fi? The password's on the card. Breakfast till ten.”", basic: "Thank you. Cheers.", fluent: "Brilliant, cheers." },
    ],
  },

  /* ===================== 2.2 — SUPERMARKET ===================== */
  {
    sequence: 31, blockId: 2, indexInBlock: 6, phase: 3, subBlock: "2.2", threshold: 80,
    sceneTitle: { en: "Finding the Aisle", "pt-BR": "Achando o Corredor" },
    contextDescription: {
      en: "Fluorescent lights, trolley wheels squeaking, a tannoy announcing offers. You can't find the milk. A shelf-stacker rushes past.",
      "pt-BR": "Luzes fluorescentes, rodinhas de carrinho rangendo, um alto-falante anunciando ofertas. Você não acha o leite. Um repositor passa correndo.",
    },
    objective: { en: "Ask where an item is; understand 'aisle'.", "pt-BR": "Perguntar onde fica um item; entender 'aisle' (corredor)." },
    environment: { mood: "neutral", baseNoise: 46 },
    npc: { name: { en: "Shop Assistant", "pt-BR": "Repositor(a)" }, initials: "SA" },
    drills: [{ word: "which aisle?", say: "UÍTCH ÁIL", note: { en: "‘aisle’ — the S is silent.", "pt-BR": "‘aisle’ — o S é mudo: ÁIL." } }],
    dialogueSteps: [
      { text: "Milk? Aisle four, by the eggs.", tr: { en: "Milk is in aisle 4, near the eggs.", "pt-BR": "Leite no corredor 4, perto dos ovos." }, ear: { en: "<b>“ÁIL fór”</b>", "pt-BR": "<b>“ÁIL fór”</b>" }, audioPrompt: "Assistant, barely stopping: “Milk? Aisle four, by the eggs.”", basic: "Thank you.", fluent: "Cheers, aisle four." },
    ],
  },
  {
    sequence: 32, blockId: 2, indexInBlock: 7, phase: 3, subBlock: "2.2", threshold: 80,
    sceneTitle: { en: "Unexpected Item", "pt-BR": "Item Inesperado" },
    contextDescription: {
      en: "Self-checkout. The robotic voice scolds you: “Unexpected item in the bagging area.” A red light blinks. People stare. You must summon help.",
      "pt-BR": "Autoatendimento. A voz robótica te repreende: “Unexpected item in the bagging area.” Uma luz vermelha pisca. As pessoas olham. Você precisa chamar ajuda.",
    },
    objective: { en: "React to the self-checkout error and call an attendant.", "pt-BR": "Reagir ao erro do autoatendimento e chamar um atendente." },
    culturalNote: { en: "Every UK traveller hears this phrase. Just wave for the attendant.", "pt-BR": "Todo viajante no Reino Unido ouve essa frase. Só acene para o atendente." },
    environment: { mood: "hostile", baseNoise: 48 },
    npc: { name: { en: "Self-Checkout", "pt-BR": "Autoatendimento" }, initials: "SX" },
    drills: [{ word: "excuse me, it's stuck", say: "iks-KIÚZ mi, its STÂK", note: { en: "Call for an override.", "pt-BR": "Chamar para liberar." } }],
    dialogueSteps: [
      { text: "Unexpected item in the bagging area.", tr: { en: "The machine is confused — call staff.", "pt-BR": "A máquina travou — chame um atendente." }, ear: { en: "<b>“ân-ek-SPÉK-tid”</b>", "pt-BR": "<b>“ân-ek-SPÉK-tid”</b>" }, audioPrompt: "Robotic checkout voice, flat: “Unexpected item in the bagging area.”", basic: "Excuse me, it's stuck.", fluent: "Excuse me — the machine's stuck." },
    ],
  },
  {
    sequence: 33, blockId: 2, indexInBlock: 8, phase: 3, subBlock: "2.2", threshold: 80,
    sceneTitle: { en: "The Nectar Card", "pt-BR": "O Cartão Fidelidade" },
    contextDescription: {
      en: "An attendant taps her override key. Mid-fix she fires the classic: “Do you have a Nectar card?” — a loyalty scheme you've never heard of.",
      "pt-BR": "A atendente usa a chave de liberação. No meio, ela dispara o clássico: “Do you have a Nectar card?” — um programa de fidelidade que você nunca ouviu falar.",
    },
    objective: { en: "Politely decline a loyalty card you don't have.", "pt-BR": "Recusar educadamente um cartão fidelidade que você não tem." },
    culturalNote: { en: "Nectar/Clubcard = loyalty points. As a tourist, just say no.", "pt-BR": "Nectar/Clubcard = pontos de fidelidade. Como turista, só diga não." },
    environment: { mood: "neutral", baseNoise: 47 },
    npc: { name: { en: "Attendant", "pt-BR": "Atendente" }, initials: "AT" },
    drills: [{ word: "no, I don't", say: "NÔU, ai dôunt", note: { en: "Decline simply.", "pt-BR": "Recuse de forma simples." } }],
    dialogueSteps: [
      { text: "Sorted. Do you have a Nectar card?", tr: { en: "Fixed it — any loyalty card?", "pt-BR": "Resolvido — tem cartão fidelidade?" }, ear: { en: "<b>“SÓR-tid”</b> = resolvido", "pt-BR": "<b>“SÓR-tid”</b> = resolvido" }, audioPrompt: "Attendant, keying the override: “Sorted. Do you have a Nectar card?”", basic: "No, I don't.", fluent: "No, I don't — thanks though." },
    ],
  },
  {
    sequence: 34, blockId: 2, indexInBlock: 9, phase: 3, subBlock: "2.2", threshold: 80,
    sceneTitle: { en: "Card Declined", "pt-BR": "Cartão Recusado" },
    contextDescription: {
      en: "You tap to pay. Beep — declined. Tap again. Declined. Your stomach drops as the queue tuts behind you. Try another card, stay calm.",
      "pt-BR": "Você aproxima o cartão. Bip — recusado. De novo. Recusado. Seu estômago afunda enquanto a fila resmunga atrás. Tente outro cartão, mantenha a calma.",
    },
    objective: { en: "Handle a declined card and offer another.", "pt-BR": "Lidar com cartão recusado e oferecer outro." },
    environment: { mood: "hostile", baseNoise: 49 },
    npc: { name: { en: "Attendant", "pt-BR": "Atendente" }, initials: "AT" },
    drills: [{ word: "let me try another", say: "lét mi trái a-NÂ-dâr", note: { en: "Offer a second card.", "pt-BR": "Ofereça um segundo cartão." } }],
    dialogueSteps: [
      { text: "Sorry, love, that one's been declined.", tr: { en: "Your card was declined ('love' = friendly).", "pt-BR": "Seu cartão foi recusado ('love' = simpático)." }, ear: { en: "<b>“di-CLÁIND”</b>", "pt-BR": "<b>“di-CLÁIND”</b>" }, audioPrompt: "Attendant, kindly: “Sorry, love, that one's been declined.”", basic: "Let me try another.", fluent: "No worries — let me try another card." },
    ],
  },
  {
    sequence: 35, blockId: 2, indexInBlock: 10, phase: 3, subBlock: "2.2", threshold: 80,
    sceneTitle: { en: "Bags Cost 10p", "pt-BR": "Sacolas Custam 10p" },
    contextDescription: {
      en: "Payment clears. Then: “Do you need a bag? They're 10p.” In the UK, bags aren't free — a tiny shock that catches every newcomer.",
      "pt-BR": "O pagamento passa. Então: “Do you need a bag? They're 10p.” No Reino Unido, sacolas não são grátis — um pequeno choque que pega todo recém-chegado.",
    },
    objective: { en: "Decide on a paid bag.", "pt-BR": "Decidir sobre a sacola paga." },
    culturalNote: { en: "Carrier bags cost money in the UK. Bring your own to save pennies.", "pt-BR": "Sacolas custam dinheiro no Reino Unido. Leve a sua para economizar." },
    environment: { mood: "neutral", baseNoise: 46 },
    npc: { name: { en: "Attendant", "pt-BR": "Atendente" }, initials: "AT" },
    drills: [{ word: "yes, one bag", say: "IÉS, uân bég", note: { en: "Ask for a single bag.", "pt-BR": "Pedir uma sacola." } }],
    dialogueSteps: [
      { text: "Do you need a bag? They're 10p.", tr: { en: "Want a bag? It costs 10p.", "pt-BR": "Quer sacola? Custa 10p." }, ear: { en: "<b>“tén pí”</b> = 10 pence", "pt-BR": "<b>“tén pí”</b> = 10 pence" }, audioPrompt: "Attendant: “Do you need a bag? They're 10p.”", basic: "Yes, one bag.", fluent: "Yes, just one bag, please." },
    ],
  },

  /* ===================== 2.3 — STREET IN THE RAIN ===================== */
  {
    sequence: 36, blockId: 2, indexInBlock: 11, phase: 3, subBlock: "2.3", threshold: 80,
    sceneTitle: { en: "Lost in the Downpour", "pt-BR": "Perdido no Temporal" },
    contextDescription: {
      en: "You step out and the sky opens — proper London rain, hammering, no brolly. Traffic hisses through puddles. You stop a passer-by, shouting over the storm.",
      "pt-BR": "Você sai e o céu desaba — chuva londrina de verdade, martelando, sem guarda-chuva. O trânsito chia nas poças. Você para um pedestre, gritando por cima da tempestade.",
    },
    objective: { en: "Ask directions over heavy rain; learn 'brolly'.", "pt-BR": "Pedir direção sob chuva forte; aprender 'brolly'." },
    culturalNote: { en: "‘Brolly’ = umbrella. ‘You'll get soaked’ = você vai se encharcar.", "pt-BR": "‘Brolly’ = guarda-chuva. ‘You'll get soaked’ = você vai se encharcar." },
    environment: { mood: "hostile", baseNoise: 58, rain: true },
    npc: { name: { en: "Passer-by", "pt-BR": "Pedestre" }, initials: "PB" },
    drills: [{ word: "where's Oxford Street?", say: "UÉRZ ÓKS-fârd strít", note: { en: "Ask for a known street.", "pt-BR": "Pergunte por uma rua conhecida." } }],
    dialogueSteps: [
      { text: "Oxford Street? Blimey, no brolly? It's that way!", tr: { en: "It's that way — and you've no umbrella!", "pt-BR": "É por ali — e você sem guarda-chuva!" }, ear: { en: "<b>“BLÁI-mi”</b> = wow", "pt-BR": "<b>“BLÁI-mi”</b> = nossa" }, audioPrompt: "Passer-by, shouting through rain: “Oxford Street? Blimey, no brolly? It's that way!”", basic: "Thank you!", fluent: "Cheers — that way, got it!" },
    ],
  },
  {
    sequence: 37, blockId: 2, indexInBlock: 12, phase: 3, subBlock: "2.3", threshold: 80,
    sceneTitle: { en: "The Bus Stop", "pt-BR": "O Ponto de Ônibus" },
    contextDescription: {
      en: "Soaked, you shelter at a bus stop. A double-decker roars up, spraying water. You must confirm it's the right one before the doors hiss shut.",
      "pt-BR": "Encharcado, você se abriga num ponto. Um ônibus de dois andares chega rugindo, espirrando água. Confirme se é o certo antes das portas fecharem.",
    },
    objective: { en: "Confirm the bus and tap to pay.", "pt-BR": "Confirmar o ônibus e pagar por aproximação." },
    environment: { mood: "neutral", baseNoise: 60, rain: true },
    npc: { name: { en: "Bus Driver", "pt-BR": "Motorista" }, initials: "BD" },
    drills: [{ word: "does this go to…?", say: "dâz dis GÔU tu", note: { en: "Confirm a destination.", "pt-BR": "Confirme o destino." } }],
    dialogueSteps: [
      { text: "Hop on, tap your card. Yeah, it goes there.", tr: { en: "Get on and tap your card — yes, it goes there.", "pt-BR": "Suba e aproxime o cartão — sim, vai para lá." }, ear: { en: "<b>“róp ón”</b> = get on", "pt-BR": "<b>“róp ón”</b> = suba" }, audioPrompt: "Driver, over engine + rain: “Hop on, tap your card. Yeah, it goes there.”", basic: "Thank you.", fluent: "Cheers, mate." },
    ],
  },
  {
    sequence: 38, blockId: 2, indexInBlock: 13, phase: 3, subBlock: "2.3", threshold: 80,
    sceneTitle: { en: "Wrong Way", "pt-BR": "Caminho Errado" },
    contextDescription: {
      en: "Off the bus, still raining. A kind stranger notices you squinting at your phone: “I think you've gone the wrong way, love.” Swallow your pride and ask.",
      "pt-BR": "Fora do ônibus, ainda chovendo. Um estranho gentil te vê apertando os olhos no celular: “I think you've gone the wrong way, love.” Engula o orgulho e pergunte.",
    },
    objective: { en: "Accept correction and ask for the right way.", "pt-BR": "Aceitar a correção e perguntar o caminho certo." },
    environment: { mood: "neutral", baseNoise: 56, rain: true },
    npc: { name: { en: "Stranger", "pt-BR": "Estranho(a)" }, initials: "ST" },
    drills: [{ word: "which way then?", say: "UÍTCH UÊI dén", note: { en: "Ask the correct direction.", "pt-BR": "Pergunte a direção certa." } }],
    dialogueSteps: [
      { text: "You've gone the wrong way, love. It's back there.", tr: { en: "Wrong way — it's back the other way.", "pt-BR": "Caminho errado — é para trás." }, ear: { en: "<b>“róng UÊI”</b>", "pt-BR": "<b>“róng UÊI”</b>" }, audioPrompt: "Stranger, kindly, in the rain: “You've gone the wrong way, love. It's back there.”", basic: "Which way then?", fluent: "Oh no — which way then?" },
    ],
  },
  {
    sequence: 39, blockId: 2, indexInBlock: 14, phase: 3, subBlock: "2.3", threshold: 80,
    sceneTitle: { en: "Weather Talk", "pt-BR": "Conversa sobre o Tempo" },
    contextDescription: {
      en: "Sheltering under an awning, the stranger waits with you. They open with the national sport: complaining about the weather. Survive the small talk.",
      "pt-BR": "Abrigado sob um toldo, o estranho espera com você. Ele puxa o esporte nacional: reclamar do tempo. Sobreviva à conversa fiada.",
    },
    objective: { en: "Make small talk about the weather (the British icebreaker).", "pt-BR": "Conversar sobre o tempo (o quebra-gelo britânico)." },
    culturalNote: { en: "Complaining about rain is how Brits bond. Agree and you're in.", "pt-BR": "Reclamar da chuva é como os britânicos socializam. Concorde e você está dentro." },
    environment: { mood: "pleased", baseNoise: 52, rain: true },
    npc: { name: { en: "Stranger", "pt-BR": "Estranho(a)" }, initials: "ST" },
    drills: [{ word: "it's pouring", say: "its PÓ-rin", note: { en: "= it's raining hard.", "pt-BR": "= está chovendo muito." } }],
    dialogueSteps: [
      { text: "Miserable weather, eh? Typical British summer.", tr: { en: "Awful weather, right?", "pt-BR": "Tempo horrível, né?" }, ear: { en: "<b>“MÍ-zrâ-bâl”</b>", "pt-BR": "<b>“MÍ-zrâ-bâl”</b>" }, audioPrompt: "Stranger, rolling eyes at the sky: “Miserable weather, eh? Typical British summer.”", basic: "Yeah, it's pouring!", fluent: "Tell me about it — it's pouring!" },
    ],
  },
  {
    sequence: 40, blockId: 2, indexInBlock: 15, phase: 3, subBlock: "2.3", threshold: 80,
    sceneTitle: { en: "Just Round the Corner", "pt-BR": "Logo na Esquina" },
    contextDescription: {
      en: "They point you the right way: “It's just round the corner, by the postbox.” The rain eases. You're nearly there — read the postcode and go.",
      "pt-BR": "Ele te aponta o caminho certo: “It's just round the corner, by the postbox.” A chuva diminui. Você está quase lá — leia o CEP e vá.",
    },
    objective: { en: "Understand 'round the corner' + a postcode landmark.", "pt-BR": "Entender 'round the corner' + um ponto de referência." },
    environment: { mood: "neutral", baseNoise: 44, rain: true },
    npc: { name: { en: "Stranger", "pt-BR": "Estranho(a)" }, initials: "ST" },
    drills: [{ word: "round the corner", say: "RÁUND dâ CÓR-nâr", note: { en: "= very close, just there.", "pt-BR": "= bem perto, ali." } }],
    dialogueSteps: [
      { text: "It's just round the corner, by the postbox.", tr: { en: "Very close — near the postbox.", "pt-BR": "Bem perto — perto do correio." }, ear: { en: "<b>“RÁUND dâ CÓR-nâr”</b>", "pt-BR": "<b>“RÁUND dâ CÓR-nâr”</b>" }, audioPrompt: "Stranger, pointing as rain eases: “It's just round the corner, by the postbox.”", basic: "Thank you so much.", fluent: "Brilliant — thank you so much!" },
    ],
  },

  /* ===================== 2.4 — PHARMACY / MEDICAL ===================== */
  {
    sequence: 41, blockId: 2, indexInBlock: 16, phase: 3, subBlock: "2.4", threshold: 80,
    sceneTitle: { en: "Finding a Chemist", "pt-BR": "Achando uma Farmácia" },
    contextDescription: {
      en: "A headache is building behind your eyes. You need a pharmacy — but here it's called a 'chemist'. You ask a shopkeeper.",
      "pt-BR": "Uma dor de cabeça cresce atrás dos seus olhos. Você precisa de uma farmácia — mas aqui se chama 'chemist'. Você pergunta a um comerciante.",
    },
    objective: { en: "Find a pharmacy ('chemist').", "pt-BR": "Achar uma farmácia ('chemist')." },
    culturalNote: { en: "‘Chemist’ = pharmacy (Boots is the big one). Not a 'pharmacy' sign.", "pt-BR": "‘Chemist’ = farmácia (a Boots é a maior). Não procure 'pharmacy'." },
    environment: { mood: "neutral", baseNoise: 40 },
    npc: { name: { en: "Shopkeeper", "pt-BR": "Comerciante" }, initials: "SK" },
    drills: [{ word: "a chemist", say: "a KÉ-mist", note: { en: "= a pharmacy.", "pt-BR": "= uma farmácia." } }],
    dialogueSteps: [
      { text: "A chemist? There's a Boots down the road.", tr: { en: "There's a pharmacy (Boots) down the street.", "pt-BR": "Tem uma farmácia (Boots) descendo a rua." }, ear: { en: "<b>“KÉ-mist”</b>", "pt-BR": "<b>“KÉ-mist”</b>" }, audioPrompt: "Shopkeeper, pointing: “A chemist? There's a Boots down the road.”", basic: "Thank you.", fluent: "Cheers — down the road." },
    ],
  },
  {
    sequence: 42, blockId: 2, indexInBlock: 17, phase: 3, subBlock: "2.4", threshold: 80,
    sceneTitle: { en: "Describing Symptoms", "pt-BR": "Descrevendo Sintomas" },
    contextDescription: {
      en: "At the counter, the pharmacist waits. You must name what's wrong — clearly, because the wrong word gets the wrong medicine.",
      "pt-BR": "No balcão, o farmacêutico espera. Você precisa dizer o que sente — com clareza, porque a palavra errada traz o remédio errado.",
    },
    objective: { en: "State symptoms: headache, sore throat.", "pt-BR": "Dizer sintomas: dor de cabeça, dor de garganta." },
    environment: { mood: "neutral", baseNoise: 34 },
    npc: { name: { en: "Pharmacist", "pt-BR": "Farmacêutico(a)" }, initials: "PH" },
    drills: [
      { word: "I've got a headache", say: "aiv gót a RÉD-êik", note: { en: "‘I've got’ = I have (UK).", "pt-BR": "‘I've got’ = eu tenho (UK)." } },
      { word: "a sore throat", say: "a SÓR THRÔUT", note: { en: "= dor de garganta.", "pt-BR": "= dor de garganta." } },
    ],
    dialogueSteps: [
      { text: "Hiya, what seems to be the problem?", tr: { en: "Hello — what's wrong?", "pt-BR": "Olá — qual é o problema?" }, ear: { en: "<b>“RÁI-ya”</b> = oi", "pt-BR": "<b>“RÁI-ya”</b> = oi" }, audioPrompt: "Pharmacist, kind: “Hiya, what seems to be the problem?”", basic: "I've got a headache.", fluent: "I've got a headache and a sore throat." },
    ],
  },
  {
    sequence: 43, blockId: 2, indexInBlock: 18, phase: 3, subBlock: "2.4", threshold: 80,
    sceneTitle: { en: "Paracetamol, Not Tylenol", "pt-BR": "Paracetamol, Não Tylenol" },
    contextDescription: {
      en: "“You'll want some paracetamol.” You blink — you asked for Tylenol in your head. Same thing, different name. Brand names don't travel.",
      "pt-BR": "“You'll want some paracetamol.” Você pisca — na sua cabeça pediu Tylenol. Mesma coisa, nome diferente. Marcas não viajam.",
    },
    objective: { en: "Recognize 'paracetamol' and confirm the purchase.", "pt-BR": "Reconhecer 'paracetamol' e confirmar a compra." },
    culturalNote: { en: "Paracetamol = acetaminophen/Tylenol. Ask by the generic name abroad.", "pt-BR": "Paracetamol = acetaminofeno/Tylenol. No exterior, peça pelo nome genérico." },
    environment: { mood: "neutral", baseNoise: 32 },
    npc: { name: { en: "Pharmacist", "pt-BR": "Farmacêutico(a)" }, initials: "PH" },
    drills: [{ word: "paracetamol", say: "pa-râ-SÍ-tâ-mol", note: { en: "The UK painkiller.", "pt-BR": "O analgésico do Reino Unido." } }],
    dialogueSteps: [
      { text: "You'll want some paracetamol. Box of sixteen?", tr: { en: "Take paracetamol — a box of 16?", "pt-BR": "Leve paracetamol — caixa de 16?" }, ear: { en: "<b>“pa-râ-SÍ-tâ-mol”</b>", "pt-BR": "<b>“pa-râ-SÍ-tâ-mol”</b>" }, audioPrompt: "Pharmacist: “You'll want some paracetamol. Box of sixteen?”", basic: "Yes, please.", fluent: "Yes, a box of sixteen, please." },
    ],
  },
  {
    sequence: 44, blockId: 2, indexInBlock: 19, phase: 3, subBlock: "2.4", threshold: 80,
    sceneTitle: { en: "Do I Need a Prescription?", "pt-BR": "Preciso de Receita?" },
    contextDescription: {
      en: "The headache won't quit and you're worried. The pharmacist explains the system: 111 for advice, 999 only for emergencies — and what needs a prescription.",
      "pt-BR": "A dor não passa e você se preocupa. O farmacêutico explica o sistema: 111 para orientação, 999 só para emergências — e o que precisa de receita.",
    },
    objective: { en: "Ask about prescriptions and the NHS numbers (111/999).", "pt-BR": "Perguntar sobre receita e os números do NHS (111/999)." },
    culturalNote: { en: "UK: 999 = emergency, 111 = non-urgent NHS advice. Don't dial 911.", "pt-BR": "Reino Unido: 999 = emergência, 111 = orientação não-urgente. Não disque 911." },
    environment: { mood: "neutral", baseNoise: 33 },
    npc: { name: { en: "Pharmacist", "pt-BR": "Farmacêutico(a)" }, initials: "PH" },
    drills: [{ word: "a prescription", say: "a pris-CRÍP-shân", note: { en: "= receita médica.", "pt-BR": "= receita médica." } }],
    dialogueSteps: [
      { text: "If it gets worse, call 111 — that's NHS advice.", tr: { en: "Worse? Call 111 for NHS advice.", "pt-BR": "Piorou? Ligue 111 para orientação do NHS." }, ear: { en: "<b>“uân-uân-uân”</b> = 111", "pt-BR": "<b>“uân-uân-uân”</b> = 111" }, audioPrompt: "Pharmacist, reassuring: “If it gets worse, call 111 — that's NHS advice.”", basic: "Do I need a prescription?", fluent: "Thanks — do I need a prescription for anything?" },
    ],
  },
  {
    sequence: 45, blockId: 2, indexInBlock: 20, phase: 3, subBlock: "2.4", threshold: 80,
    sceneTitle: { en: "Dosage", "pt-BR": "Posologia" },
    contextDescription: {
      en: "Last step: the instructions. Get the dosage wrong and medicine becomes danger. Listen carefully and read it back.",
      "pt-BR": "Último passo: as instruções. Erre a dose e o remédio vira perigo. Ouça com atenção e repita.",
    },
    objective: { en: "Understand dosage instructions and confirm.", "pt-BR": "Entender a posologia e confirmar." },
    environment: { mood: "neutral", baseNoise: 32 },
    npc: { name: { en: "Pharmacist", "pt-BR": "Farmacêutico(a)" }, initials: "PH" },
    drills: [{ word: "twice a day", say: "TUÁIS a dêi", note: { en: "= duas vezes ao dia.", "pt-BR": "= duas vezes ao dia." } }],
    dialogueSteps: [
      { text: "Take two, twice a day, with food.", tr: { en: "2 pills, 2× a day, with food.", "pt-BR": "2 comprimidos, 2× ao dia, com comida." }, ear: { en: "<b>“tuáis a dêi”</b>", "pt-BR": "<b>“tuáis a dêi”</b>" }, audioPrompt: "Pharmacist, slow and clear: “Take two, twice a day, with food.”", basic: "Two, twice a day.", fluent: "Two, twice a day, with food — got it." },
    ],
  },

  /* ===================== 2.5 — BANK / CURRENCY ===================== */
  {
    sequence: 46, blockId: 2, indexInBlock: 21, phase: 3, subBlock: "2.5", threshold: 80,
    sceneTitle: { en: "Currency Exchange", "pt-BR": "Câmbio" },
    contextDescription: {
      en: "Down to your last notes. A bureau de change glows behind glass. Rates and commissions hide in the small print — ask directly.",
      "pt-BR": "Suas últimas notas. Uma casa de câmbio brilha atrás do vidro. Taxas e comissões se escondem nas letras miúdas — pergunte direto.",
    },
    objective: { en: "Ask the exchange rate and any commission.", "pt-BR": "Perguntar a taxa de câmbio e a comissão." },
    environment: { mood: "neutral", baseNoise: 38 },
    npc: { name: { en: "Cashier", "pt-BR": "Caixa" }, initials: "CX" },
    drills: [{ word: "the exchange rate", say: "di iks-TCHÊINDJ rêit", note: { en: "= a taxa de câmbio.", "pt-BR": "= a taxa de câmbio." } }],
    dialogueSteps: [
      { text: "We're at one-twenty, no commission today.", tr: { en: "Rate 1.20, no fee today.", "pt-BR": "Taxa 1,20, sem comissão hoje." }, ear: { en: "<b>“com-Í-shân”</b>", "pt-BR": "<b>“com-Í-shân”</b>" }, audioPrompt: "Cashier, behind glass: “We're at one-twenty, no commission today.”", basic: "What's the rate?", fluent: "And the exchange rate — any commission?" },
    ],
  },
  {
    sequence: 47, blockId: 2, indexInBlock: 22, phase: 3, subBlock: "2.5", threshold: 80,
    sceneTitle: { en: "Opening an Account", "pt-BR": "Abrindo uma Conta" },
    contextDescription: {
      en: "A high-street bank, hushed and formal. You want a local account. The advisor smiles politely — then asks the question that traps every newcomer.",
      "pt-BR": "Um banco de rua, silencioso e formal. Você quer uma conta local. O atendente sorri educadamente — e faz a pergunta que prende todo recém-chegado.",
    },
    objective: { en: "Request to open an account.", "pt-BR": "Pedir para abrir uma conta." },
    environment: { mood: "neutral", baseNoise: 28 },
    npc: { name: { en: "Bank Advisor", "pt-BR": "Gerente" }, initials: "BA" },
    drills: [{ word: "open an account", say: "Ô-pân ãn a-KÁUNT", note: { en: "= abrir uma conta.", "pt-BR": "= abrir uma conta." } }],
    dialogueSteps: [
      { text: "Certainly. Do you have proof of UK address?", tr: { en: "Sure — proof of a UK address?", "pt-BR": "Claro — comprovante de endereço no Reino Unido?" }, ear: { en: "<b>“prúf âv a-DRÉS”</b>", "pt-BR": "<b>“prúf âv a-DRÉS”</b>" }, audioPrompt: "Advisor, polite: “Certainly. Do you have proof of UK address?”", basic: "I'd like to open an account.", fluent: "I'd like to open an account, please." },
    ],
  },
  {
    sequence: 48, blockId: 2, indexInBlock: 23, phase: 3, subBlock: "2.5", threshold: 80,
    sceneTitle: { en: "The Catch-22", "pt-BR": "O Beco Sem Saída" },
    contextDescription: {
      en: "“You need proof of address to open an account — a utility bill or tenancy.” But you can't get a bill without an account. The classic newcomer trap. Push back politely.",
      "pt-BR": "“Você precisa de comprovante de endereço para abrir a conta — uma conta de luz ou contrato.” Mas você não consegue uma conta de luz sem conta bancária. A armadilha clássica. Argumente com educação.",
    },
    objective: { en: "Navigate the proof-of-address catch-22; ask for options.", "pt-BR": "Lidar com o beco sem saída do comprovante; pedir alternativas." },
    culturalNote: { en: "Newcomer trap: try digital banks (Monzo/Revolut) that accept a passport.", "pt-BR": "Armadilha de recém-chegado: tente bancos digitais (Monzo/Revolut) que aceitam passaporte." },
    environment: { mood: "hostile", baseNoise: 28 },
    npc: { name: { en: "Bank Advisor", "pt-BR": "Gerente" }, initials: "BA" },
    drills: [{ word: "is there another way?", say: "iz dér a-NÂ-dâr UÊI", note: { en: "Ask for alternatives.", "pt-BR": "Pedir alternativas." } }],
    dialogueSteps: [
      { text: "Without a bill, I'm afraid I can't proceed.", tr: { en: "No bill = can't open it (sorry).", "pt-BR": "Sem conta de luz = não dá (desculpe)." }, ear: { en: "<b>“ai'm a-FRÊID”</b> = infelizmente", "pt-BR": "<b>“ai'm a-FRÊID”</b> = infelizmente" }, audioPrompt: "Advisor, apologetic but firm: “Without a bill, I'm afraid I can't proceed.”", basic: "Is there another way?", fluent: "I understand — is there another way?" },
    ],
  },
  {
    sequence: 49, blockId: 2, indexInBlock: 24, phase: 3, subBlock: "2.5", threshold: 80,
    sceneTitle: { en: "The Machine Ate My Card", "pt-BR": "A Máquina Comeu Meu Cartão" },
    contextDescription: {
      en: "Outside, you try the cash machine for emergency cash — and it swallows your card. Screen frozen. You rush back in, heart pounding, to report it.",
      "pt-BR": "Lá fora, você tenta o caixa eletrônico por dinheiro de emergência — e ele engole seu cartão. Tela travada. Você volta correndo, coração disparado, para relatar.",
    },
    objective: { en: "Report a card retained by the cash machine.", "pt-BR": "Relatar um cartão retido pelo caixa eletrônico." },
    culturalNote: { en: "‘Cash machine’/‘cashpoint’ = ATM. ‘It's eaten my card’ = reteve o cartão.", "pt-BR": "‘Cash machine’/‘cashpoint’ = caixa eletrônico. ‘It's eaten my card’ = reteve o cartão." },
    environment: { mood: "hostile", baseNoise: 34 },
    npc: { name: { en: "Bank Advisor", "pt-BR": "Gerente" }, initials: "BA" },
    drills: [{ word: "it's eaten my card", say: "its Í-tân mai kard", note: { en: "The machine kept your card.", "pt-BR": "A máquina reteve seu cartão." } }],
    dialogueSteps: [
      { text: "The cashpoint kept it? Let me take some details.", tr: { en: "It kept your card? I'll take details.", "pt-BR": "Reteve o cartão? Vou anotar os dados." }, ear: { en: "<b>“KÉCH-point”</b> = ATM", "pt-BR": "<b>“KÉCH-point”</b> = caixa eletrônico" }, audioPrompt: "Advisor, attentive: “The cashpoint kept it? Let me take some details.”", basic: "It's eaten my card.", fluent: "Yes — the machine's eaten my card." },
    ],
  },
  {
    sequence: 50, blockId: 2, indexInBlock: 25, phase: 3, subBlock: "2.5", threshold: 75,
    kind: "bonus",
    triggerSelfieShare: true,
    selfieOverlay: { eyebrow: "London Resident", tagline: "London Resident — Base Established", shareText: "Two weeks in London and I've established my base with LinguoBound! 🇬🇧🏠" },
    sceneTitle: { en: "Bonus — A Pint to Celebrate", "pt-BR": "Bônus — Uma Pint para Comemorar" },
    contextDescription: {
      en: "Sorted. Card replaced, account on the way, the rain long gone. You step into a cosy pub, golden light, low chatter, and order your first proper pint as a local. You're not a tourist anymore — you live here now.",
      "pt-BR": "Tudo resolvido. Cartão trocado, conta a caminho, a chuva foi embora. Você entra num pub aconchegante, luz dourada, conversa baixa, e pede sua primeira pint de verdade como morador. Você não é mais turista — você mora aqui agora.",
    },
    objective: { en: "Order a pint and savour 'Base Established'.", "pt-BR": "Pedir uma pint e saborear a 'Base Estabelecida'." },
    environment: { mood: "pleased", baseNoise: 40 },
    npc: { name: { en: "Bartender", "pt-BR": "Bartender" }, initials: "BT" },
    drills: [{ word: "a pint, please", say: "a PÁINT, plíz", note: { en: "The classic pub order.", "pt-BR": "O pedido clássico de pub." } }],
    dialogueSteps: [
      { text: "What can I get you, mate?", tr: { en: "What would you like? ('mate' = friend)", "pt-BR": "O que você quer? ('mate' = amigo)" }, ear: { en: "<b>“mêit”</b> = amigo", "pt-BR": "<b>“mêit”</b> = amigo" }, audioPrompt: "Bartender, warm, golden pub light: “What can I get you, mate?”", basic: "A pint, please.", fluent: "A pint of the local one, please." },
      { text: "Good choice. New around here?", tr: { en: "Nice — new to the area?", "pt-BR": "Boa — novo por aqui?" }, ear: { en: "<b>“niú a-RÁUND rir”</b>", "pt-BR": "<b>“niú a-RÁUND rir”</b>" }, audioPrompt: "Bartender, pulling the pint: “Good choice. New around here?”", basic: "I live here now.", fluent: "Not anymore — I live here now." },
    ],
  },
];

export const BLOCK02_BY_SEQUENCE = BLOCK02_MODULES.reduce((acc, m) => {
  acc[m.sequence] = m;
  return acc;
}, {});
