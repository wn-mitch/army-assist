import { v4 } from "uuid";

import {
  dataset,
  resolveRosterUnit,
  resolveRosterWargear,
  tryImportRoster,
  type Roster,
  type RosterUnit,
  type RosterWargear,
  type Stratagem,
  type Enhancement,
  type UnitView,
  type WeaponView,
  type AbilityView,
} from "@/data/dataset";
import { toGamePhase } from "@/data/phaseMap";
import Phase from "@/types/Phase";
import SortOptions from "@/types/SortOptions";
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
 * Army-wide rules for this roster: the faction's army rule (walking
 * `parent_faction_id` so SM chapters inherit Oath of Moment) plus the
 * detachment's rule, as linked ability views (describe() for display text).
 */
export function armyAbilities(roster: Roster | null): AbilityView[] {
  if (!roster?.faction_id) return [];
  const out: AbilityView[] = [];
  const seen = new Set<string>();
  const push = (view: AbilityView | undefined) => {
    if (view && !seen.has(view.id)) {
      seen.add(view.id);
      out.push(view);
    }
  };

  // Faction (army) rules: faction_rule_id is the authoritative link; parents
  // come first so the base rule leads (Oath of Moment before a chapter's own).
  const ruleIds: string[] = [];
  let faction = dataset.factions.get(roster.faction_id)?.raw;
  while (faction) {
    if (faction.faction_rule_id) ruleIds.unshift(faction.faction_rule_id);
    faction = faction.parent_faction_id
      ? dataset.factions.get(faction.parent_faction_id)?.raw
      : undefined;
  }
  for (const id of ruleIds) push(dataset.abilities.get(id));

  // Detachment rule: the linked id on the detachment record, plus a fallback
  // to abilities that declare the detachment directly. (Upstream data note:
  // most 11e-seed detachments don't carry a rule link yet — this populates
  // automatically as the dataset fills in.)
  if (roster.detachment_id) {
    const detachment = dataset.detachments.get(roster.detachment_id);
    if (detachment?.detachment_rule_id) {
      push(dataset.abilities.get(detachment.detachment_rule_id));
    }
    for (const ability of dataset.abilities.all) {
      if (
        ability.raw.ability_type === "detachment" &&
        ability.raw.detachment_id === roster.detachment_id
      ) {
        push(ability);
      }
    }
  }
  return out;
}

/* ---------------------------------------------------------------------------
 * Card-tree derivations
 *
 * Thin accessors over RosterUnitRow + dataset, shared by the unit-card
 * components. They derive display facts from the native roster model; they do
 * NOT translate roster data into a ListUnit-shaped object.
 * ------------------------------------------------------------------------- */

/** Unit display name: resolved view name, falling back to the raw import name. */
export function unitName(row: RosterUnitRow): string {
  return row.view?.name ?? row.rosterUnit.ref.raw_name;
}

/** Combined keyword + faction-keyword string for the card header. */
export function unitKeywords(row: RosterUnitRow): string {
  const view = row.view;
  if (!view) return "";
  return [...(view.raw.keywords ?? []), ...(view.raw.faction_keywords ?? [])]
    .join(", ");
}

/** A resolved wargear weapon paired with how many the unit carries. */
export interface RosterWeapon {
  weapon: WeaponView;
  count: number;
}

/**
 * Display string for a weapon keyword at a reference site, folding the
 * reference-site parameters back into the legacy card notation:
 *   - `Anti` + `{target_keyword, threshold}` → "Anti-Infantry 4+"
 *   - keywords carrying a numeric `value` (Melta, Sustained Hits, Rapid Fire,
 *     Extra Attacks) → "Melta 2"
 *   - everything else → the bare keyword name.
 * This matches the strings the KeywordTags lookup table is keyed on.
 */
export function formatWeaponKeyword(
  name: string,
  parameters: Record<string, unknown> | undefined,
): string {
  if (!parameters) return name;
  if (name === "Anti") {
    const target = parameters.target_keyword;
    const threshold = parameters.threshold;
    if (typeof target === "string" && typeof threshold === "number") {
      return `Anti-${target} ${threshold}+`;
    }
    return name;
  }
  const value = parameters.value;
  if (value !== undefined && value !== null) {
    return `${name} ${value}`;
  }
  return name;
}

/** Formatted keyword display strings for a weapon profile. */
export function weaponKeywordStrings(
  weapon: WeaponView,
  profileIndex: number,
): string[] {
  return weapon
    .keywordsAt(profileIndex)
    .map((k) => formatWeaponKeyword(k.keyword.name, k.parameters));
}

/**
 * Resolve a unit's wargear to weapon views with counts (unresolved dropped),
 * ordered by weapon name. The legacy card rendered weapons in datasheet order
 * (effectively alphabetical); preserving that keeps the weapon table stable and
 * matches what the cards have always shown.
 */
export function rosterWeapons(rosterUnit: RosterUnit): RosterWeapon[] {
  return resolveRosterWargear(rosterUnit.wargear, dataset).sort((a, b) =>
    a.weapon.name.localeCompare(b.weapon.name),
  );
}

/**
 * Hide weapon rows the unit no longer has any of: when the wargear count is
 * zero (e.g. a swapped-out default), drop the row. Ports the intent of the
 * legacy `filterWeaponsByCount` — which trimmed weapon rows whose model count
 * had dropped to nothing — onto the roster's authoritative per-wargear counts.
 */
export function visibleWeapons(weapons: RosterWeapon[]): RosterWeapon[] {
  return weapons.filter((w) => w.count > 0);
}

/** Ranged or melee subset of a unit's resolved weapons, by package type. */
export function weaponsForPhase(
  weapons: RosterWeapon[],
  phase: Phase,
): RosterWeapon[] {
  const wanted = phase === Phase.Shooting ? "ranged" : "melee";
  return weapons.filter((w) => w.weapon.raw.type === wanted);
}

/* --- abilities --------------------------------------------------------- */

/**
 * Deployment-relevant ability name prefixes surfaced on the Pregame screen.
 * The package has no "pregame" phase, so we detect by ability name. Matching
 * is case-insensitive on the prefix. "Deadly Demise" is deliberately excluded.
 */
const PREGAME_ABILITY_PREFIXES = [
  "scouts",
  "infiltrators",
  "deep strike",
  "leader",
];

/** True when an ability is deployment-relevant (Pregame screen). */
export function isPregameAbility(ability: AbilityView): boolean {
  const name = ability.name.toLowerCase();
  return PREGAME_ABILITY_PREFIXES.some((prefix) => name.startsWith(prefix));
}

/** A unit's abilities relevant to the given UI phase. */
export function abilitiesForPhase(
  view: UnitView | undefined,
  phase: Phase,
): AbilityView[] {
  if (!view) return [];
  if (phase === Phase.Pregame) {
    return view.abilities.filter(isPregameAbility);
  }
  const gamePhase = toGamePhase(phase);
  if (!gamePhase) return []; // Saves has no game phase; abilities shown elsewhere
  return view.abilities.filter((a) => a.phases.includes(gamePhase));
}

/** True for "Core" abilities — eligible for "See Core Rules" truncation. */
export function isCoreAbility(ability: AbilityView): boolean {
  return ability.raw.ability_type === "core";
}

/* --- enhancements ------------------------------------------------------ */

/** The dataset Enhancement record selected on a roster unit, if resolved. */
export function unitEnhancement(rosterUnit: RosterUnit): Enhancement | undefined {
  const ref = rosterUnit.enhancement;
  if (!ref?.resolved || ref.id == null) return undefined;
  return dataset.enhancements.get(ref.id);
}

/** Display text for an enhancement: its linked ability's DSL description. */
export function describeEnhancement(enhancement: Enhancement): string {
  if (!enhancement.ability_id) return "";
  return dataset.abilities.get(enhancement.ability_id)?.describe() ?? "";
}

/* --- saves / defensive stats ------------------------------------------- */

/** The Feel No Pain ability on a unit, if any (name starts with the phrase). */
export function feelNoPainAbility(
  view: UnitView | undefined,
): AbilityView | undefined {
  return view?.abilities.find((a) =>
    a.name.toLowerCase().startsWith("feel no pain"),
  );
}

/**
 * The FNP threshold (e.g. 5 for "Feel No Pain 5+"), pulled from the DSL effect
 * node when present. Returns undefined when the ability carries no threshold
 * in the DSL — the caller falls back to the ability's own name text.
 */
export function feelNoPainThreshold(
  ability: AbilityView | undefined,
): number | undefined {
  if (!ability) return undefined;
  const modifier = ability.raw.effect?.modifier as
    | { threshold?: unknown }
    | undefined;
  const threshold = modifier?.threshold;
  return typeof threshold === "number" ? threshold : undefined;
}

/* --- leader attachment ------------------------------------------------- */

/**
 * Effective leader index for a unit, resolving the user override against the
 * roster-inferred attachment:
 *   - overlay `null`   → user explicitly detached → no leader,
 *   - overlay `number` → user attached to that unit index,
 *   - overlay absent   → follow the importer's inferred `leader_attachment`
 *     (the leader is the unit whose `leader_attachment.bodyguard_ref` points
 *     at this unit).
 * Returns the leader's unit index, or null when the unit follows no leader.
 */
export function effectiveLeaderIndex(
  rows: RosterUnitRow[],
  unitIndex: number,
): number | null {
  const row = rows[unitIndex];
  if (!row) return null;
  const override = row.overlay.attachedToLeaderIndex;
  if (override === null) return null;
  if (typeof override === "number") return override;

  // Inferred: find the leader whose bodyguard_ref resolves to this unit.
  const self = row.rosterUnit;
  const selfId = self.ref.id;
  const selfName = self.ref.raw_name;
  const leaderIdx = rows.findIndex((candidate) => {
    if (candidate.index === unitIndex) return false;
    const ref = candidate.rosterUnit.leader_attachment?.bodyguard_ref;
    if (!ref) return false;
    if (ref.id != null && selfId != null) return ref.id === selfId;
    return ref.raw_name === selfName;
  });
  return leaderIdx === -1 ? null : leaderIdx;
}

/** Unit indices that render nested under `leaderIndex` (its bodyguards). */
export function attachedUnitIndices(
  rows: RosterUnitRow[],
  leaderIndex: number,
): number[] {
  return rows
    .filter((row) => effectiveLeaderIndex(rows, row.index) === leaderIndex)
    .map((row) => row.index);
}

/* --- sort / group ------------------------------------------------------ */

/** A stable signature of a unit's wargear multiset (id|count, sorted). */
function wargearSignature(wargear: RosterWargear[]): string {
  return wargear
    .map((w) => `${w.ref.id ?? w.ref.raw_name}:${w.count}`)
    .sort()
    .join("|");
}

/** Resolved-id (or raw-name) identity key for a roster unit. */
function unitIdentity(rosterUnit: RosterUnit): string {
  return rosterUnit.ref.id ?? rosterUnit.ref.raw_name.toLowerCase();
}

/** A card to render: the representative row plus how many identical units it stands for. */
export interface DisplayCard {
  row: RosterUnitRow;
  groupCount: number;
}

/**
 * Build the ordered list of cards for the army display, reimplementing the
 * legacy `getProcessedUnitList` semantics over RosterUnitRow:
 *   - units attached under a leader are excluded (rendered nested in the card),
 *   - when `group` is set, identical units (same identity + wargear multiset)
 *     collapse to one card carrying a `[Nx]` count,
 *   - the result is sorted by the chosen SortOptions.
 */
export function displayCards(
  rows: RosterUnitRow[],
  sort: SortOptions,
  group: boolean,
): DisplayCard[] {
  // Exclude units that render nested under a leader.
  const topLevel = rows.filter(
    (row) => effectiveLeaderIndex(rows, row.index) === null,
  );

  type KeyedCard = DisplayCard & { key: string };
  let cards: KeyedCard[];
  if (group) {
    cards = [];
    for (const row of topLevel) {
      const key =
        unitIdentity(row.rosterUnit) +
        "#" +
        wargearSignature(row.rosterUnit.wargear) +
        "#" +
        (row.rosterUnit.enhancement?.id ?? "") +
        "#" +
        JSON.stringify(row.overlay.notes);
      const existing = cards.find((c) => c.key === key);
      if (existing) {
        existing.groupCount += 1;
      } else {
        cards.push({ row, groupCount: 1, key });
      }
    }
  } else {
    cards = topLevel.map((row) => ({ row, groupCount: 1, key: "" }));
  }

  const sorted = [...cards].sort((a, b) => {
    switch (sort) {
      case SortOptions.Name:
        return unitName(a.row).localeCompare(unitName(b.row));
      case SortOptions.PasteOrder:
        return a.row.index - b.row.index;
      case SortOptions.ReversePasteOrder:
        return b.row.index - a.row.index;
      default:
        return 0;
    }
  });

  return sorted.map(({ row, groupCount }) => ({ row, groupCount }));
}
