import Phase from "@/types/Phase";
import type { GamePhase } from "@/data/dataset";

/**
 * Bridges the app's 7-phase UI enum and the package's 5-phase game model.
 *
 * The UI keeps Pregame and Saves as screens, but they are view state, not
 * game phases: the dataset has no "pregame" or "saves" phase. Pregame content
 * comes from force dispositions and deployment-scoped abilities; Saves content
 * comes from defensive stats and target-perspective buffs.
 */

const APP_TO_GAME: Partial<Record<Phase, GamePhase>> = {
  [Phase.Command]: "command",
  [Phase.Movement]: "movement",
  [Phase.Shooting]: "shooting",
  [Phase.Charge]: "charge",
  [Phase.Fight]: "fight",
};

const GAME_TO_APP: Record<GamePhase, Phase> = {
  command: Phase.Command,
  movement: Phase.Movement,
  shooting: Phase.Shooting,
  charge: Phase.Charge,
  fight: Phase.Fight,
};

/**
 * Map an app UI phase to the package game phase, or undefined for the
 * UI-only Pregame/Saves screens.
 */
export function toGamePhase(phase: Phase): GamePhase | undefined {
  return APP_TO_GAME[phase];
}

/** Map a package game phase to its app UI phase. */
export function toAppPhase(phase: GamePhase): Phase {
  return GAME_TO_APP[phase];
}

/** Map a list of package game phases to app UI phases. */
export function toAppPhases(phases: readonly GamePhase[]): Phase[] {
  return phases.map(toAppPhase);
}
