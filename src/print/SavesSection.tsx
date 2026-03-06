import ListUnit from "@/types/ListUnit";
import datasheetAbilities from "@/assets/json/Datasheets_abilities.json";
import React from "react";
import AbilitySection from "./AbilitySection";
import Phase from "@/types/Phase";
import { getPhasedAbilities, getPhasedNotes } from "@/utils/UnitHelper";
import CardValue from "./CardValue";
import PrintSettings from "@/types/PrintSettings";
import NoteSection from "./NoteSection";

function formatInvSaveDescr(descr: string): string {
  if (!descr) return "";
  const lower = descr.toLowerCase();
  if (lower.includes("melee")) return "vs. Melee";
  if (lower.includes("ranged")) return "vs. Ranged";
  return descr;
}

const SavesSection = (units: ListUnit[], settings: PrintSettings) => {
  return units.map((unit) => {
    const abilities = getPhasedAbilities(unit, Phase.Saves);
    const notes = getPhasedNotes(unit, Phase.Saves);

    const invSave = unit.datasheetModel?.inv_sv;
    const invSaveDescr = formatInvSaveDescr(unit.datasheetModel?.inv_sv_descr ?? "");

    const fnp = datasheetAbilities.find(
      (ability) =>
        ability.name.startsWith("Feel No Pain") &&
        unit.datasheetModel &&
        ability.datasheet_id === unit.datasheetModel.datasheet_id
    );

    const invSaveText = invSave !== "-" ? `${invSave}++` : "-";
    const fnpText = fnp ? `FNP ${fnp.parameter}` : "-";

    return (
      <>
        <div className="border border-black break-inside-avoid first:mt-0 my-1">
          <div className="flex flex-row">
            <span className="flex-1 font-semibold text-center">
              {unit.groupCount}x {unit.name}
            </span>
          </div>
          <div className="flex flex-row text-sm">
            {CardValue("Sv", unit.datasheetModel?.Sv)}
            {CardValue("Inv", invSaveText)}
            {invSaveDescr ? <span className="text-xs">({invSaveDescr})</span> : null}
            {CardValue("FNP", fnpText)}
            {CardValue("T", unit.datasheetModel?.T)}
            {CardValue("W", unit.datasheetModel?.W)}
            {CardValue("Ld", unit.datasheetModel?.Ld)}
          </div>
          {AbilitySection(abilities, settings)}
          {NoteSection(notes, settings)}
        </div>
      </>
    );
  });
};

export default SavesSection;
