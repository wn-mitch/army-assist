import React from "react";

import useStore from "@/store/store";

import datasheetsModels from "@/assets/json/Datasheets_models.json";
import datasheets from "@/assets/json/Datasheets.json";
import datasheetWargear from "@/assets/json/Datasheets_wargear.json";
import datasheetAbilities from "@/assets/json/Datasheets_abilities.json";

import ListUnit from "@/types/ListUnit";
import Datasheet from "@/types/Datasheet";
import DatasheetModel from "@/types/DatasheetModel";
import Phase from "@/types/Phase";

import WeaponPhaseTable from "@/components/PhaseDisplays/WeaponPhaseTable";
import ModelSaveTable from "@/components/PhaseDisplays/ModelSaveTable";
import PhaseAbilities from "@/components/PhaseAbilities";
import LeadershipOCTable from "@/components/PhaseDisplays/LeadershipOCTable";

const CommandPhase = ({
  datasheetModel,
}: {
  datasheetModel: DatasheetModel;
}): [React.ReactNode, boolean] => [
  <LeadershipOCTable leadership={datasheetModel.Ld} oc={datasheetModel.OC} />,
  true,
];

const MovementPhase = ({
  datasheetModel,
}: {
  datasheetModel: DatasheetModel;
}): [React.ReactNode, boolean] => [
  <div className="text-center text-xl font-extrabold">{datasheetModel.M}</div>,
  true,
];

const ChargePhase = (): [React.ReactNode, boolean] => [
  <div className="text-center text-xl font-extrabold">2d6</div>,
  true,
];

const ShootingOrFightPhase = ({
  unit,
  datasheet,
  phase,
}: {
  unit: ListUnit;
  datasheet: Datasheet;
  phase: Phase;
}): [React.ReactNode, boolean] => {
  if (unit.children && unit.children.length > 0) {
    const details = unit.children.map((child) => child.details).join(", ");
    unit.details = unit.details
      ? [...unit.details.split(", "), details].join(", ")
      : details;
    unit.children = [];
  }

  let weapons = unit.details
    ?.split(/,(?![^(]*\))/)
    .filter((name) => name !== "Warlord" && name !== "")
    .map((name) => name.replace(/^\d+x?\s*/, "").trim())
    .flatMap((name) => {
      // Remove content within parentheses and split by '&' if present
      const cleanedName = name.replace(/\s*\((.*?)\)\s*/g, ", $1").trim();
      return cleanedName.split(",").map((part) => part.trim());
    });
  
  if (datasheet.id === "000000613") {
    weapons = weapons ? [...weapons, "Wraithbone fists"] : ["Wraithbone fists"];
  }

  if (datasheet.id === "000002565") {
    weapons = weapons ? [...weapons, "Armoured limbs"] : ["Armoured limbs"];
  }

  weapons = weapons?.flatMap((weapon) => {
    const match = weapon.match(/(\d+)x\s+([A-Za-z\s-]+)/);
    if (match) {
      const count = parseInt(match[1], 10);
      const weaponName = match[2];
      return Array(count).fill(weaponName);
    }
    return weapon;
  });

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

  return [
    <WeaponPhaseTable weaponDatasheets={availableWeaponDatasheets} />,
    toggled,
  ];
};

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

function ListUnitCard({ unit }: { unit: ListUnit }) {
  const phase = useStore((state) => state.phase);
  const toggleUnit = useStore((state) => state.toggleUnit);
  const faction = useStore((state) => state.faction);

  if (!phase) {
    window.alert("Phase not set");
  }

  if (!faction) {
    window.alert("Faction not set");
  }

  const datasheetsMatchingName = datasheets.filter(
    (item) => item.name.toLowerCase() === unit.name.toLowerCase()
  );

  // Create an array of all unique factions in the datasheets
  const uniqueFactions = Array.from(
    new Set(datasheetsMatchingName.map((item) => item.faction_id))
  );

  // @ts-expect-error - Line 145 has a check that should prevent this from being null
  const datasheet = uniqueFactions.includes(faction)
    ? datasheetsMatchingName.filter((item) => item.faction_id === faction)[0]
    : datasheetsMatchingName[0];

  if (!datasheet) {
    window.alert(`Datasheet not found for unit ${unit.name}`);
    return null;
  }

  const datasheetModel = datasheetsModels.find(
    (datasheetModel: DatasheetModel) =>
      datasheetModel.datasheet_id === datasheet.id
  );

  if (!datasheetModel) {
    window.alert(`Datasheet model not found for unit ${unit.name}`);
    return null;
  }

  let characteristic: React.ReactNode;
  let toggled = true;

  switch (phase) {
    case Phase.Command:
      [characteristic, toggled] = CommandPhase({ datasheetModel });
      break;
    case Phase.Movement:
      [characteristic, toggled] = MovementPhase({ datasheetModel });
      break;
    case Phase.Shooting:
    case Phase.Fight:
      [characteristic, toggled] = ShootingOrFightPhase({
        unit,
        datasheet,
        phase,
      });
      break;
    case Phase.Charge:
      [characteristic, toggled] = ChargePhase();
      break;
    case Phase.Saves:
      [characteristic, toggled] = SavesPhase({ datasheetModel });
      break;
    default:
      characteristic = (
        <div className="text-center text-xl font-extrabold">BROKEN</div>
      );
      toggled = false;
  }

  // @ts-expect-error - This works. Not sure why flagged.
  const [phasedAbilities, abilitiesToggle] = PhaseAbilities({
    datasheetModel,
    phase,
  });
  const fadedClasses =
    unit.toggled && (toggled || abilitiesToggle) ? "" : "opacity-50";

  return (
    <ul
      key={unit.datasheet_id}
      className={`col-span-1 rounded-lg py-1 px-1 flex flex-col break-inside-avoid my-2 first:mt-0 shadow bg-slate-600 text-gray-200 ${fadedClasses}`}
      onClick={() => toggleUnit(unit)}
    >
      <div className="text-center text-lg font-bold rounded-lg bg-slate-900">
        {unit.name}
      </div>
      {characteristic}
      {phasedAbilities}
    </ul>
  );
}

export default ListUnitCard;
