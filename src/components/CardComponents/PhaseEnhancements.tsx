import React, { useEffect, useState } from "react";

import Enhancements from "@/assets/json/Enhancements_modified.json";

import Phase from "@/types/Phase";
import Enhancement from "@/types/Enhancement";

const PhaseEnhancements: React.FC<{
  unitSelections: string[];
  phase: Phase;
}> = ({ unitSelections, phase }) => {
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);

  console.log(unitSelections);

  useEffect(() => {
    const matchingEnhancements = Enhancements.filter(
      (enhancement: Enhancement) =>
        unitSelections.includes(enhancement.name) &&
        enhancement.phases.includes(phase)
    );

    setEnhancements(matchingEnhancements);
  }, [unitSelections, phase]);

  const enhancementList = (
    <div className="ml-1">
      {enhancements.map((enhancement, index) => (
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

  return [enhancementList, enhancements.length > 0];
};

export default PhaseEnhancements;
