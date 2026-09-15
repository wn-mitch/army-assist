import { v4 } from "uuid";

import {
  dataset,
  factions,
  detachments,
  resolveRosterUnit,
  isMeleeProfile,
  resolveRosterWargear,
  tryImportRoster,
  type Roster,
  type RosterUnit,
  type RosterWargear,
  type Detachment,
  type Stratagem,
  type Enhancement,
  type UnitView,
  type WeaponView,
  type AbilityView,
} from "@/data/dataset";
import { gwAbilityText } from "@/data/abilityText";
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

  const unclaimed = (previous.units ?? []).map((unit, i) => ({
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

/**
 * Display name for a stored roster's faction, resolved from the dataset. Falls
 * back to the raw faction id, then "" when no roster/faction is present.
 */
export function rosterFactionName(stored: StoredRoster | undefined): string {
  const id = stored?.roster?.faction_id;
  if (!id) return "";
  return factions.get(id)?.name ?? id;
}


/**
 * Resolve a roster detachment in its owning faction first. Detachment ids can
 * legitimately repeat across factions; `getAny` is only for shared records or
 * faction-less legacy rosters.
 */
function resolveRosterDetachment(
  roster: Roster | null | undefined,
  id: string,
): Detachment | undefined {
  const factionId = roster?.faction_id;
  return (
    (factionId ? detachments.getInFaction(id, factionId) : undefined) ??
    detachments.getAny(id)
  );
}

/**
 * Display name for a stored roster's detachment(s), resolved from the dataset.
 * 11e lists can field several detachments under a detachment-point cap, so the
 * names are joined with " + " in parse order (order is load-bearing). Each name
 * resolves from the dataset, falling back to the as-written `raw_name` when the
 * detachment didn't resolve. Returns "" when the roster has no detachment.
 */
export function rosterDetachmentName(stored: StoredRoster | undefined): string {
  const entries = stored?.roster?.detachments ?? [];
  return entries
    .map((entry) => {
      const resolved = entry.ref.id
        ? resolveRosterDetachment(stored?.roster, entry.ref.id)?.name
        : undefined;
      return resolved ?? entry.ref.raw_name;
    })
    .filter((name) => name !== "")
    .join(" + ");
}

/**
 * Resolved dataset Detachment entities for a roster, in parse order. Skips
 * entries whose name didn't resolve against the dataset (`ref.id` null or a
 * lookup miss). Order is preserved as-is — never sorted.
 */
function rosterDetachments(roster: Roster | null): Detachment[] {
  if (!roster) return [];
  // `?? []` defends against rosters persisted before the plural `detachments[]`
  // shape existed (see rosterDetachmentName above and store migrateState).
  return (roster.detachments ?? [])
    .map((entry) =>
      entry.ref.id ? resolveRosterDetachment(roster, entry.ref.id) : undefined,
    )
    .filter((d): d is Detachment => d !== undefined);
}

/** Roster units joined with dataset views and overlays, ready for the UI. */
export function rosterUnitRows(stored: StoredRoster): RosterUnitRow[] {
  if (!stored.roster) return [];
  return (stored.roster.units ?? []).map((rosterUnit, index) => ({
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
  // Collect each detachment's stratagems in parse order, de-duped so two
  // detachments that share a stratagem don't list it twice.
  const detachmentStratagems: Stratagem[] = [];
  const seen = new Set<string>();
  for (const detachment of rosterDetachments(roster)) {
    for (const id of detachment.stratagem_ids ?? []) {
      if (seen.has(id)) continue;
      const stratagem = dataset.stratagems.get(id);
      if (stratagem) {
        seen.add(id);
        detachmentStratagems.push(stratagem);
      }
    }
  }
  return [...core, ...detachmentStratagems];
}

/**
 * Display text for an ability view: the vendored GW raw text where available,
 * falling back to the DSL-derived `describe()` while authoring catches up.
 */
export function describeAbilityView(view: AbilityView): string {
  return gwAbilityText(view.id) ?? view.describe();
}

/** Display a stratagem from vendored GW source text, then its Ability DSL. */
export function describeStratagem(stratagem: Stratagem): string {
  if (!stratagem.ability_id) return "";
  return (
    gwAbilityText(stratagem.ability_id) ??
    dataset.abilities.get(stratagem.ability_id)?.describe().trim() ??
    ""
  );
}

/**
 * Army-wide rules for this roster: every linked faction rule (walking
 * `parent_faction_id` so SM chapters inherit Oath of Moment) plus each
 * detachment rule, as linked ability views.
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

  // Faction rules are explicit links. Parents come first so the base rules
  // lead, while each faction's declared order is preserved.
  const ancestry = [];
  let faction = dataset.factions.get(roster.faction_id)?.raw;
  while (faction) {
    ancestry.unshift(faction);
    faction = faction.parent_faction_id
      ? dataset.factions.get(faction.parent_faction_id)?.raw
      : undefined;
  }
  for (const ancestor of ancestry) {
    for (const id of ancestor.faction_rule_ids) {
      push(dataset.abilities.get(id));
    }
  }

  // Detachment rules: each detachment on the roster (11e lists can field
  // several) contributes its linked rule in parse order, plus a fallback to
  // abilities that declare any of these detachments directly. (Upstream data
  // note: most 11e-seed detachments don't carry a rule link yet — this
  // populates automatically as the dataset fills in.)
  const detachmentIds = new Set<string>();
  for (const entry of roster.detachments ?? []) {
    const id = entry.ref.id;
    if (!id) continue;
    detachmentIds.add(id);
    const detachment = resolveRosterDetachment(roster, id);
    if (detachment?.detachment_rule_id) {
      push(dataset.abilities.get(detachment.detachment_rule_id));
    }
  }
  if (detachmentIds.size > 0) {
    for (const ability of dataset.abilities.all) {
      if (
        ability.raw.ability_type === "detachment" &&
        ability.raw.detachment_id != null &&
        detachmentIds.has(ability.raw.detachment_id)
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

/**
 * The subset of a unit's resolved weapons that contribute to a phase. 11e
 * weapons can carry both ranged and melee profiles (e.g. The Wailing Doom), so
 * a weapon belongs to a phase when it has at least one profile for that phase —
 * the per-profile bucketing then happens at render time.
 */
export function weaponsForPhase(
  weapons: RosterWeapon[],
  phase: Phase,
): RosterWeapon[] {
  const wantMelee = phase === Phase.Fight;
  return weapons.filter((w) =>
    w.weapon.raw.profiles.some((p) => isMeleeProfile(p) === wantMelee),
  );
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
  return view.abilities.filter(
    (ability) =>
      ability.phases.length === 0 || ability.phases.includes(gamePhase),
  );
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

/**
 * Display an enhancement from its vendored GW source text while DSL coverage is
 * incomplete, falling back to a linked community-authored description.
 */
export function describeEnhancement(enhancement: Enhancement): string {
  const abilityId = enhancement.ability_id ?? enhancement.id;
  return (
    gwAbilityText(abilityId) ??
    dataset.abilities.get(abilityId)?.describe().trim() ??
    ""
  );
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
  const effect = ability.raw.effect as
    | { modifier?: { threshold?: unknown } }
    | undefined;
  const threshold = effect?.modifier?.threshold;
  return typeof threshold === "number" ? threshold : undefined;
}

/* --- character attachments -------------------------------------------- */

export type AttachmentRole = "leader" | "support";

export interface EffectiveAttachment {
  bodyguardIndex: number | null;
  role: AttachmentRole;
  provisional: boolean;
}

function attachmentRole(row: RosterUnitRow): AttachmentRole {
  const datasetRole = row.view?.raw.attachment_role;
  if (datasetRole === "leader" || datasetRole === "support") {
    return datasetRole;
  }
  return row.rosterUnit.leader_attachment?.role === "support"
    ? "support"
    : "leader";
}

/**
 * Resolve every roster row's effective attachment in one occurrence-aware pass.
 * Manual overlay choices are authoritative. Explicit leader attachments claim
 * duplicate bodyguard occurrences in roster order; provisional and support
 * attachments retain first-match behavior so several supports may share a unit.
 */
export function effectiveAttachments(
  rows: RosterUnitRow[],
): ReadonlyMap<number, EffectiveAttachment> {
  const result = new Map<number, EffectiveAttachment>();
  const claimedExplicitBodyguards = new Set<number>();

  for (const row of rows) {
    const role = attachmentRole(row);
    const override = row.overlay.attachedBodyguardIndex;
    if (override !== undefined) {
      const valid =
        typeof override === "number" &&
        rows.some((candidate) => candidate.index === override);
      result.set(row.index, {
        bodyguardIndex: valid ? override : null,
        role,
        provisional: false,
      });
      continue;
    }

    const attachment = row.rosterUnit.leader_attachment;
    const ref = attachment?.bodyguard_ref;
    if (!ref) {
      result.set(row.index, {
        bodyguardIndex: null,
        role,
        provisional: false,
      });
      continue;
    }

    let candidates =
      ref.id == null
        ? []
        : rows.filter((candidate) => candidate.rosterUnit.ref.id === ref.id);
    if (candidates.length === 0 && ref.raw_name !== "") {
      candidates = rows.filter(
        (candidate) => candidate.rosterUnit.ref.raw_name === ref.raw_name,
      );
    }

    let bodyguard = candidates[0];
    if (attachment.provisional === false && role === "leader") {
      const unclaimed = candidates.filter(
        (candidate) => !claimedExplicitBodyguards.has(candidate.index),
      );
      bodyguard =
        unclaimed.find((candidate) => candidate.index > row.index) ??
        unclaimed[0] ??
        bodyguard;
      if (bodyguard && unclaimed.includes(bodyguard)) {
        claimedExplicitBodyguards.add(bodyguard.index);
      }
    }

    result.set(row.index, {
      bodyguardIndex: bodyguard?.index ?? null,
      role,
      provisional: bodyguard != null && (attachment.provisional ?? false),
    });
  }

  return result;
}

/** Characters attached to a bodyguard, leaders before supports, then roster order. */
export function attachedCharacterIndices(
  rows: RosterUnitRow[],
  bodyguardIndex: number,
  attachments: ReadonlyMap<number, EffectiveAttachment>,
): number[] {
  return rows
    .map((row) => ({
      index: row.index,
      attachment: attachments.get(row.index),
    }))
    .filter(
      (
        entry,
      ): entry is { index: number; attachment: EffectiveAttachment } =>
        entry.attachment?.bodyguardIndex === bodyguardIndex,
    )
    .sort(
      (a, b) =>
        Number(a.attachment.role === "support") -
          Number(b.attachment.role === "support") ||
        a.index - b.index,
    )
    .map(({ index }) => index);
}

/** Resolve the characters attached to a bodyguard to their rows, in the same order. */
export function attachedCharacterRows(
  rows: RosterUnitRow[],
  bodyguardIndex: number,
  attachments: ReadonlyMap<number, EffectiveAttachment>,
): RosterUnitRow[] {
  return attachedCharacterIndices(rows, bodyguardIndex, attachments)
    .map((index) => rows.find((candidate) => candidate.index === index))
    .filter((candidate): candidate is RosterUnitRow => candidate !== undefined);
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
 * Build the ordered list of cards for the army display, deriving them from
 * the native RosterUnitRow model:
 *   - attached characters are excluded (rendered beneath their bodyguard),
 *   - bodyguards with attachments remain occurrence-specific,
 *   - when `group` is set, attachment-free identical units collapse to one
 *     card carrying a `[Nx]` count,
 *   - the result is sorted by the chosen SortOptions.
 */
export function displayCards(
  rows: RosterUnitRow[],
  sort: SortOptions,
  group: boolean,
  attachments: ReadonlyMap<number, EffectiveAttachment> = effectiveAttachments(
    rows,
  ),
): DisplayCard[] {
  const attachedBodyguards = new Set(
    [...attachments.values()]
      .map((attachment) => attachment.bodyguardIndex)
      .filter((index): index is number => index !== null),
  );
  const topLevel = rows.filter(
    (row) => attachments.get(row.index)?.bodyguardIndex === null,
  );

  type KeyedCard = DisplayCard & { key: string };
  let cards: KeyedCard[];
  if (group) {
    cards = [];
    for (const row of topLevel) {
      const key = attachedBodyguards.has(row.index)
        ? `attached#${row.index}`
        : unitIdentity(row.rosterUnit) +
          "#" +
          wargearSignature(row.rosterUnit.wargear) +
          "#" +
          (row.rosterUnit.enhancement?.id ?? "") +
          "#" +
          JSON.stringify(row.overlay.notes);
      const existing = cards.find((card) => card.key === key);
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
