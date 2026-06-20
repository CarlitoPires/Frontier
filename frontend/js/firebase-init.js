/* ============================================================
 *  FRONTIER — Firebase connector (Spark plan: Auth + Firestore)
 *
 *  Zero-build: imports the modular Firebase SDK straight from the
 *  gstatic CDN, so it works by just opening the HTML (no bundler).
 *
 *  HOW TO USE:
 *   1. Create your Firebase project (see docs/FIREBASE_SETUP.md).
 *   2. Paste your web app config into FIREBASE_CONFIG below.
 *   3. import { auth, db } from "./firebase-init.js" in a
 *      <script type="module">.
 *
 *  SECURITY: the values here are NOT secrets — Firebase web config
 *  is public by design. Real protection comes from Firebase Auth +
 *  Firestore Security Rules (see firestore.rules), never from hiding
 *  these keys.
 * ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ⬇️ Replace every value with your own from the Firebase console.
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

// True once real keys are pasted in. Lets the admin UI render in a safe
// "preview mode" (no auth calls) until Firebase is actually configured.
export const CONFIG_READY = FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";

// Re-export the handful of helpers the app uses, so callers import
// everything from one place.
export { onAuthStateChanged, signInWithEmailAndPassword, signOut, doc, getDoc };

/**
 * Resolve whether the signed-in user is an admin.
 * Primary check: a custom claim { admin: true } (set server-side / CLI).
 * Fallback: a users/{uid} doc with role === "admin".
 * NOTE: this is a UX gate only — Firestore Rules are the real guard.
 */
export async function isAdmin(user) {
  if (!user) return false;
  try {
    const token = await user.getIdTokenResult();
    if (token.claims && token.claims.admin === true) return true;
  } catch (e) { /* ignore */ }
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    return snap.exists() && snap.data().role === "admin";
  } catch (e) {
    return false;
  }
}

/* ------------------------------------------------------------
 * MONETIZATION DATA MODEL (prepared for Mercado Pago later)
 *
 * users/{uid} {
 *   email: string,
 *   displayName: string,
 *   role: "user" | "admin",
 *   plan: "free" | "pro",
 *   nativeLang: "pt-BR",
 *   subscription: {
 *     provider: "mercadopago",
 *     status: "none" | "pending" | "active" | "past_due" | "canceled",
 *     externalId: string | null,   // Mercado Pago preapproval id
 *     currentPeriodEnd: Timestamp | null
 *   },
 *   createdAt: Timestamp
 * }
 *
 * Aggregates for the admin dashboard (written by Cloud Functions / jobs):
 * metrics/{day} { freeUsers, proUsers, mrr, churn, ... }
 * ---------------------------------------------------------- */
