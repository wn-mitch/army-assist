import React from "react";

import TableCell from "./TableComponents.tsx/TableCell";
import TableHeaderCell from "./TableComponents.tsx/TableHeaderCell";
import Phase from "@/types/Phase";
import KeywordTags from "../KeywordTags";
import { weaponKeywordStrings, type RosterWeapon } from "@/data/rosterSelectors";
import {
  formatRange,
  formatStat,
  formatSkill,
  formatAP,
} from "@/data/format";

/** One render row: a single weapon profile with the carrying unit's count. */
interface ProfileRow {
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

function toRows(weapons: RosterWeapon[]): ProfileRow[] {
  const rows: ProfileRow[] = [];
  for (const { weapon, count } of weapons) {
    const profiles = weapon.raw.profiles;
    const multi = profiles.length > 1;
    profiles.forEach((profile, i) => {
      const stats = profile.stats;
      const skill = stats.BS ?? stats.WS ?? null;
      const keywords = weaponKeywordStrings(weapon, i);
      rows.push({
        name: multi ? `${weapon.name} - ${profile.name}` : weapon.name,
        isSubProfile: multi && i > 0,
        range: profile.range,
        attacks: formatStat(stats.A),
        skill,
        strength: formatStat(stats.S),
        ap: stats.AP,
        damage: formatStat(stats.D),
        keywords,
        count: i === 0 ? count : "",
      });
    });
  }
  return rows;
}

const WeaponPhaseTable = ({
  weapons,
  phase,
}: {
  weapons: RosterWeapon[];
  phase: Phase;
}) => {
  const rows = toRows(weapons);

  return (
    <div className="overflow-x-auto w-full">
      <table className="table-auto w-full">
        <thead className="border border-border">
          <tr>
            <TableHeaderCell className="w-1/5 pl-1">Name</TableHeaderCell>
            {phase !== Phase.Fight && (
              <TableHeaderCell className="w-1/12">R"</TableHeaderCell>
            )}
            <TableHeaderCell className="w-1/12">#</TableHeaderCell>
            <TableHeaderCell className="w-1/12">A</TableHeaderCell>
            <TableHeaderCell className="w-1/12">WS</TableHeaderCell>
            <TableHeaderCell className="w-1/12">S</TableHeaderCell>
            <TableHeaderCell className="w-1/12">AP</TableHeaderCell>
            <TableHeaderCell className="w-1/12">D</TableHeaderCell>
            <TableHeaderCell className="w-1/5">KW</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`border border-border ${
                index % 2 === 0
                  ? ""
                  : "bg-panel-surface group-hover:bg-panel-hover"
              } `}
            >
              <TableCell className="w-1/4 px-1 font-semibold dark:font-bold">
                {row.isSubProfile ? `➤ ${row.name}` : row.name}
              </TableCell>
              {phase !== Phase.Fight && (
                <TableCell className="w-1/12 dark:font-semibold">
                  {formatRange(row.range)}
                </TableCell>
              )}
              <TableCell className="w-1/12 dark:font-semibold">
                {row.count}
              </TableCell>
              <TableCell className="w-1/12 dark:font-semibold">
                {row.attacks}
              </TableCell>
              <TableCell className="w-1/12 dark:font-semibold">
                {formatSkill(row.skill)}
              </TableCell>
              <TableCell className="w-1/12 dark:font-semibold">
                {row.strength}
              </TableCell>
              <TableCell className="w-1/12 dark:font-semibold">
                {formatAP(row.ap)}
              </TableCell>
              <TableCell className="w-1/12 dark:font-semibold">
                {row.damage}
              </TableCell>
              <KeywordTags keywords={row.keywords} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeaponPhaseTable;
