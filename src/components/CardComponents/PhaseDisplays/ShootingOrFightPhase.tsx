import React from "react";

import datasheetWargear from "@/assets/json/Datasheets_wargear.json";

import WeaponPhaseTable from "./WeaponPhaseTable";

import Datasheet from "@/types/Datasheet";
import Phase from "@/types/Phase";

const ShootingOrFightPhase = ({
  unitSelections,
  datasheet,
  phase,
}: {
  unitSelections: string[];
  datasheet: Datasheet;
  phase: Phase;
}): [React.ReactNode, boolean] => {
  // TODO: Make this a toggleable setting where you can elect to not filter out weapons
  const availableWeaponDatasheets = datasheetWargear
    .filter((wargear) =>
      phase === "Shooting"
        ? wargear.type === "Ranged"
        : wargear.type === "Melee"
    )
    .filter((wargear) => datasheet.id === wargear.datasheet_id)
    .filter((weapon) =>
      (unitSelections ?? []).some((name) => {
        return weapon.name?.toLowerCase().includes(name.toLowerCase());
      })
    );

  const toggled = availableWeaponDatasheets.length > 0;

  return [
    <WeaponPhaseTable weaponDatasheets={availableWeaponDatasheets} />,
    toggled,
  ];
};

export default ShootingOrFightPhase;
