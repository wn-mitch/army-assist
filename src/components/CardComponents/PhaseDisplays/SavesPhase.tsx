import React from "react";

import datasheetAbilities from "@/assets/json/Datasheets_abilities.json";
import ModelSaveTable from "./ModelSaveTable";
import ListUnit from "@/types/ListUnit";

const SavesPhase = ({
  unit,
}: {
  unit: ListUnit;
}): [React.ReactNode, boolean] => {
  const save = unit.datasheetModel.Sv;
  const invSave = unit.datasheetModel.inv_sv;

  const feelNoPainId = "000008338";
  const fnp = datasheetAbilities.find(
    (ability) =>
      ability.ability_id === feelNoPainId &&
      ability.datasheet_id === unit.datasheetModel.datasheet_id
  );

  const saveText = `${save}`;
  const invSaveText = invSave !== "-" ? `${invSave}++` : "-";
  const fnpText = fnp ? `FNP ${fnp.parameter}` : "-";

  return [
    <ModelSaveTable
      save={saveText}
      invSave={invSaveText}
      fnp={fnpText}
      toughness={unit.datasheetModel.T}
      wounds={unit.datasheetModel.W}
      leadership={unit.datasheetModel.Ld}
    />,
    true,
  ];
};

export default SavesPhase;
