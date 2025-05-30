import React from "react";

import Phase from "@/types/Phase";
import ListUnit from "@/types/ListUnit";

const PhaseNotes: React.FC<{
  unit: ListUnit;
  phase: Phase;
}> = ({ unit, phase }) => {
  const phasedNotes = unit.notes?.filter(
    (note) => note.phases.includes(phase)
  ) || [];  

  const noteList = (
    <div className="ml-1">
      {phasedNotes.map((note, index) => (
        <li
          key={index}
          className={`flex flex-col break-inside-avoid first:mt-0`}
        >
          <div className="text-md dark:font-semibold dark:text-gray-100">
            {note.title}
          </div>
          <div className="font-thin dark:font-normal text-sm text-gray-800 dark:text-gray-200">
            {note.content}
          </div>
        </li>
      ))}
    </div>
  );

  return [noteList, phasedNotes.length > 0];
};

export default PhaseNotes;
