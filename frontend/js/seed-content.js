/* ============================================================
 *  LinguoBound — Content seeder (admin only)
 *  Writes the bundled Block Zero modules (City 01: London Immersion,
 *  modules 01–20) to Firestore content/{sequence}.
 *  Allowed by firestore.rules only for admins.
 * ============================================================ */

import { db, doc, setDoc } from "./firebase-init.js";
import { BLOCK0_MODULES } from "./content-block0.js";

export async function seedBlockZero() {
  let n = 0;
  for (const m of BLOCK0_MODULES) {
    await setDoc(doc(db, "content", String(m.sequence)), m, { merge: true });
    n += 1;
  }
  return n;
}
