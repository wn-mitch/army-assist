import { weaponKeywordStrings, type RosterWeapon } from "@/data/rosterSelectors";
import { formatStat } from "@/data/format";

/**
 * One print row: a single weapon profile with the carrying unit's count.
 * Mirrors the card-tree WeaponPhaseTable `toRows` flattening so the printed
 * weapon table matches what the cards show (multi-profile weapons expand to
 * one row per profile, with the count only on the first).
 */
export interface PrintWeaponRow {
  /** Display name (weapon name, or weapon + profile name for multi-profile). */
  name: string;
  /** True for the second+ profile of a multi-profile weapon (indented). */
  isSubProfile: boolean;
  range: number | "Melee" | undefined;
  attacks: string;
  /** Ballistic/Weapon skill: numeric or null (torrent). */
  skill: number | null;
  strength: string;
  ap: number;
  damage: string;
  /** Weapon-keyword display names for this profile. */
  keywords: string[];
  /** Count shown only on the weapon's first profile row. */
  count: number | "";
}

export function weaponRows(weapons: RosterWeapon[]): PrintWeaponRow[] {
  const rows: PrintWeaponRow[] = [];
  for (const { weapon, count } of weapons) {
    const profiles = weapon.raw.profiles;
    const multi = profiles.length > 1;
    profiles.forEach((profile, i) => {
      const stats = profile.stats;
      const skill = stats.BS ?? stats.WS ?? null;
      rows.push({
        name: multi ? `${weapon.name} - ${profile.name}` : weapon.name,
        isSubProfile: multi && i > 0,
        range: profile.range,
        attacks: formatStat(stats.A),
        skill,
        strength: formatStat(stats.S),
        ap: stats.AP,
        damage: formatStat(stats.D),
        keywords: weaponKeywordStrings(weapon, i),
        count: i === 0 ? count : "",
      });
    });
  }
  return rows;
}
