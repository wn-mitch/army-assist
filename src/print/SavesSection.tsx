import React from "react";

import Phase from "@/types/Phase";
import PrintSettings from "@/types/PrintSettings";
import { formatSave, formatSkill, formatStat } from "@/data/format";
import {
  abilitiesForPhase,
  feelNoPainAbility,
  feelNoPainThreshold,
  unitName,
} from "@/data/rosterSelectors";

import AbilitySection from "./AbilitySection";
import CardValue from "./CardValue";
import EnhancementSection from "./EnhancementSection";
import NoteSection from "./NoteSection";
import type { PrintRow } from "./PregameSection";

const SavesSection = (rows: PrintRow[], settings: PrintSettings) => {
  return rows.map(({ row, groupCount }, index) => {
    const abilities = abilitiesForPhase(row.view, Phase.Saves);
    const notes =
      row.overlay.notes?.filter((note) => note.phases.includes(Phase.Saves)) ??
      [];

    const view = row.view;
    const profile = view?.profileAt(0);

    const saveText = profile ? formatSave(profile.Sv) : "-";
    const invSaveText =
      profile?.invuln_sv != null ? `${profile.invuln_sv}++` : "-";

    // Feel No Pain: prefer the DSL threshold; fall back to the ability name.
    const fnp = feelNoPainAbility(view);
    const fnpThreshold = feelNoPainThreshold(fnp);
    let fnpText = "-";
    if (fnp) {
      fnpText = fnpThreshold !== undefined ? `FNP ${fnpThreshold}+` : fnp.name;
    }

    return (
      <React.Fragment key={index}>
        <div className="border border-black break-inside-avoid first:mt-0 my-1">
          <div className="flex flex-row">
            <span className="flex-1 font-semibold text-center">
              {groupCount}x {unitName(row)}
            </span>
          </div>
          <div className="flex flex-row text-sm">
            {CardValue("Sv", saveText)}
            {CardValue("Inv", invSaveText)}
            {CardValue("FNP", fnpText)}
            {CardValue("T", profile ? formatStat(profile.T) : "-")}
            {CardValue("W", profile ? formatStat(profile.W) : "-")}
            {CardValue("Ld", profile ? formatSkill(profile.Ld) : "-")}
          </div>
          {AbilitySection(abilities, settings)}
          {EnhancementSection(row.rosterUnit)}
          {NoteSection(notes, settings)}
        </div>
      </React.Fragment>
    );
  });
};

export default SavesSection;
