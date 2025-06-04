import ListUnit from "@/types/ListUnit";
import React from "react";
import AbilitySection from "./AbilitySection";
import Phase from "@/types/Phase";
import { getPhasedAbilities, getPhasedNotes } from "@/utils/UnitHelper";
import PrintSettings from "@/types/PrintSettings";
import NoteSection from "./NoteSection";

const PregameSection = (units: ListUnit[], settings: PrintSettings) => {
  return units.map((unit, index) => {
    const abilities = getPhasedAbilities(unit, Phase.Pregame);
    const notes = getPhasedNotes(unit, Phase.Pregame);

    return (
      <React.Fragment key={index}>
        <div className="border border-black break-inside-avoid first:mt-0 my-1">
          <div className="flex flex-row">
            <span className="flex-1 font-semibold text-center">
              {unit.groupCount}x {unit.name}
            </span>
          </div>
          <div className="flex flex-row">
            <span className="flex-1 text-center">{unit.keywords}</span>
          </div>
          {AbilitySection(abilities, settings)}
          {NoteSection(notes, settings)}
        </div>
      </React.Fragment>
    );
  });
};

export default PregameSection;
