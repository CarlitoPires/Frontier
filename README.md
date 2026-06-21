# LinguoBound — Real-Life Social Simulator

Hyper-realistic language-survival simulator. AI NPCs in an urban RPG ecosystem
force organic fluency under pressure. "Quiet Luxury" editorial aesthetic.

> Developer: Carlito Pires · Architectural Prompt Engineering

## Project layout

```
frontend/                 Self-contained UI (no build step, no CDN)
  index.html              Authentication screen + FaceID animation
  dashboard.html          Professional dashboard (radar analytics)
  simulation.html         In-simulation NPC dialogue HUD (Survival Panel)
  css/obsidian.css        "Obsidian Editorial" design system / tokens
  css/auth.css            Auth + biometric overlay styles
  css/dashboard.css       Dashboard layout
  css/hud.css             In-simulation HUD (stage, meters, mic, stamp)
  js/auth.js              Login + cinematic FaceID sequence
  js/radar.js             Dependency-free canvas radar chart
  js/dashboard.js         Radar, citizenship hierarchy, weather sync (rain)
  js/hud.js               Dialogue engine, teleprompter, earpiece, mic loop

backend/                  API + data model
  prisma/schema.prisma    Cities → Blocks(20) → Modules(500) → Progress
  prisma/seed.ts          Generates the 20×25 = 500 module matrix per city
  src/progression.ts      *** Hard Gate logic (the core) ***
  src/routes.ts           Express routes (read/write gate, 423 Locked)
  src/server.ts           API entrypoint
```

## Run the frontend

It's static. Open `frontend/index.html` in a browser, or serve it:

```bash
cd frontend && python3 -m http.server 8080   # http://localhost:8080
```

`index.html` → login or FaceID → `dashboard.html` → "Resume Simulation" → `simulation.html`.

### In-simulation HUD (`simulation.html`)

The Survival Panel during a live NPC dialogue (scene: Customs Control):

- **Mental Translation** — tap the officer's line to reveal the pt-BR translation.
- **Earpiece (Ponto Eletrônico)** — toggle a whispered pronunciation tip,
  spelled in native-text sounds (Reverse Engineering of Speech).
- **3-Way Teleprompter** — Basic / Fluent / **Free Flight** (open mic, no
  script, +XP).
- **Impatient NPC** — the Patience meter decays while you hesitate; a Noise
  meter fluctuates and degrades comprehension. Hold the mic to respond.
- **Action → Obstacle → Consequence** — ends with a cinematic passport-stamp
  (`ADMITTED` / `DENIED`) and a proficiency score that the backend Hard Gate
  would consume to unlock Module 12.

## Run the backend

```bash
cd backend
npm install
# set DATABASE_URL (Postgres) in .env
npm run db:generate && npm run db:migrate
npm run db:seed        # builds 500 modules/city
npm run dev            # http://localhost:4000
```

## The Hard Gate (summary)

Module **N+1** is `LOCKED` until module **N** returns `PROFICIENCY_PASSED`.
Enforced in three layers so a tampered client cannot skip ahead:

1. **Read gate** — `canAttemptModule()` refuses to open a module whose
   predecessor isn't passed (`423 Locked`).
2. **Write gate** — `submitProficiencyResult()` re-checks the predecessor
   inside a `SERIALIZABLE` transaction before recording a pass, then opens
   exactly module N+1.
3. **City gate** — all 500 modules passed → AI `Certification` issued →
   `enrollNextCity()` lets the user "conquer" the next capital (tier-limited).

Each module follows the `Action → Obstacle → Consequence` loop. Module
*content* is produced by the content/AI pipeline (`scriptRef`), never
hardcoded — the schema only carries structure + sequencing.

## Design system

`css/obsidian.css` exposes the Quiet Luxury palette (obsidian → graphite),
matte gold/silver passport-stamp accents, editorial sans typography, and
cinematic motion tokens (`--ease-cine`, blur/focus fades — no cartoon bounce).

See `PRICING_REVIEW.md` for the SaaS pricing strategy analysis.
