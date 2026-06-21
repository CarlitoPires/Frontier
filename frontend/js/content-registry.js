/* ============================================================
 *  LinguoBound — Content registry
 *  Merges all authored blocks into one lookup the app/seeder use.
 *  Add a new block by importing it and concatenating here.
 * ============================================================ */

import { BLOCK0_MODULES, BLOCK0_BY_SEQUENCE } from "./content-block0.js";
import { BLOCK02_MODULES, BLOCK02_BY_SEQUENCE } from "./content-block02.js";

export const CONTENT_MODULES = BLOCK0_MODULES.concat(BLOCK02_MODULES);
export const CONTENT_BY_SEQUENCE = Object.assign({}, BLOCK0_BY_SEQUENCE, BLOCK02_BY_SEQUENCE);
