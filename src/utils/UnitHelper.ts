import Ability from "@/types/Ability";
import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";

const getPhasedAbilities = (unit: ListUnit, phase: Phase) =>
  unit.abilities.filter((ability: Ability) => ability.phases.includes(phase));

const getPhasedNotes = (unit: ListUnit, phase: Phase) =>
  unit.notes?.filter((note) => note.phases.includes(phase));

/**
 * Filter weapons based on selected weapon counts.
 * Uses exact match first, then falls back to bidirectional substring matching.
 */
const filterWeaponsByCount = <T extends { name?: string | null }>(
  weapons: T[],
  count: Record<string, number> | null | undefined,
): T[] => {
  if (!count) return weapons;
  const countKeys = Object.keys(count);
  return weapons.filter((weapon) =>
    countKeys.some((name) => {
      if (!name || !weapon.name) return false;
      const wLower = weapon.name.toLowerCase();
      const nLower = name.toLowerCase();
      // Prefer exact match
      if (wLower === nLower) return true;
      // Fall back to bidirectional substring
      return wLower.includes(nLower) || nLower.includes(wLower);
    }),
  );
};

export { getPhasedAbilities, getPhasedNotes, filterWeaponsByCount };