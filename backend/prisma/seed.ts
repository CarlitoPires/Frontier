/* ============================================================
 *  FRONTIER — Seed generator
 *  Programmatically builds the 20 Blocks × 25 Modules = 500
 *  matrix per city. Module *content* (Action/Obstacle/Consequence
 *  text) is authored/generated in the content pipeline — here we
 *  only build the structural skeleton + sequencing for the gate.
 * ============================================================ */

import { PrismaClient, ObstacleType } from "@prisma/client";

const prisma = new PrismaClient();

const BLOCKS = [
  // Phase 1 — Immediate Survival
  { title: "Airplane Cabin (Prologue)", phase: 1 },
  { title: "Airport Landing",           phase: 1 },
  { title: "Customs Control",           phase: 1 },
  { title: "Logistics (SIM / Taxi)",    phase: 1 },
  // Phase 2 — Social Base
  { title: "Accommodation Check-in",    phase: 2 },
  { title: "Utilities & Supermarket",   phase: 2 },
  { title: "Bank Bureaucracy",          phase: 2 },
  { title: "Urban Navigation",          phase: 2 },
  // Phase 3 & 4 — Integration
  { title: "Nightlife & Culture",       phase: 3 },
  { title: "Gastronomy",                phase: 3 },
  { title: "Professional Networking",   phase: 3 },
  { title: "Job Interviews",            phase: 3 },
  { title: "Interpersonal Relationships", phase: 3 },
  { title: "Healthcare & Emergencies",  phase: 4 },
  { title: "Police Interactions",       phase: 4 },
  { title: "Housing Contracts",         phase: 4 },
  { title: "Civic & Legal Systems",     phase: 4 },
  { title: "Advanced Workplace",        phase: 4 },
  { title: "Community Integration",     phase: 4 },
  { title: "Mastery & Certification",   phase: 4 },
];

const OBSTACLE_CYCLE: ObstacleType[] = [
  ObstacleType.LANGUAGE,
  ObstacleType.SOCIAL,
  ObstacleType.NOISE,
];

async function seedCity(name: string, language: string, order: number, isDefault = false) {
  const city = await prisma.city.upsert({
    where: { name },
    update: {},
    create: { name, language, order, isDefault },
  });

  let sequence = 0;
  for (let b = 0; b < BLOCKS.length; b++) {
    const blockDef = BLOCKS[b];
    const block = await prisma.block.upsert({
      where: { cityId_index: { cityId: city.id, index: b + 1 } },
      update: {},
      create: { cityId: city.id, index: b + 1, title: blockDef.title, phase: blockDef.phase },
    });

    for (let m = 0; m < 25; m++) {
      sequence += 1; // global 1..500
      await prisma.module.upsert({
        where: { blockId_indexInBlock: { blockId: block.id, indexInBlock: m + 1 } },
        update: { sequence },
        create: {
          blockId: block.id,
          sequence,
          indexInBlock: m + 1,
          title: `${blockDef.title} — Scene ${m + 1}`,
          obstacle: OBSTACLE_CYCLE[(b + m) % OBSTACLE_CYCLE.length],
          scriptRef: `content/${name.toLowerCase()}/b${b + 1}/m${m + 1}`,
        },
      });
    }
  }
  console.log(`Seeded ${name}: ${sequence} modules.`); // expect 500
}

async function main() {
  await seedCity("London", "en", 1, true);
  await seedCity("Berlin", "en", 2);
  await seedCity("Madrid", "es", 3);
  await seedCity("New York", "en", 4);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
