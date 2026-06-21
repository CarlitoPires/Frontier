/* ============================================================
 *  LinguoBound — Session guard + progression engine (Spark-friendly)
 *
 *  Shared by dashboard.html and simulation.html.
 *
 *  RESPONSIBILITIES
 *   - Auth gate: redirect to login when signed out.
 *   - Load real users/{uid} profile + progress/{uid} summary.
 *   - Apply the citizen's saved language (profile.nativeLang).
 *   - Hard Gate (read side): on the simulation page, refuse to open a
 *     module whose PREDECESSOR module doc isn't PROFICIENCY_PASSED — the
 *     predecessor doc is write-protected by rules, so this can't be faked.
 *   - Expose window.LBProgress.submit(score): writes the attempt + (if the
 *     score clears the threshold) advances the gate, in a batched write
 *     that Firestore Security Rules independently re-validate.
 *   - Fire "lb:session" so dashboard.js / hud.js can render real data.
 *
 *  SECURITY (Spark / no Cloud Functions):
 *   The ORDERING gate is fully enforced by firestore.rules (you cannot
 *   write PASS for N without N-1 passed + score>=threshold). The score is
 *   still computed client-side, so a determined attacker could forge a
 *   passing score for the *current* module — closing that hole requires a
 *   trusted backend (App Check + Functions/Blaze, or our Node service).
 * ============================================================ */

import {
  auth, db, onAuthStateChanged, signOut,
  doc, getDoc, serverTimestamp, writeBatch, increment, CONFIG_READY,
} from "./firebase-init.js";
import { BLOCK0_BY_SEQUENCE } from "./content-block0.js";

(function () {
  "use strict";

  const PASS_THRESHOLD = 80;       // must match firestore.rules passThreshold()
  const TOTAL_MODULES = 500;

  const veil = document.getElementById("lb-veil");
  const hideVeil = () => veil && veil.classList.add("hidden");
  const toLogin = () => window.location.replace("index.html");
  const toDashboard = () => window.location.replace("dashboard.html");
  const isSimPage = document.body.classList.contains("sim-body");

  const blockOf = (seq) => Math.ceil(seq / 25);              // 1..20
  const indexInBlock = (seq) => ((seq - 1) % 25) + 1;        // 1..25

  // Public progression API (consumed by the classic hud.js / dashboard.js).
  const LBProgress = {
    ready: false,
    uid: null,
    level: "absolute_beginner",
    unlockedSequence: 1,
    completedCount: 0,
    module: null,            // the module being played on the sim page
    submit: submitResult,
  };
  window.LBProgress = LBProgress;

  /* ---------- sign out ---------- */
  const signoutBtn = document.getElementById("signout-btn");
  if (signoutBtn) {
    signoutBtn.addEventListener("click", async () => {
      try { if (CONFIG_READY) await signOut(auth); } catch (e) { /* ignore */ }
      toLogin();
    });
  }

  /* ---------- write a result (attempt + gate advance) ---------- */
  async function submitResult(score) {
    const uid = LBProgress.uid;
    const mod = LBProgress.module;
    if (!CONFIG_READY || !uid || !mod) return { passed: score >= PASS_THRESHOLD, written: false };

    const passed = score >= PASS_THRESHOLD;
    const modRef = doc(db, "progress", uid, "modules", String(mod.sequence));
    const sumRef = doc(db, "progress", uid);

    // Read current state to avoid double-counting on replays.
    let existing = null;
    try { const s = await getDoc(modRef); if (s.exists()) existing = s.data(); } catch (e) { /* ignore */ }
    const newlyPassed = passed && (!existing || existing.status !== "PROFICIENCY_PASSED");

    const batch = writeBatch(db);
    batch.set(modRef, {
      sequence: mod.sequence,
      status: passed ? "PROFICIENCY_PASSED" : "ATTEMPTED",
      score: Math.round(score),
      attempts: increment(1),
      updatedAt: serverTimestamp(),
      passedAt: passed ? serverTimestamp() : null,
      blockId: mod.blockId,
      title: mod.title,
    }, { merge: true });

    if (newlyPassed) {
      const newUnlocked = Math.max(LBProgress.unlockedSequence, mod.sequence + 1);
      batch.set(sumRef, {
        unlockedSequence: newUnlocked,
        completedCount: increment(1),
        activeCity: "London",
        lastModuleId: String(mod.sequence),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      LBProgress.unlockedSequence = newUnlocked;
      LBProgress.completedCount += 1;
    }

    try {
      await batch.commit();
      return { passed, newlyPassed, written: true };
    } catch (e) {
      // Rules rejected the write (e.g. tampered sequence) — fail closed.
      console.warn("[LinguoBound] progress write rejected:", e && e.code);
      return { passed, newlyPassed: false, written: false, error: e && e.code };
    }
  }

  /* ---------- content loader (Firestore content/{seq} + fallback) ---------- */
  async function loadContent(seq) {
    let content = null;
    try {
      const c = await getDoc(doc(db, "content", String(seq)));
      if (c.exists()) content = c.data();
    } catch (e) { /* not signed in / rules / network */ }
    if (!content) content = BLOCK0_BY_SEQUENCE[seq] || null;  // bundled fallback
    return content;
  }

  /* ---------- read-side Hard Gate (sim page) ---------- */
  async function resolveSimModule(uid, unlocked) {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("seq") || params.get("module");
    let requested = raw ? parseInt(raw, 10) : unlocked;
    if (!Number.isFinite(requested) || requested < 1) requested = unlocked;
    requested = Math.min(requested, TOTAL_MODULES);

    // Authoritative check: predecessor module doc must be PASSED (or seq==1).
    if (requested > 1) {
      let ok = false;
      try {
        const prev = await getDoc(doc(db, "progress", uid, "modules", String(requested - 1)));
        ok = prev.exists() && prev.data().status === "PROFICIENCY_PASSED";
      } catch (e) { ok = false; }
      if (!ok) { toDashboard(); return null; }   // unearned -> bounce back
    }

    const content = await loadContent(requested);
    return {
      sequence: requested,
      blockId: blockOf(requested),
      indexInBlock: indexInBlock(requested),
      title: (content && content.sceneTitle && content.sceneTitle.en) || "Module " + requested,
      content: content,
    };
  }

  /* ---------- preview fallback (no Firebase keys) ---------- */
  if (!CONFIG_READY) {
    if (isSimPage) {
      const content = BLOCK0_BY_SEQUENCE[1] || null;
      LBProgress.module = { sequence: 1, blockId: 1, indexInBlock: 1, title: "Boarding", content: content };
    }
    LBProgress.level = "absolute_beginner";
    LBProgress.ready = true;
    hideVeil();
    return;
  }

  /* ---------- boot ---------- */
  onAuthStateChanged(auth, async (user) => {
    if (!user) { toLogin(); return; }
    LBProgress.uid = user.uid;

    let profile = null, summary = null;
    try { const s = await getDoc(doc(db, "users", user.uid)); if (s.exists()) profile = s.data(); } catch (e) {}
    try { const s = await getDoc(doc(db, "progress", user.uid)); if (s.exists()) summary = s.data(); } catch (e) {}

    const unlocked = (summary && summary.unlockedSequence) || 1;
    const completed = (summary && summary.completedCount) || 0;
    LBProgress.unlockedSequence = unlocked;
    LBProgress.completedCount = completed;
    LBProgress.level = (profile && profile.level) || "absolute_beginner";

    // Apply the citizen's saved language.
    if (profile && profile.nativeLang && window.I18n &&
        I18n.SUPPORTED.indexOf(profile.nativeLang) !== -1) {
      I18n.setLang(profile.nativeLang);
    }

    // Hard Gate (read side) on the simulation page.
    if (isSimPage) {
      const mod = await resolveSimModule(user.uid, unlocked);
      if (!mod) return; // redirected away
      LBProgress.module = mod;
    }

    LBProgress.ready = true;
    window.LB_SESSION = {
      user: user, profile: profile, progress: summary,
      unlockedSequence: unlocked, completedCount: completed,
      level: LBProgress.level,
      module: LBProgress.module,
    };
    window.dispatchEvent(new CustomEvent("lb:session", { detail: window.LB_SESSION }));
    hideVeil();
  });
})();
