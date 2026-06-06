import React from "react";

import Phase from "@/types/Phase";
import PrintSettings from "@/types/PrintSettings";
import {
  abilitiesForPhase,
  unitName,
  unitKeywords,
  type RosterUnitRow,
} from "@/data/rosterSelectors";

import AbilitySection from "./AbilitySection";
import EnhancementSection from "./EnhancementSection";
import NoteSection from "./NoteSection";

/** A print card: a roster row plus how many identical units it stands for. */
export interface PrintRow {
  row: RosterUnitRow;
  groupCount: number;
}

const PregameSection = (rows: PrintRow[], settings: PrintSettings) => {
  return rows.map(({ row, groupCount }, index) => {
    const abilities = abilitiesForPhase(row.view, Phase.Pregame);
    const notes =
      row.overlay.notes?.filter((note) => note.phases.includes(Phase.Pregame)) ??
      [];

    return (
      <React.Fragment key={index}>
        <div className="border border-black break-inside-avoid first:mt-0 my-1">
          <div className="flex flex-row">
            <span className="flex-1 font-semibold text-center">
              {groupCount}x {unitName(row)}
            </span>
          </div>
          <div className="flex flex-row">
            <span className="flex-1 text-center">{unitKeywords(row)}</span>
          </div>
          {AbilitySection(abilities, settings)}
          {EnhancementSection(row.rosterUnit)}
          {NoteSection(notes, settings)}
        </div>
      </React.Fragment>
    );
  });
};

export default PregameSection;
