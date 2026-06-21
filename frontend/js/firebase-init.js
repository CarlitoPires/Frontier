/* ============================================================
 *  LinguoBound — Firebase connector (Spark plan: Auth + Firestore)
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
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Firebase web config (public identifiers — safe to commit; not secrets).
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCcsw4u7o_-j4L55nXYXFyNbmNHd2BHBBK",
  authDomain: "frontier-prod-fa7aa.firebaseapp.com",
  projectId: "frontier-prod-fa7aa",
  storageBucket: "frontier-prod-fa7aa.firebasestorage.app",
  messagingSenderId: "956563322989",
  appId: "1:956563322989:web:83170ac3ce5b53e807a764",
  measurementId: "G-ERDK5VTJ6B",
};

export const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

// True once real keys are pasted in. (Now configured.)
export const CONFIG_READY = FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";

// Re-export the helpers the app uses, so callers import from one place.
export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
};

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
