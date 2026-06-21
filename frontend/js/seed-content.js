/* ============================================================
 *  LinguoBound — Content seeder (admin only)
 *  Writes every bundled module to Firestore content/{sequence}.
 *  Allowed by firestore.rules only for admins.
 * ============================================================ */

import { db, doc, setDoc } from "./firebase-init.js";
import { CONTENT_MODULES } from "./content-registry.js";

export async function seedAllContent() {
  let n = 0;
  for (const m of CONTENT_MODULES) {
    await setDoc(doc(db, "content", String(m.sequence)), m, { merge: true });
    n += 1;
  }
  return n;
}
