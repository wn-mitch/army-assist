/**
 * Single access point for the @alpaca-software/40kdc-data package.
 *
 * Everything the app consumes from the package routes through this module —
 * no other file imports the package directly. This keeps the consumption
 * surface auditable and gives upgrades a single choke point.
 */

// The embedded dataset singleton (built once at module load) and its
// linked collections.
export {
  dataset,
  units,
  weapons,
  weaponKeywords,
  factions,
  abilities,
  detachments,
  enhancements,
  stratagems,
  missions,
  missionMatchups,
  forceDispositions,
} from "@alpaca-software/40kdc-data";

// Unit compositions are a plain array on the Dataset instance (no Collection
// wrapper upstream); expose a lookup so consumers don't scan it themselves.
import { dataset as ds } from "@alpaca-software/40kdc-data";
import type { UnitComposition } from "@alpaca-software/40kdc-data";

export function compositionForUnit(
  unitId: string,
): UnitComposition | undefined {
  return ds.unitCompositions.find((c) => c.unit_id === unitId);
}

// Roster import/export — the omni-list adapter. tryImportRoster sniffs the
// format (ListForge, NewRecruit JSON/WTC-full/WTC-compact/simple, GW app,
// Rosterizer) and returns a canonical Roster or a structured failure.
export {
  tryImportRoster,
  importRoster,
  exportRoster,
  resolveRosterUnit,
  resolveRosterWargear,
  resolveAttachedLeader,
  resolveAttachmentPartners,
} from "@alpaca-software/40kdc-data";

// DSL → English translation helpers. Display text for abilities, stratagems,
// and detachment rules is derived from these — the dataset carries no rules
// prose.
export {
  describeAbility,
  describeEffect,
  describeCondition,
} from "@alpaca-software/40kdc-data";

// Linked view classes (runtime values used for instanceof/typing).
export {
  Dataset,
  UnitView,
  WeaponView,
  WeaponKeywordView,
  AbilityView,
  FactionView,
} from "@alpaca-software/40kdc-data";

// Types the app references.
export type {
  Roster,
  RosterUnit,
  RosterWargear,
  RosterFormat,
  ImportResult,
  ResolvedRef,
  Unit,
  Weapon,
  Faction,
  Detachment,
  Enhancement,
  LeaderAttachment,
  Stratagem,
  Mission,
  ForceDisposition,
  UnitComposition,
  StatValue,
  EntityId,
  Phase as GamePhase,
  EligibleAbility,
  EligibilityInput,
} from "@alpaca-software/40kdc-data";
