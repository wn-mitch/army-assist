import React from "react";

import ListUnit from "@/types/ListUnit";
import useStore from "@/store/store";
import datasheetsModels from "@/assets/json/Datasheets_models.json";
import datasheets from "@/assets/json/Datasheets.json";
import datasheetWargear from "@/assets/json/Datasheets_wargear.json";
import Datasheet from "@/types/Datasheet";
import DatasheetModel from "@/types/DatasheetModel";
import Phase from "@/types/Phase";
import WeaponPhaseTable from "@/components/WeaponPhaseTable";

const CommandPhase: React.FC<{ datasheetModel: DatasheetModel }> = ({ datasheetModel }) => ({
  component: (
    <div className="text-center text-xl font-extrabold">
      {datasheetModel.Ld}
    </div>
  ),
  toggled: true,
});

const MovementPhase: React.FC<{ datasheetModel: DatasheetModel }> = ({ datasheetModel }) => ({
  component: (
    <div className="text-center text-xl font-extrabold">
      {datasheetModel.M}
    </div>
  ),
  toggled: true,
});

const ChargePhase: {React.FC} = () => ({
  component: (
    <div className="text-center text-xl font-extrabold">2d6</div>
  ),
  toggled: true,
});

const ShootingOrFightPhase = ({ unit, datasheet, phase }) => {
  const weapons = unit.details
    ?.split(", ")
    .filter((name) => name !== "Warlord" && name !== "")
    .map((name) => name.replace(/^\d+x?\s*/, "").trim());

  const availableWeaponDatasheets = datasheetWargear
    .filter((wargear) =>
      phase === "Shooting"
        ? wargear.type === "Ranged"
        : wargear.type === "Melee"
    )
    .filter((wargear) => datasheet.id === wargear.datasheet_id)
    .filter((weapon) =>
      (weapons ?? []).some((name) => {
        return weapon.name?.toLowerCase().includes(name.toLowerCase());
      })
    );

  const toggled = availableWeaponDatasheets.length > 0;

  return {
    component: (
      <WeaponPhaseTable unit={unit} datasheet={datasheet} />
    ),
    toggled,
  };
};

function ListUnitCard({ unit }: { unit: ListUnit }) {
  const phase = useStore((state) => state.phase);
  const toggleUnit = useStore((state) => state.toggleUnit);
  const faction = useStore((state) => state.faction);

  if (!phase) {
    throw new Error("Phase not set");
  }

  if (!faction) {
    throw new Error("Faction not set");
  }

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

  let characteristic;
  let toggled = true;

  switch (phase) {
    case Phase.Command:
      ({ component: characteristic, toggled } = CommandPhase({ datasheetModel }));
      break;
    case Phase.Movement:
      ({ component: characteristic, toggled } = MovementPhase({ datasheetModel }));
      break;
    case Phase.Shooting:
    case Phase.Fight:
      ({ component: characteristic, toggled } = ShootingOrFightPhase({ unit, datasheet, phase }));
      break;
    case Phase.Charge:
      ({ component: characteristic, toggled } = ChargePhase());
      break;
    default:
      characteristic = <div className="text-center text-xl font-extrabold">BROKEN</div>;
      toggled = false;
  }

  if(toggled && !unit.toggled) {
    toggleUnit(unit);
  }

  const fadedClasses = unit.toggled && toggled ? "" : "opacity-50";

  return (
    <li
      key={unit.id}
      className={`col-span-1 border-4 border-gray-900 rounded-lg py-1 px-1 flex flex-col break-inside-avoid my-1 first:mt-0 shadow bg-slate-600 text-gray-200 ${fadedClasses}`}
      onClick={() => toggleUnit(unit)}
    >
      <div className="text-center text-lg font-bold rounded-lg bg-slate-900">
        {unit.name}
      </div>
      {characteristic}
    </li>
  );
}

export default ListUnitCard;
