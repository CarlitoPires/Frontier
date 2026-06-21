/* ============================================================
 *  LinguoBound — API routes (Express) showing the gate in action.
 *  Every "play" request passes through canAttemptModule first.
 * ============================================================ */

import express, { Request, Response, NextFunction } from "express";
import { canAttemptModule, submitProficiencyResult, enrollNextCity, GateError } from "./progression";

export const router = express.Router();

// Pretend auth middleware sets req.userId from a verified session/JWT.
interface AuthedRequest extends Request { userId?: string; }

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.userId) return res.status(401).json({ error: "UNAUTHENTICATED" });
  next();
}

/* GET /api/modules/:id/attempt
 * READ GATE: refuses to start a locked module. */
router.get("/modules/:id/attempt", requireAuth, async (req: AuthedRequest, res) => {
  const gate = await canAttemptModule(req.userId!, req.params.id);
  if (!gate.allowed) {
    return res.status(423).json({ error: "MODULE_LOCKED", reason: gate.reason }); // 423 Locked
  }
  // ...load the module script / open the AI NPC session...
  res.json({ ok: true, moduleId: req.params.id });
});

/* POST /api/modules/:id/grade
 * WRITE GATE: AI engine posts its proficiency score here. */
router.post("/modules/:id/grade", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { aiScore } = req.body as { aiScore: number };
    const result = await submitProficiencyResult({
      userId: req.userId!,
      moduleId: req.params.id,
      aiScore,
    });
    res.json(result);
  } catch (e) {
    if (e instanceof GateError) return res.status(423).json({ error: e.code, message: e.message });
    throw e;
  }
});

/* POST /api/cities/next  — conquer the right to the next capital. */
router.post("/cities/next", requireAuth, async (req: AuthedRequest, res) => {
  try {
    res.json(await enrollNextCity(req.userId!));
  } catch (e) {
    if (e instanceof GateError) return res.status(403).json({ error: e.code, message: e.message });
    throw e;
  }
});
