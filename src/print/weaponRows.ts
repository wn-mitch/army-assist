import { weaponKeywordStrings, type RosterWeapon } from "@/data/rosterSelectors";
import { isMeleeProfile } from "@/data/dataset";
import { formatStat } from "@/data/format";
import Phase from "@/types/Phase";

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

export function weaponRows(
  weapons: RosterWeapon[],
  phase: Phase,
): PrintWeaponRow[] {
  const wantMelee = phase === Phase.Fight;
  const rows: PrintWeaponRow[] = [];
  for (const { weapon, count } of weapons) {
    // Bucket profiles by phase so a dual-profile weapon prints only its ranged
    // profiles in the shooting section and its melee profiles in the fight
    // section. Keep the ORIGINAL profile index for weaponKeywordStrings; derive
    // multi/head-row from the filtered list. Mirrors WeaponPhaseTable.toRows.
    const phaseProfiles = weapon.raw.profiles
      .map((profile, i) => ({ profile, i }))
      .filter(({ profile }) => isMeleeProfile(profile) === wantMelee);
    const multi = phaseProfiles.length > 1;
    phaseProfiles.forEach(({ profile, i }, j) => {
      const stats = profile.stats;
      const skill = stats.BS ?? stats.WS ?? null;
      rows.push({
        name: multi ? `${weapon.name} - ${profile.name}` : weapon.name,
        isSubProfile: multi && j > 0,
        range: profile.range,
        attacks: formatStat(stats.A),
        skill,
        strength: formatStat(stats.S),
        ap: stats.AP,
        damage: formatStat(stats.D),
        keywords: weaponKeywordStrings(weapon, i),
        count: j === 0 ? count : "",
      });
    });
  }
  return rows;
}
