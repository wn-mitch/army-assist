import ListUnit from "@/types/ListUnit";
import React from "react";
import AbilitySection from "./AbilitySection";
import Phase from "@/types/Phase";
import { getPhasedAbilities } from "@/utils/UnitHelper";
import PrintSettings from "@/types/PrintSettings";

const ShootingSection = (units: ListUnit[], settings: PrintSettings) => {
  return units.map((unit) => {
    const abilities = getPhasedAbilities(unit, Phase.Movement);
    const weapons = settings.weaponsFilter
      ? unit.weaponsDatasheets.filter((weapon) =>
          Object.keys(unit.count ?? {}).some((name: string) => {
            return weapon.name?.toLowerCase().includes(name.toLowerCase());
          })
        )
      : unit.weaponsDatasheets;

    const filteredWeapons = weapons.filter(
      (wargear) => wargear.type === "Ranged"
    );

    return (
      <React.Fragment>
        <div className="border border-black break-inside-avoid first:mt-0 my-1">
          <div className="flex flex-row">
            <span className="flex-1 font-semibold text-center">
              {unit.groupCount}x {unit.name}
            </span>
          </div>
          <table className="text-sm">
            <thead>
              <tr className="font-light">
                <th className="w-1/5 pl-1 text-center">Name</th>
                <th className="w-1/12 text-center">R</th>
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
              {filteredWeapons.map((weapon) => {
                return (
                  <tr>
                    <td className="pl-1">{weapon.name}</td>
                    <td className="text-center">{weapon.range}"</td>
                    <td className="text-center">
                      {unit.count && weapon.name && weapon.name in unit.count
                        ? unit.count[weapon.name]
                        : 0}
                    </td>
                    <td className="text-center">{weapon.A}</td>
                    <td className="text-center">{weapon.BS_WS}+</td>
                    <td className="text-center">{weapon.S}</td>
                    <td className="text-center">{weapon.AP}</td>
                    <td className="text-center">{weapon.D}</td>
                    <td className="text-center">{weapon.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {AbilitySection(abilities, settings)}
        </div>
      </React.Fragment>
    );
  });
};

export default ShootingSection;
