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

  const damagedSection = () => {
    return unit.datasheet &&
      (phase === Phase.Shooting ||
        phase === Phase.Saves ||
        phase === Phase.Fight) &&
      unit.datasheet.damaged_w !== "" ? (
      <li className={`flex flex-col break-inside-avoid first:mt-0`}>
        <div className="text-md dark:font-semibold text-gray-900 dark:text-gray-100">
          Damaged: {unit.datasheet.damaged_w} W Remaining
        </div>
        <div className="font-thin dark:font-normal text-sm text-gray-800 dark:text-gray-200">
          {unit.datasheet.damaged_description}
        </div>
      </li>
    ) : (
      <></>
    );
  };

  const abilitiesList = (
    <div className="ml-1">
      {phaseAbilities.map((ability: Ability, index: number) => (
        <li
          key={index}
          className={`flex flex-col break-inside-avoid first:mt-0`}
        >
          <div className="text-md dark:font-semibold text-gray-900 dark:text-gray-100">
            {ability.name}
          </div>
          <div className="font-thin dark:font-normal text-sm text-gray-800 dark:text-gray-200">
            {ability.description}
          </div>
        </li>
      ))}
      {damagedSection()}
    </div>
  );

  return [abilitiesList, phaseAbilities.length > 0];
};

export default PhaseAbilities;
