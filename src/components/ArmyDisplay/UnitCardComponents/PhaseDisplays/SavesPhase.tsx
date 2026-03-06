import React from "react";

import datasheetAbilities from "@/assets/json/Datasheets_abilities.json";
import ModelSaveTable from "./ModelSaveTable";
import ListUnit from "@/types/ListUnit";

function formatInvSaveDescr(descr: string): string {
  if (!descr) return "";
  const lower = descr.toLowerCase();
  if (lower.includes("melee")) return "vs. Melee";
  if (lower.includes("ranged")) return "vs. Ranged";
  return descr;
}

const SavesPhase = ({
  unit,
}: {
  unit: ListUnit;
}): [React.ReactNode, boolean] => {
  if(!unit.datasheetModel) {
    window.alert("Error!")
    return[<></>, false];
  }

  const save = unit.datasheetModel.Sv;
  const invSave = unit.datasheetModel.inv_sv;
  const invSaveDescr = formatInvSaveDescr(unit.datasheetModel.inv_sv_descr);

  const fnp = datasheetAbilities.find(
    (ability) =>
      ability.name.startsWith("Feel No Pain") && unit.datasheetModel &&
      ability.datasheet_id === unit.datasheetModel.datasheet_id
  );

  const saveText = `${save}`;
  const invSaveText = invSave !== "-" ? `${invSave}++` : "-";
  const fnpText = fnp ? `FNP ${fnp.parameter}` : "-";

  return [
    <ModelSaveTable
      save={saveText}
      invSave={invSaveText}
      invSaveDescr={invSaveDescr}
      fnp={fnpText}
      toughness={unit.datasheetModel.T}
      wounds={unit.datasheetModel.W}
      leadership={unit.datasheetModel.Ld}
    />,
    true,
  ];
};

export default SavesPhase;
