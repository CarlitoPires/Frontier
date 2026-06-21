/* ============================================================
 *  LinguoBound — Content seeder (admin only)
 *  Writes the bundled Customs modules to Firestore content/{sequence}.
 *  Allowed by firestore.rules only for admins.
 * ============================================================ */

import { db, doc, setDoc } from "./firebase-init.js";
import { CUSTOMS_MODULES } from "./content-customs.js";

export async function seedCustoms() {
  let n = 0;
  for (const m of CUSTOMS_MODULES) {
    await setDoc(doc(db, "content", String(m.sequence)), m, { merge: true });
    n += 1;
  }
  return n;
}
