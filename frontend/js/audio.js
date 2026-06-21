/* ============================================================
 *  LinguoBound — Audio-driven pressure engine  (window.LBAudio)
 *
 *  100% client-side / Spark-friendly:
 *   - NPC voices via the Web Speech API (SpeechSynthesis).
 *   - Ambience is SYNTHESIZED with the Web Audio API (filtered noise +
 *     an LFO swell) — no audio files, no CDN, no server.
 *
 *  Soundscapes by narrative phase:
 *    Phase 1 → turbine rumble (brown noise, low-pass)
 *    Phase 2 → terminal echo  (airy noise, band-pass + slow swell)
 *    Phase 3 → rainy street   (hiss + traffic, high-pass over low bed)
 *
 *  Pressure: ambient gain tracks the live noise meter (setIntensity) and
 *  the scene mood; the bed ducks while an NPC speaks so voices stay clear.
 *
 *  Browser autoplay policy: audio + speech need a user gesture. We unlock
 *  on the first interaction (and via the on-screen sound toggle), then
 *  (re)speak the pending line.
 * ============================================================ */

(function (global) {
  "use strict";

  const supportsAudio = typeof (global.AudioContext || global.webkitAudioContext) === "function";
  const supportsTTS = "speechSynthesis" in global;
  const SR = global.SpeechRecognition || global.webkitSpeechRecognition;
  const supportsSTT = typeof SR === "function";

  let ctx = null;
  let master = null;       // master gain -> destination
  let ambientGain = null;  // ambient bed gain (ducked while speaking)
  let lfo = null, lfoGain = null;
  let source = null, filter = null;

  let unlocked = false;
  let muted = false;
  let listening = false;   // ducks the bed while the mic is open
  let scene = { phase: 1, mood: "neutral", baseNoise: 40, rain: false };
  let intensity = 0.5;     // 0..1, from the live noise meter
  let pendingText = null;  // line to (re)speak once unlocked
  let speaking = false;
  let rainSrc = null, rainFilter = null;

  /* ---------- noise buffers ---------- */
  function makeNoise(type) {
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    if (type === "brown") {
      let last = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    } else {
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; // white
    }
    return buf;
  }

  function soundscape() {
    // Returns { noise, filterType, freq, q } for the current scene.
    if (scene.phase === 1) return { noise: "brown", filterType: "lowpass", freq: 340, q: 0.7 };
    if (scene.phase === 2) return { noise: "white", filterType: "bandpass", freq: 900, q: 0.6 };
    return { noise: "white", filterType: "highpass", freq: 1400, q: 0.5 };       // phase 3
  }

  function moodFactor() {
    return scene.mood === "hostile" ? 1.25 : scene.mood === "pleased" ? 0.7 : 1.0;
  }

  function targetGain() {
    // Bed loudness from baseNoise, modulated by the live meter + mood.
    const base = Math.min(1, (scene.baseNoise || 40) / 100);
    const dynamic = 0.45 + 0.55 * intensity;     // meter pushes it up
    return Math.min(0.6, base * dynamic * moodFactor() * 0.6);
  }

  function buildGraph() {
    if (!ctx) return;
    // tear down old source/filter
    if (source) { try { source.stop(); } catch (e) {} source.disconnect(); }
    if (filter) filter.disconnect();
    if (lfo) { try { lfo.stop(); } catch (e) {} lfo.disconnect(); }

    const s = soundscape();
    source = ctx.createBufferSource();
    source.buffer = makeNoise(s.noise);
    source.loop = true;

    filter = ctx.createBiquadFilter();
    filter.type = s.filterType;
    filter.frequency.value = s.freq;
    filter.Q.value = s.q;

    source.connect(filter);
    filter.connect(ambientGain);

    // Swell/fluctuation — faster & deeper when hostile.
    lfo = ctx.createOscillator();
    lfoGain = ctx.createGain();
    lfo.frequency.value = scene.mood === "hostile" ? 0.35 : 0.15;
    lfoGain.gain.value = (scene.mood === "hostile" ? 0.18 : 0.08);
    lfo.connect(lfoGain);
    lfoGain.connect(ambientGain.gain);

    source.start();
    lfo.start();

    // Optional second layer: rain hiss (complex ambient overlap).
    if (rainSrc) { try { rainSrc.stop(); } catch (e) {} rainSrc.disconnect(); rainSrc = null; }
    if (rainFilter) { rainFilter.disconnect(); rainFilter = null; }
    if (scene.rain) {
      rainSrc = ctx.createBufferSource();
      rainSrc.buffer = makeNoise("white");
      rainSrc.loop = true;
      rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "highpass";
      rainFilter.frequency.value = 2600;
      rainFilter.Q.value = 0.4;
      rainSrc.connect(rainFilter);
      rainFilter.connect(ambientGain);
      rainSrc.start();
    }

    applyGain(0.4);
  }

  function applyGain(ramp) {
    if (!ambientGain || !ctx) return;
    const duck = (speaking || listening);
    const g = muted ? 0 : (duck ? targetGain() * 0.22 : targetGain());
    ambientGain.gain.cancelScheduledValues(ctx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(Math.max(0.0001, g), ctx.currentTime + (ramp || 0.25));
  }

  /* ---------- public API ---------- */
  function init() {
    if (ctx || !supportsAudio) return;
    const AC = global.AudioContext || global.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
    ambientGain = ctx.createGain(); ambientGain.gain.value = 0.0001; ambientGain.connect(master);
  }

  function unlock() {
    if (unlocked) return;
    init();
    if (ctx && ctx.state === "suspended") ctx.resume();
    unlocked = true;
    if (supportsAudio) buildGraph();
    if (pendingText) speakLine(pendingText);   // speak the line the user is on
  }

  function setScene(s) {
    scene = {
      phase: (s && s.phase) || 1,
      mood: (s && s.mood) || "neutral",
      baseNoise: (s && typeof s.baseNoise === "number") ? s.baseNoise : 40,
      rain: !!(s && s.rain),
    };
    if (unlocked && supportsAudio) buildGraph();
  }

  function setIntensity(x) {
    intensity = Math.max(0, Math.min(1, x || 0));
    applyGain(0.5);
  }

  function pickVoice() {
    if (!supportsTTS) return null;
    const voices = global.speechSynthesis.getVoices() || [];
    return voices.find((v) => /en-GB/i.test(v.lang)) ||
           voices.find((v) => /^en/i.test(v.lang)) || null;
  }

  function speakLine(text, rate) {
    if (!text) return;
    pendingText = text;
    if (!supportsTTS || !unlocked) return;   // will (re)speak on unlock
    try {
      global.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-GB";
      u.rate = rate || 1.0;
      u.pitch = 1.0;
      const v = pickVoice();
      if (v) u.voice = v;
      u.onstart = () => { speaking = true; applyGain(0.15); };
      u.onend = () => { speaking = false; applyGain(0.4); };
      u.onerror = () => { speaking = false; applyGain(0.4); };
      global.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  function replay(rate) { if (pendingText) { unlock(); speakLine(pendingText, rate); } }

  /* ---------- speech recognition (voice scoring) ---------- */
  function canListen() { return supportsSTT; }

  function startListen(opts) {
    if (!supportsSTT) return null;
    opts = opts || {};
    // Don't let the mic capture the NPC's own voice; hush the bed too.
    if (supportsTTS) { try { global.speechSynthesis.cancel(); } catch (e) {} }
    listening = true; applyGain(0.12);

    let rec;
    try { rec = new SR(); } catch (e) { listening = false; applyGain(0.3); return null; }
    rec.lang = opts.lang || "en-GB";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onresult = (e) => {
      const r = e.results && e.results[0] && e.results[0][0];
      if (r && opts.onresult) opts.onresult(r.transcript, r.confidence);
    };
    rec.onerror = (e) => { if (opts.onerror) opts.onerror(e && e.error); };
    rec.onend = () => {
      listening = false; applyGain(0.3);
      if (opts.onend) opts.onend();
    };
    try { rec.start(); } catch (e) { /* already started */ }
    return rec;
  }

  function toggleMute() {
    unlock();
    muted = !muted;
    applyGain(0.2);
    return muted;
  }

  function isMuted() { return muted; }

  // Unlock on the very first user gesture anywhere on the page.
  function gestureUnlock() { unlock(); }
  global.addEventListener("pointerdown", gestureUnlock, { once: true });
  global.addEventListener("keydown", gestureUnlock, { once: true });

  // Some browsers populate voices asynchronously.
  if (supportsTTS) global.speechSynthesis.onvoiceschanged = pickVoice;

  global.LBAudio = {
    setScene, setIntensity, speakLine, replay, toggleMute, isMuted, unlock,
    canListen, startListen,
    supported: supportsAudio || supportsTTS,
  };
})(window);
