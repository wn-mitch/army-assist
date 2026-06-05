import type { StatValue } from "@/data/dataset";

/**
 * Render-time formatting for the package's numeric stat model.
 *
 * The dataset stores stats as numbers (Sv: 3, M: 6) or dice expressions
 * (A: "D6"); the UI renders the traditional card notation ("3+", '6"').
 * Formatting lives here, at the render boundary — stored data stays numeric.
 */

/** 3 → "3+"; null/undefined → "-" (no save). */
export function formatSave(sv: number | null | undefined): string {
  return sv == null ? "-" : `${sv}+`;
}

/** 6 → '6"'; dice/string movement values pass through with the inch mark. */
export function formatInches(value: StatValue | null | undefined): string {
  return value == null ? "-" : `${value}"`;
}

/** Weapon range: numbers get the inch mark, "Melee" passes through. */
export function formatRange(range: number | "Melee" | undefined): string {
  if (range === undefined || range === "Melee") return "Melee";
  return `${range}"`;
}

/** Dice-or-number stat (A, D, S): pass through as display text. */
export function formatStat(value: StatValue | null | undefined): string {
  return value == null ? "-" : `${value}`;
}

/** Ballistic/Weapon skill: 3 → "3+"; torrent weapons have none → "N/A". */
export function formatSkill(skill: number | null | undefined): string {
  return skill == null ? "N/A" : `${skill}+`;
}

/** AP renders with its sign: 1 → "-1", 0 → "0". */
export function formatAP(ap: number): string {
  return ap === 0 ? "0" : `-${Math.abs(ap)}`;
}
