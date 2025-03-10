import ListUnit from "@/types/ListUnit";
import React from "react";
import AbilitySection from "./AbilitySection";
import Phase from "@/types/Phase";
import { getPhasedAbilities } from "@/utils/UnitHelper";
import PrintSettings from "@/types/PrintSettings";

const MovementSection = (units: ListUnit[], settings: PrintSettings) => {
  return units.map((unit) => {
    const abilities = getPhasedAbilities(unit, Phase.Movement);

    return (
      <>
        <div className="border border-black break-inside-avoid first:mt-0 my-1">
          <div className="flex flex-row">
            <span className="flex-1 font-semibold text-center">
              {unit.groupCount}x {unit.name}
            </span>
          </div>
          <div className="flex flex-row text-sm">
            <span className="flex-1 text-center">
              <span className="font-medium">M: </span>
              {unit.datasheetModel?.M}
            </span>
          </div>
          {AbilitySection(abilities, settings)}
        </div>
      </>
    );
  });
};

export default MovementSection;
