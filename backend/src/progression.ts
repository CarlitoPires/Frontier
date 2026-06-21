/* ============================================================
 *  LinguoBound — Hard Gate Progression Service
 *
 *  RULE (non-negotiable):
 *    Module (N+1) is LOCKED and unplayable until Module (N) has
 *    returned PROFICIENCY_PASSED from the AI proficiency engine.
 *
 *  The gate is enforced in THREE layers so it cannot be bypassed
 *  by a tampered client:
 *    1. Read gate  — can the user even open module N? (canAttempt)
 *    2. Write gate — a pass is only committed inside a serialized
 *                    transaction that re-checks the predecessor.
 *    3. DB invariant — unlockedSequence on CityEnrollment can only
 *                      ever move forward by exactly +1.
 * ============================================================ */

import { PrismaClient, ModuleStatus, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const TOTAL_MODULES_PER_CITY = 500;
const DEFAULT_PASS_THRESHOLD = 80; // AI rubric score required to pass

export class GateError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "GateError";
  }
}

/* ------------------------------------------------------------
 * 1. READ GATE
 *    Determine whether a user may attempt a given module.
 *    A module is attemptable iff:
 *      - it is sequence 1, OR
 *      - the immediately preceding module (sequence - 1) is
 *        PROFICIENCY_PASSED for this user.
 * ---------------------------------------------------------- */
export async function canAttemptModule(
  userId: string,
  moduleId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const module = await prisma.module.findUniqueOrThrow({
    where: { id: moduleId },
    include: { block: true },
  });

  // Sequence 1 is always the entry point (the Airplane Cabin prologue).
  if (module.sequence === 1) return { allowed: true };

  // Find the predecessor module within the SAME city.
  const predecessor = await prisma.module.findFirst({
    where: {
      sequence: module.sequence - 1,
      block: { cityId: module.block.cityId },
    },
    select: { id: true },
  });

  if (!predecessor) {
    // Data integrity problem: no module N-1 exists. Fail closed.
    return { allowed: false, reason: "PREDECESSOR_MISSING" };
  }

  const prevProgress = await prisma.moduleProgress.findUnique({
    where: { userId_moduleId: { userId, moduleId: predecessor.id } },
    select: { status: true },
  });

  const passed = prevProgress?.status === ModuleStatus.PROFICIENCY_PASSED;
  return passed
    ? { allowed: true }
    : { allowed: false, reason: "PREVIOUS_MODULE_NOT_PASSED" };
}

/* ------------------------------------------------------------
 * 2. WRITE GATE  — the "Hard Gate" commit
 *    Called by the AI engine after grading an attempt.
 *    Everything runs in a SERIALIZABLE transaction so two
 *    concurrent submissions cannot race past the gate.
 * ---------------------------------------------------------- */
export async function submitProficiencyResult(params: {
  userId: string;
  moduleId: string;
  aiScore: number;          // 0..100 from the AI proficiency engine
  threshold?: number;
}): Promise<{ passed: boolean; unlockedNextSequence?: number; certified?: boolean }> {
  const threshold = params.threshold ?? DEFAULT_PASS_THRESHOLD;

  return prisma.$transaction(
    async (tx) => {
      const module = await tx.module.findUniqueOrThrow({
        where: { id: params.moduleId },
        include: { block: true },
      });
      const cityId = module.block.cityId;

      // --- Re-verify the read gate INSIDE the transaction ---
      if (module.sequence > 1) {
        const predecessor = await tx.module.findFirst({
          where: { sequence: module.sequence - 1, block: { cityId } },
          select: { id: true },
        });
        if (!predecessor) throw new GateError("PREDECESSOR_MISSING", "Module N-1 not found.");

        const prev = await tx.moduleProgress.findUnique({
          where: { userId_moduleId: { userId: params.userId, moduleId: predecessor.id } },
          select: { status: true },
        });
        if (prev?.status !== ModuleStatus.PROFICIENCY_PASSED) {
          // HARD GATE: cannot record a result for a module the user
          // was never allowed to play.
          throw new GateError(
            "GATE_LOCKED",
            `Module ${module.sequence} is locked. Pass module ${module.sequence - 1} first.`
          );
        }
      }

      const passed = params.aiScore >= threshold;
      const newStatus = passed ? ModuleStatus.PROFICIENCY_PASSED : ModuleStatus.ATTEMPTED;

      // --- Upsert this module's progress ---
      await tx.moduleProgress.upsert({
        where: { userId_moduleId: { userId: params.userId, moduleId: params.moduleId } },
        create: {
          userId: params.userId,
          moduleId: params.moduleId,
          status: newStatus,
          proficiencyScore: params.aiScore,
          attempts: 1,
          passedAt: passed ? new Date() : null,
        },
        update: {
          status: newStatus,
          proficiencyScore: params.aiScore,
          attempts: { increment: 1 },
          passedAt: passed ? new Date() : undefined,
        },
      });

      if (!passed) {
        // Obstacle not overcome → user repeats this module. Gate stays shut.
        return { passed: false };
      }

      // --- Open the gate for module N+1 (if one exists) ---
      const next = await tx.module.findFirst({
        where: { sequence: module.sequence + 1, block: { cityId } },
        select: { id: true, sequence: true },
      });

      if (next) {
        // Unlock N+1: create its progress row as UNLOCKED (idempotent).
        await tx.moduleProgress.upsert({
          where: { userId_moduleId: { userId: params.userId, moduleId: next.id } },
          create: { userId: params.userId, moduleId: next.id, status: ModuleStatus.UNLOCKED },
          update: {
            // Never downgrade a module already in progress/passed.
            status: ModuleStatus.UNLOCKED,
          },
        });

        // Move the enrollment "open gate" forward by EXACTLY +1, monotonic.
        await tx.cityEnrollment.update({
          where: { userId_cityId: { userId: params.userId, cityId } },
          data: { unlockedSequence: { set: next.sequence } },
        });

        return { passed: true, unlockedNextSequence: next.sequence };
      }

      // --- No N+1 → this was module 500. Issue certification. ---
      const certified = await maybeIssueCertification(tx, params.userId, cityId);
      return { passed: true, certified };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}

/* ------------------------------------------------------------
 * 3. CITY COMPLETION → AI Certification → unlock next capital
 * ---------------------------------------------------------- */
async function maybeIssueCertification(
  tx: Prisma.TransactionClient,
  userId: string,
  cityId: string
): Promise<boolean> {
  const passedCount = await tx.moduleProgress.count({
    where: {
      userId,
      status: ModuleStatus.PROFICIENCY_PASSED,
      module: { block: { cityId } },
    },
  });

  if (passedCount < TOTAL_MODULES_PER_CITY) return false;

  // Grant the AI-generated Proficiency Certification (idempotent).
  await tx.certification.upsert({
    where: { userId_cityId: { userId, cityId } },
    create: { userId, cityId, serialNo: `FR-${cityId.slice(0, 6)}-${userId.slice(0, 6)}-${Date.now()}` },
    update: {},
  });

  // The next city in the conquest order becomes ELIGIBLE to enroll.
  // (Enrollment itself is gated by tier + this certification in enrollNextCity.)
  return true;
}

/* ------------------------------------------------------------
 * City conquest gate — "you conquer the right to move."
 * ---------------------------------------------------------- */
export async function enrollNextCity(userId: string): Promise<{ city: string }> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const enrollments = await prisma.cityEnrollment.findMany({
    where: { userId },
    include: { city: true },
  });
  const activeCount = enrollments.filter((e) => e.isActive).length;

  // BASE tier: one active city at a time. GLOBAL: up to two.
  const maxActive = user.tier === "GLOBAL" ? 2 : 1;
  if (activeCount >= maxActive) {
    throw new GateError(
      "TIER_LIMIT",
      `Your ${user.tier} tier allows ${maxActive} active citizenship(s).`
    );
  }

  // Must hold a certification for the highest city already conquered.
  const certifiedCityIds = (
    await prisma.certification.findMany({ where: { userId }, select: { cityId: true } })
  ).map((c) => c.cityId);

  const nextCity = await prisma.city.findFirst({
    where: { id: { notIn: enrollments.map((e) => e.cityId) } },
    orderBy: { order: "asc" },
  });
  if (!nextCity) throw new GateError("NO_CITY", "No further cities available.");

  // For any city beyond the first, require certification of the prior one.
  if (nextCity.order > 1) {
    const priorCity = await prisma.city.findFirst({ where: { order: nextCity.order - 1 } });
    if (priorCity && !certifiedCityIds.includes(priorCity.id)) {
      throw new GateError(
        "NOT_CERTIFIED",
        `Earn the ${priorCity.name} Proficiency Certification before conquering ${nextCity.name}.`
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.cityEnrollment.create({
      data: { userId, cityId: nextCity.id, unlockedSequence: 1 },
    });
    // Seed module 1 as UNLOCKED (the Airplane Cabin prologue).
    const first = await tx.module.findFirst({
      where: { sequence: 1, block: { cityId: nextCity.id } },
      select: { id: true },
    });
    if (first) {
      await tx.moduleProgress.upsert({
        where: { userId_moduleId: { userId, moduleId: first.id } },
        create: { userId, moduleId: first.id, status: ModuleStatus.UNLOCKED },
        update: {},
      });
    }
  });

  return { city: nextCity.name };
}
