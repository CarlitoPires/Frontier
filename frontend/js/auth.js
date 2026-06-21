/* ============================================================
 *  LinguoBound — Authentication flow (Firebase Email/Password)
 *
 *  - Login + Sign-up (mode toggle on the same card).
 *  - On sign-up, creates the users/{uid} profile (role:user, plan:free)
 *    — the shape consumed by the Hard Gate + Mercado Pago later.
 *  - Routing: admins -> admin.html, everyone else -> dashboard.html.
 *  - FaceID button stays as a cinematic flourish; it only proceeds if a
 *    real session already exists (no fake bypass of real auth).
 *
 *  Security note: routing here is UX. Firestore Security Rules are the
 *  real guard (see firestore.rules).
 * ============================================================ */

import {
  auth,
  db,
  isAdmin,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "./firebase-init.js";

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const form = $("login-form");
  const emailEl = $("email");
  const passEl = $("password");
  const submitBtn = $("submit-btn");
  const errorEl = $("auth-error");
  const headingEl = $("auth-heading");
  const footText = $("auth-foot-text");
  const toggleLink = $("toggle-mode");
  const bioBtn = $("biometric-btn");
  const overlay = $("bio-overlay");
  const bioStatus = $("bio-status");

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  let mode = "login";          // "login" | "signup"
  let busy = false;
  let selectedLevel = "absolute_beginner";

  const levelField = $("level-field");
  const inviteField = $("invite-field");

  // Deterministic personal invite code + referral wiring.
  function inviteCodeFor(uid) { return uid.slice(0, 6).toUpperCase(); }
  async function setupReferral(uid, enteredCode) {
    try { await setDoc(doc(db, "inviteCodes", inviteCodeFor(uid)), { uid: uid }, { merge: true }); } catch (e) {}
    const code = (enteredCode || "").trim().toUpperCase();
    if (!code) return;
    try {
      const snap = await getDoc(doc(db, "inviteCodes", code));
      if (snap.exists()) {
        const inviterUid = snap.data().uid;
        if (inviterUid && inviterUid !== uid) {
          await setDoc(doc(db, "referrals", uid), { inviterUid: inviterUid, ts: serverTimestamp() });
        }
      }
    } catch (e) { /* ignore */ }
  }

  /* ---------- helpers ---------- */
  function setText(el, key) {
    el.setAttribute("data-i18n", key);   // keep language toggle correct
    el.textContent = I18n.t(key);
  }

  function showError(key) {
    errorEl.setAttribute("data-i18n", key);
    errorEl.textContent = I18n.t(key);
    errorEl.classList.add("show");
  }
  function clearError() {
    errorEl.classList.remove("show");
    errorEl.removeAttribute("data-i18n");
    errorEl.textContent = "";
  }

  function renderMode() {
    if (mode === "login") {
      setText(headingEl, "auth.citizenLogin");
      setText(submitBtn, "auth.enterCity");
      setText(footText, "auth.noCitizenship");
      setText(toggleLink, "auth.requestVisa");
      if (levelField) levelField.hidden = true;
      if (inviteField) inviteField.hidden = true;
    } else {
      setText(headingEl, "auth.citizenSignup");
      setText(submitBtn, "auth.createAccount");
      setText(footText, "auth.haveCitizenship");
      setText(toggleLink, "auth.doLogin");
      if (levelField) levelField.hidden = false;   // ask the level at sign-up
      if (inviteField) inviteField.hidden = false;
    }
  }

  // Level selector (segmented control).
  document.querySelectorAll(".level-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".level-opt").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedLevel = btn.dataset.level;
    });
  });

  function mapAuthError(code) {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
      case "auth/invalid-email":
        return "auth.errInvalid";
      case "auth/email-already-in-use":
        return "auth.errEmailInUse";
      case "auth/weak-password":
        return "auth.errWeakPass";
      default:
        return "auth.errGeneric";
    }
  }

  function fadeTo(url) {
    document.body.style.transition = "opacity 600ms var(--ease-cine)";
    document.body.style.opacity = "0";
    setTimeout(() => (window.location.href = url), 520);
  }

  async function routeAfterAuth(user) {
    const admin = await isAdmin(user);
    fadeTo(admin ? "admin.html" : "dashboard.html");
  }

  function setBusy(on, labelKey) {
    busy = on;
    submitBtn.disabled = on;
    submitBtn.style.opacity = on ? "0.7" : "";
    if (on && labelKey) submitBtn.textContent = I18n.t(labelKey);
    else renderMode();
  }

  /* ---------- submit (login or signup) ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (busy) return;
    clearError();

    const email = emailEl.value.trim();
    const pass = passEl.value;
    if (!email || !pass) { showError("auth.errEmptyFields"); return; }

    try {
      if (mode === "login") {
        setBusy(true, "auth.signingIn");
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        await routeAfterAuth(cred.user);
      } else {
        setBusy(true, "auth.creating");
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        // Create the citizen profile (must satisfy firestore.rules: role/user, plan/free).
        await setDoc(doc(db, "users", cred.user.uid), {
          email: email,
          displayName: email.split("@")[0],
          role: "user",
          plan: "free",
          level: selectedLevel,
          inviteCode: inviteCodeFor(cred.user.uid),
          nativeLang: I18n.getLang(),
          subscription: { provider: "mercadopago", status: "none", externalId: null, currentPeriodEnd: null },
          createdAt: serverTimestamp(),
        });
        await setupReferral(cred.user.uid, $("invite-code") && $("invite-code").value);
        // New accounts are never admin -> straight to the dashboard.
        fadeTo("dashboard.html");
      }
    } catch (err) {
      setBusy(false);
      showError(mapAuthError(err && err.code));
    }
  });

  /* ---------- mode toggle ---------- */
  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (busy) return;
    mode = mode === "login" ? "signup" : "login";
    clearError();
    renderMode();
  });

  /* ---------- Sign in with Google ---------- */
  const googleBtn = $("google-btn");
  googleBtn && googleBtn.addEventListener("click", async () => {
    if (busy) return;
    clearError();
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      // First-time Google users get a profile (satisfies firestore.rules).
      const ref = doc(db, "users", cred.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          email: cred.user.email,
          displayName: cred.user.displayName || (cred.user.email || "").split("@")[0],
          role: "user",
          plan: "free",
          level: selectedLevel,
          inviteCode: inviteCodeFor(cred.user.uid),
          nativeLang: I18n.getLang(),
          subscription: { provider: "mercadopago", status: "none", externalId: null, currentPeriodEnd: null },
          createdAt: serverTimestamp(),
        });
        await setupReferral(cred.user.uid, $("invite-code") && $("invite-code").value);
      }
      await routeAfterAuth(cred.user);
    } catch (err) {
      const code = err && err.code;
      // User simply dismissed the popup — not an error worth surfacing.
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      showError(mapAuthError(code));
    }
  });

  /* ---------- FaceID (cinematic; requires an existing session) ---------- */
  bioBtn.addEventListener("click", async () => {
    if (busy) return;
    clearError();
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");

    const stepKeys = ["auth.faceStep1", "auth.faceStep2", "auth.faceStep3", "auth.faceStep4"];
    for (const key of stepKeys) {
      bioStatus.textContent = I18n.t(key);
      await wait(820);
    }

    if (auth.currentUser) {
      overlay.classList.add("success");
      bioStatus.textContent = I18n.t("auth.faceConfirmed");
      await wait(800);
      await routeAfterAuth(auth.currentUser);
    } else {
      // No real credential yet — fall back to email/passphrase.
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
      showError("auth.bioNoSession");
    }
  });

  /* ---------- boot ---------- */
  renderMode();
})();
