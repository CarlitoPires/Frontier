/* ============================================================
 *  LinguoBound — Content registry
 *  Merges all authored blocks into one lookup the app/seeder use.
 *  Add a new block by importing it and concatenating here.
 * ============================================================ */

import { BLOCK0_MODULES, BLOCK0_BY_SEQUENCE } from "./content-block0.js";
import { BLOCK02_MODULES, BLOCK02_BY_SEQUENCE } from "./content-block02.js";
import { BLOCK03_MODULES, BLOCK03_BY_SEQUENCE } from "./content-block03.js";
import { BLOCK04_MODULES, BLOCK04_BY_SEQUENCE } from "./content-block04.js";
import { BLOCK05_MODULES, BLOCK05_BY_SEQUENCE } from "./content-block05.js";
import { BLOCK06_MODULES, BLOCK06_BY_SEQUENCE } from "./content-block06.js";
import { BLOCK07_MODULES, BLOCK07_BY_SEQUENCE } from "./content-block07.js";
import { BLOCK08_MODULES, BLOCK08_BY_SEQUENCE } from "./content-block08.js";

export const CONTENT_MODULES = [].concat(
  BLOCK0_MODULES, BLOCK02_MODULES, BLOCK03_MODULES, BLOCK04_MODULES,
  BLOCK05_MODULES, BLOCK06_MODULES, BLOCK07_MODULES, BLOCK08_MODULES
);

export const CONTENT_BY_SEQUENCE = Object.assign(
  {},
  BLOCK0_BY_SEQUENCE, BLOCK02_BY_SEQUENCE, BLOCK03_BY_SEQUENCE, BLOCK04_BY_SEQUENCE,
  BLOCK05_BY_SEQUENCE, BLOCK06_BY_SEQUENCE, BLOCK07_BY_SEQUENCE, BLOCK08_BY_SEQUENCE
);
