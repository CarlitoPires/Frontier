/* ============================================================
 *  LinguoBound — Daily Streak + Visa Tiers (the addiction loop)
 *
 *  CREATIVE HOOK — "Your streak is your immigration status."
 *  The daily survival streak ('ofensiva diária') maps to a Visa Tier:
 *      Tourist (0–2) → Resident (3–6) → Citizen (7–13) → Diplomat (14+)
 *  Letting the streak lapse DOWNGRADES your visa — loss aversion fused
 *  with identity investment (you don't lose points, you lose status).
 *
 *  Safety net: a "Streak Shield" is earned every 5 days and is spent
 *  automatically to protect the run if you miss a day — the near-miss
 *  reprieve that keeps users coming back.
 *
 *  Pure functions (no Firestore); session.js persists the result.
 * ============================================================ */

export function todayStr(d) {
  d = d || new Date();
  return d.toISOString().slice(0, 10);   // YYYY-MM-DD (UTC)
}

export function dayDiff(a, b) {
  const da = new Date(a + "T00:00:00Z");
  const db = new Date(b + "T00:00:00Z");
  return Math.round((db - da) / 86400000);
}

// prev: { count, best, lastDay, shields } | null  ->  next state + event
export function computeStreak(prev, today) {
  today = today || todayStr();
  if (!prev || !prev.lastDay) {
    return { count: 1, best: 1, lastDay: today, shields: 0, event: "start" };
  }
  if (prev.lastDay === today) {
    return { count: prev.count || 1, best: prev.best || 1, lastDay: today, shields: prev.shields || 0, event: "same" };
  }
  const diff = dayDiff(prev.lastDay, today);
  if (diff === 1) {
    const count = (prev.count || 0) + 1;
    const earnsShield = count % 5 === 0;
    return {
      count: count,
      best: Math.max(prev.best || 0, count),
      lastDay: today,
      shields: (prev.shields || 0) + (earnsShield ? 1 : 0),
      event: earnsShield ? "shield_earned" : "increment",
    };
  }
  if (diff >= 2 && (prev.shields || 0) > 0) {
    // A shield protects the run through the missed day(s).
    const count = (prev.count || 0) + 1;
    return {
      count: count,
      best: Math.max(prev.best || 0, count),
      lastDay: today,
      shields: (prev.shields || 0) - 1,
      event: "shield_used",
    };
  }
  // Streak broken — visa downgrade.
  return { count: 1, best: Math.max(prev.best || 0, 1), lastDay: today, shields: prev.shields || 0, event: "reset" };
}

export function visaTier(count) {
  if (count >= 14) return "diplomat";
  if (count >= 7) return "citizen";
  if (count >= 3) return "resident";
  return "tourist";
}
