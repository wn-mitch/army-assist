import React from "react";

import Phase from "@/types/Phase";
import PrintSettings from "@/types/PrintSettings";
import { abilitiesForPhase, unitName } from "@/data/rosterSelectors";

import AbilitySection from "./AbilitySection";
import EnhancementSection from "./EnhancementSection";
import NoteSection from "./NoteSection";
import type { PrintRow } from "./PregameSection";

const ChargeSection = (rows: PrintRow[], settings: PrintSettings) => {
  return rows.map(({ row, groupCount }, index) => {
    const abilities = abilitiesForPhase(row.view, Phase.Charge);
    const notes =
      row.overlay.notes?.filter((note) => note.phases.includes(Phase.Charge)) ??
      [];

    return (
      <React.Fragment key={index}>
        <div className="border border-black break-inside-avoid first:mt-0 my-1">
          <div className="flex flex-row">
            <span className="flex-1 font-semibold text-center">
              {groupCount}x {unitName(row)}
            </span>
          </div>
          {AbilitySection(abilities, settings)}
          {EnhancementSection(row.rosterUnit)}
          {NoteSection(notes, settings)}
        </div>
      </React.Fragment>
    );
  });
};

export default ChargeSection;
