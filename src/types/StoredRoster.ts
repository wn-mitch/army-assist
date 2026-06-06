import type { Roster } from "@/data/dataset";
import Phase from "./Phase";
import Note from "./Note";

/**
 * App-only per-unit runtime state. Lives beside the roster, never inside it —
 * the Roster is the package's canonical import result and stays untouched.
 * Indexed parallel to `roster.units`.
 */
export interface UnitOverlay {
  toggled: boolean;
  notes: Note[];
  /** Casualty tracking, keyed by composition model name. */
  modelCounts?: Record<string, number>;
  /**
   * User-driven leader attachment override:
   *   - `undefined` → follow the roster-inferred `leader_attachment`,
   *   - a number    → user attached this unit to that unit index,
   *   - `null`      → user explicitly detached (ignore the inferred link).
   */
  attachedToLeaderIndex?: number | null;
}

/** Structured import failure, preserved so the UI can explain what happened. */
export interface ImportFailure {
  reason: string;
  message: string;
}

/**
 * A saved army: the raw pasted text (source of truth for reparsing), the
 * canonical Roster the omni-importer produced from it, and the app's own
 * view/runtime state. Replaces StoredList.
 */
interface StoredRoster {
  uuid: string;
  /** Original pasted text — reparse source of truth across data updates. */
  rawText: string;
  /** Canonical import result, stored verbatim. Null when import failed. */
  roster: Roster | null;
  importFailure?: ImportFailure;
  name: string | undefined;
  /** App view state (7-phase UI enum). */
  phase: Phase;
  /** Parallel to roster.units by index. */
  unitState: UnitOverlay[];
  created: string;
  updated: string;
}

export default StoredRoster;
