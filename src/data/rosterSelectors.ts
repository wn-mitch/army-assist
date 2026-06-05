import { v4 } from "uuid";

import {
  dataset,
  resolveRosterUnit,
  tryImportRoster,
  type Roster,
  type RosterUnit,
  type Stratagem,
  type UnitView,
  type AbilityView,
} from "@/data/dataset";
import { toGamePhase } from "@/data/phaseMap";
import Phase from "@/types/Phase";
import StoredRoster, { UnitOverlay } from "@/types/StoredRoster";

/**
 * Pure selector logic over StoredRoster — the store delegates here so the
 * roster data path stays testable without Zustand.
 */

/** A roster unit joined with its resolved dataset view and app overlay. */
export interface RosterUnitRow {
  index: number;
  rosterUnit: RosterUnit;
  /** Undefined when the unit name didn't resolve against the dataset. */
  view: UnitView | undefined;
  overlay: UnitOverlay;
}

const DEFAULT_OVERLAY: UnitOverlay = { toggled: true, notes: [] };

export function defaultUnitState(roster: Roster | null): UnitOverlay[] {
  return (roster?.units ?? []).map(() => ({ ...DEFAULT_OVERLAY, notes: [] }));
}

/**
 * Carry app state across a reparse: units keep their overlay when the new
 * roster contains a unit with the same resolved id (or raw name as fallback).
 * First match wins per overlay so duplicate datasheets don't share notes.
 */
export function carryUnitState(
  previous: Roster | null,
  previousState: UnitOverlay[],
  next: Roster | null,
): UnitOverlay[] {
  if (!next) return [];
  if (!previous) return defaultUnitState(next);

  const unitKey = (unit: RosterUnit) =>
    unit.ref.id ?? unit.ref.raw_name.toLowerCase();

  const unclaimed = previous.units.map((unit, i) => ({
    key: unitKey(unit),
    overlay: previousState[i],
  }));

  return next.units.map((unit) => {
    const key = unitKey(unit);
    const matchIndex = unclaimed.findIndex(
      (candidate) => candidate.overlay && candidate.key === key,
    );
    if (matchIndex === -1) return { ...DEFAULT_OVERLAY, notes: [] };
    const [match] = unclaimed.splice(matchIndex, 1);
    return match.overlay;
  });
}

/** Build a StoredRoster from pasted text via the omni-format importer. */
export function buildStoredRoster(
  text: string,
  name: string,
  previous?: StoredRoster,
): StoredRoster {
  const result = tryImportRoster(text);
  const roster = result.ok ? result.roster : null;
  return {
    uuid: previous?.uuid ?? v4(),
    rawText: text,
    roster,
    importFailure: result.ok
      ? undefined
      : { reason: result.reason, message: result.message },
    name: name !== "" ? name : (roster?.name ?? previous?.name),
    phase: previous?.phase ?? Phase.Pregame,
    unitState: previous
      ? carryUnitState(previous.roster, previous.unitState, roster)
      : defaultUnitState(roster),
    created: previous?.created ?? Date.now().toString(),
    updated: Date.now().toString(),
  };
}

/** Roster units joined with dataset views and overlays, ready for the UI. */
export function rosterUnitRows(stored: StoredRoster): RosterUnitRow[] {
  if (!stored.roster) return [];
  return stored.roster.units.map((rosterUnit, index) => ({
    index,
    rosterUnit,
    view: resolveRosterUnit(rosterUnit, dataset),
    overlay: stored.unitState[index] ?? { ...DEFAULT_OVERLAY, notes: [] },
  }));
}

/**
 * Stratagems available to this roster in a UI phase: the universal core set
 * plus the detachment's own, filtered to the matching game phase. The
 * UI-only Pregame/Saves screens have no stratagems.
 */
export function stratagemsForPhase(
  roster: Roster | null,
  phase: Phase,
): Stratagem[] {
  if (!roster) return [];
  const gamePhase = toGamePhase(phase);
  if (!gamePhase) return [];
  return allStratagems(roster).filter((s) => s.phases.includes(gamePhase));
}

/** Every stratagem this roster can use, irrespective of phase. */
export function allStratagems(roster: Roster | null): Stratagem[] {
  if (!roster) return [];
  const core = dataset.stratagems.all.filter((s) => s.category === "core");
  const detachment = roster.detachment_id
    ? dataset.detachments.get(roster.detachment_id)
    : undefined;
  const detachmentStratagems = (detachment?.stratagem_ids ?? [])
    .map((id) => dataset.stratagems.get(id))
    .filter((s): s is Stratagem => s !== undefined);
  return [...core, ...detachmentStratagems];
}

/**
 * Display text for a stratagem: the linked ability's DSL-derived description.
 * The dataset carries no rules prose.
 */
export function describeStratagem(stratagem: Stratagem): string {
  if (!stratagem.ability_id) return "";
  return dataset.abilities.get(stratagem.ability_id)?.describe() ?? "";
}

/**
 * Army-wide rules for this roster: the faction's army abilities plus the
 * detachment's rule, as linked ability views (describe() for display text).
 */
export function armyAbilities(roster: Roster | null): AbilityView[] {
  if (!roster?.faction_id) return [];
  const faction = dataset.abilities
    .byFaction(roster.faction_id)
    .filter((a) => a.raw.ability_type === "faction");
  const detachment = roster.detachment_id
    ? dataset.abilities.all.filter(
        (a) =>
          a.raw.ability_type === "detachment" &&
          a.raw.detachment_id === roster.detachment_id,
      )
    : [];
  return [...faction, ...detachment];
}
