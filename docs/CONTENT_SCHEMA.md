# LinguoBound — Module Content Schema

Scenes live in the Firestore **`content`** collection, one document per module,
**doc id = the global sequence** (`"1"`..`"500"`) — the same id convention used by
`progress/{uid}/modules/{id}`, so a module's gate state and its content line up.

`content` is readable by any signed-in user and writable only by admins
(see `firestore.rules`). The client loader (`session.js`) fetches
`content/{sequence}`; if it's absent it falls back to bundled data so the app
never shows an empty scene.

## Document shape

```jsonc
{
  "sequence": 1,                 // int, matches the doc id
  "blockId": 1,                  // int 1..20
  "indexInBlock": 1,             // int 1..25
  "threshold": 80,               // pass mark (must be >= rules' threshold, 80)

  // Localized strings: { "en": "...", "pt-BR": "..." }
  "sceneTitle":        { "en": "...", "pt-BR": "..." },
  "contextDescription":{ "en": "...", "pt-BR": "..." },  // background environment

  // Drives the cinematic stage + starting noise.
  "environment": { "mood": "hostile" | "neutral" | "pleased", "baseNoise": 0-100 },

  "npc": {
    "name": { "en": "...", "pt-BR": "..." },
    "initials": "BO"
  },

  "dialogueSteps": [
    {
      "text":   "English line the NPC says (LEARNING CONTENT — never translated)",
      "tr":     { "en": "plain-English gloss", "pt-BR": "tradução mental" },
      "ear":    { "en": "pronunciation tip", "pt-BR": "dica de pronúncia" },
      "audioPrompt": "Voice cue for the student (TTS/earpiece): tone + line",
      "basic":  "Short suggested reply (EN)",
      "fluent": "Natural suggested reply (EN)"
    }
  ]
}
```

### Rules / conventions
- `text`, `basic`, `fluent` are the **English learning content** and must stay English.
- `tr` and `ear` are per-UI-language (the mental translation + pronunciation coaching).
- `audioPrompt` is the spoken cue for the student's earpiece/TTS layer.
- `threshold` should be **≥ 80** (the value enforced by `firestore.rules`); a lower
  value would let the HUD show a pass that the Hard Gate then rejects.
- Seed/update from the Admin Command Center → Credenciais → "Popular conteúdo",
  or via the Firebase CLI.
