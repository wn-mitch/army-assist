import React from "react";

import Phase from "@/types/Phase";
import type { UnitOverlay } from "@/types/StoredRoster";

const PhaseNotes: React.FC<{
  overlay: UnitOverlay;
  phase: Phase;
}> = ({ overlay, phase }) => {
  const phasedNotes =
    overlay.notes?.filter((note) => note.phases.includes(phase)) || [];

  const noteList = (
    <div className="ml-1">
      {phasedNotes.map((note, index) => (
        <li
          key={index}
          className={`flex flex-col break-inside-avoid first:mt-0`}
        >
          <div className="text-md dark:font-semibold text-text">
            {note.title}
          </div>
          <div className="font-thin dark:font-normal text-sm text-text">
            {note.content}
          </div>
        </li>
      ))}
    </div>
  );

  return [noteList, phasedNotes.length > 0];
};

export default PhaseNotes;
