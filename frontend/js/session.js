/* ============================================================
 *  LinguoBound — Session guard (auth-gated pages)
 *
 *  Used by dashboard.html and simulation.html:
 *   - Redirects to the login page when no user is signed in.
 *   - Loads the real users/{uid} profile from Firestore.
 *   - Applies the citizen's saved language (profile.nativeLang).
 *   - Exposes window.LB_SESSION and fires "lb:session" so page
 *     scripts (dashboard.js / hud.js) can render real data.
 *   - Wires any #signout-btn.
 *
 *  Security note: this redirect is UX. Firestore Security Rules are
 *  the real guard for the data itself.
 * ============================================================ */

import { auth, db, onAuthStateChanged, signOut, doc, getDoc, CONFIG_READY } from "./firebase-init.js";

(function () {
  "use strict";

  const veil = document.getElementById("lb-veil");
  const hideVeil = () => veil && veil.classList.add("hidden");
  const toLogin = () => window.location.replace("index.html");

  // Sign-out works regardless of where it lives on the page.
  const signoutBtn = document.getElementById("signout-btn");
  if (signoutBtn) {
    signoutBtn.addEventListener("click", async () => {
      try { if (CONFIG_READY) await signOut(auth); } catch (e) { /* ignore */ }
      toLogin();
    });
  }

  // Without real keys we can't gate — let the page render (dev only).
  if (!CONFIG_READY) { hideVeil(); return; }

  onAuthStateChanged(auth, async (user) => {
    if (!user) { toLogin(); return; }

    let profile = null;
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) profile = snap.data();
    } catch (e) { /* rules / network — fall back to mock */ }

    // Honor the citizen's saved language from their real profile.
    if (profile && profile.nativeLang && window.I18n &&
        I18n.SUPPORTED.indexOf(profile.nativeLang) !== -1) {
      I18n.setLang(profile.nativeLang);
    }

    window.LB_SESSION = { user: user, profile: profile };
    window.dispatchEvent(new CustomEvent("lb:session", { detail: window.LB_SESSION }));
    hideVeil();
  });
})();
