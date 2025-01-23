import React from "react";

import DatasheetModel from "@/types/DatasheetModel";
import datasheetAbilities from "@/assets/json/Datasheets_abilities.json";
import ModelSaveTable from "./ModelSaveTable";

const SavesPhase = ({
  datasheetModel,
}: {
  datasheetModel: DatasheetModel;
}): [React.ReactNode, boolean] => {
  const save = datasheetModel.Sv;
  const invSave = datasheetModel.inv_sv;

  const feelNoPainId = "000008338";
  const fnp = datasheetAbilities.find(
    (ability) =>
      ability.ability_id === feelNoPainId &&
      ability.datasheet_id === datasheetModel.datasheet_id
  );

  const saveText = `${save}`;
  const invSaveText = invSave !== "-" ? `${invSave}++` : "-";
  const fnpText = fnp ? `FNP ${fnp.parameter}` : "-";

  return [
    <ModelSaveTable
      save={saveText}
      invSave={invSaveText}
      fnp={fnpText}
      toughness={datasheetModel.T}
      wounds={datasheetModel.W}
      leadership={datasheetModel.Ld}
    />,
    true,
  ];
};

export default SavesPhase;