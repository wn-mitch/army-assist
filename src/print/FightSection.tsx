import React from "react";

import Phase from "@/types/Phase";
import PrintSettings from "@/types/PrintSettings";
import {
  abilitiesForPhase,
  rosterWeapons,
  visibleWeapons,
  weaponsForPhase,
  unitName,
} from "@/data/rosterSelectors";
import { formatSkill, formatAP } from "@/data/format";

import AbilitySection from "./AbilitySection";
import EnhancementSection from "./EnhancementSection";
import NoteSection from "./NoteSection";
import { weaponRows } from "./weaponRows";
import type { PrintRow } from "./PregameSection";

const FightSection = (rows: PrintRow[], settings: PrintSettings) => {
  return rows.map(({ row, groupCount }, index) => {
    const abilities = abilitiesForPhase(row.view, Phase.Fight);
    const notes =
      row.overlay.notes?.filter((note) => note.phases.includes(Phase.Fight)) ??
      [];

    const allWeapons = rosterWeapons(row.rosterUnit);
    const filtered = settings.weaponsFilter
      ? visibleWeapons(allWeapons)
      : allWeapons;
    const weapons = weaponRows(weaponsForPhase(filtered, Phase.Fight));

    return (
      <React.Fragment key={index}>
        <div className="border border-black break-inside-avoid first:mt-0 my-1">
          <div className="flex flex-row">
            <span className="flex-1 font-semibold text-center">
              {groupCount}x {unitName(row)}
            </span>
          </div>
          <table className="text-sm">
            <thead>
              <tr className="font-light">
                <th className="w-1/5 pl-1 text-center">Name</th>
                <th className="w-1/12 text-center">#</th>
                <th className="w-1/12 text-center">A</th>
                <th className="w-1/12 text-center">WS</th>
                <th className="w-1/12 text-center">S</th>
                <th className="w-1/12 text-center">AP</th>
                <th className="w-1/12 text-center">D</th>
                <th className="w-1/5 text-center">KW</th>
              </tr>
            </thead>
            <tbody>
              {weapons.map((weapon, wIndex) => (
                <tr key={wIndex}>
                  <td className="pl-1">
                    {weapon.isSubProfile ? `➤ ${weapon.name}` : weapon.name}
                  </td>
                  <td className="text-center">{weapon.count}</td>
                  <td className="text-center">{weapon.attacks}</td>
                  <td className="text-center">{formatSkill(weapon.skill)}</td>
                  <td className="text-center">{weapon.strength}</td>
                  <td className="text-center">{formatAP(weapon.ap)}</td>
                  <td className="text-center">{weapon.damage}</td>
                  <td className="text-center">{weapon.keywords.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {AbilitySection(abilities, settings)}
          {EnhancementSection(row.rosterUnit)}
          {NoteSection(notes, settings)}
        </div>
      </React.Fragment>
    );
  });
};

export default FightSection;
