import React from "react";

import Phase from "@/types/Phase";
import PrintSettings from "@/types/PrintSettings";
import { formatSkill, formatStat } from "@/data/format";
import { abilitiesForPhase, unitName } from "@/data/rosterSelectors";

import AbilitySection from "./AbilitySection";
import EnhancementSection from "./EnhancementSection";
import NoteSection from "./NoteSection";
import type { PrintRow } from "./PregameSection";

const CommandSection = (rows: PrintRow[], settings: PrintSettings) => {
  return rows.map(({ row, groupCount }, index) => {
    const abilities = abilitiesForPhase(row.view, Phase.Command);
    const notes =
      row.overlay.notes?.filter((note) => note.phases.includes(Phase.Command)) ??
      [];
    const profile = row.view?.profileAt(0);

    return (
      <React.Fragment key={index}>
        <div className="border border-black break-inside-avoid first:mt-0 my-1">
          <div className="flex flex-row">
            <span className="flex-1 font-semibold text-center">
              {groupCount}x {unitName(row)}
            </span>
          </div>
          <div className="flex flex-row text-sm">
            <span className="flex-1 text-center">
              <span className="font-medium">Ld: </span>
              {profile ? formatSkill(profile.Ld) : "-"}
            </span>
            <span className="flex-1 text-center">
              <span className="font-medium">OC: </span>
              {profile ? formatStat(profile.OC) : "-"}
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

export default CommandSection;
