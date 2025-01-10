import React from "react";

import datasheetsModels from "@/assets/json/Datasheets_models.json";
import datasheets from "@/assets/json/Datasheets.json";

import DatasheetModel from "@/types/DatasheetModel";
import Phase from "@/types/Phase";
import ListUnit from "@/types/ListUnit";

import WeaponPhaseTable from "@/components/WeaponPhaseTable";

export function getDatasheetCharacteristicByPhase(
  unit: ListUnit,
  phase: Phase,
  faction: string
) {
  const datasheet = datasheets
    .filter((item) => item.faction_id === faction)
    .filter((item) => item.name.toLowerCase() === unit.name.toLowerCase())[0];

  if (!datasheet) {
    throw new Error(`Datasheet not found for unit ${unit.name}`);
  }

  const datasheetModel = datasheetsModels.find(
    (datasheetModel: DatasheetModel) =>
      datasheetModel.datasheet_id === datasheet.id
  );

  if (!datasheetModel) {
    throw new Error(`Datasheet model not found for unit ${unit.name}`);
  }

  switch (phase) {
    case Phase.Command:
      return (
        <div className="text-center text-xl font-extrabold">
          {datasheetModel.Ld}
        </div>
      );
    case Phase.Movement:
      return (
        <div className="text-center text-xl font-extrabold">
          {datasheetModel.M}
        </div>
      );
    case Phase.Shooting:
      return (
        <WeaponPhaseTable
          unit={unit}
          datasheet={datasheet}
        />
      );
    case Phase.Charge:
      return <div className="text-center text-xl font-extrabold">2d6</div>;
    case Phase.Fight:
      return (
        <WeaponPhaseTable
          unit={unit}
          datasheet={datasheet}
        />
      );
    default:
      return <div className="text-center text-xl font-extrabold">BROKEN</div>;
  }
}
