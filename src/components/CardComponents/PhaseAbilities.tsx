import React from "react";

import Phase from "@/types/Phase";
import Ability from "@/types/Ability";
import ListUnit from "@/types/ListUnit";

const PhaseAbilities: React.FC<{
  unit: ListUnit;
  phase: Phase;
}> = ({ unit, phase }) => {
  const phaseAbilities = unit.abilities.filter((ability: Ability) =>
    ability.phases.includes(phase)
  );

  const abilitiesList = (
    <div className="ml-1">
      {phaseAbilities.map((ability: Ability, index: number) => (
        <li
          key={index}
          className={`flex flex-col break-inside-avoid first:mt-0`}
        >
          <div className="text-md dark:font-semibold dark:text-gray-100">
            {ability.name}
          </div>
          <div className="font-thin dark:font-normal text-sm text-gray-800 dark:text-gray-200">
            {ability.description}
          </div>
        </li>
      ))}
    </div>
  );

  return [abilitiesList, phaseAbilities.length > 0];
};

export default PhaseAbilities;
