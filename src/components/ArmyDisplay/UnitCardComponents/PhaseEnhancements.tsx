import React from "react";

import Phase from "@/types/Phase";
import Enhancement from "@/types/Enhancement";
import ListUnit from "@/types/ListUnit";

const PhaseEnhancements: React.FC<{
  unit: ListUnit;
  phase: Phase;
}> = ({ unit, phase }) => {
  const phasedEnhancements = unit.enhancements.filter(
    (enhancement: Enhancement) => enhancement.phases.includes(phase)
  );

  const enhancementList = (
    <div className="ml-1">
      {phasedEnhancements.map((enhancement, index) => (
        <li
          key={index}
          className={`flex flex-col break-inside-avoid first:mt-0`}
        >
          <div className="text-md dark:font-semibold dark:text-gray-100">
            {enhancement.name}
          </div>
          <div className="font-thin dark:font-normal text-sm text-gray-800 dark:text-gray-200">
            {enhancement.description}
          </div>
        </li>
      ))}
    </div>
  );

  return [enhancementList, phasedEnhancements.length > 0];
};

export default PhaseEnhancements;
