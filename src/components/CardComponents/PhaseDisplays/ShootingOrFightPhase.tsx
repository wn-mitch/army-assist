import React from "react";

import datasheetWargear from "@/assets/json/Datasheets_wargear.json";

import WeaponPhaseTable from "./WeaponPhaseTable";

import Phase from "@/types/Phase";
import ListUnit from "@/types/ListUnit";

const ShootingOrFightPhase = ({
  unit,
  phase,
  weaponsFilter
}: {
  unit: ListUnit;
  phase: Phase;
  weaponsFilter: boolean;
}): [React.ReactNode, boolean] => {
  const availableWeaponDatasheets = datasheetWargear
    .filter((wargear) =>
      phase === "Shooting"
        ? wargear.type === "Ranged"
        : wargear.type === "Melee"
    )
    .filter(
      (wargear) => unit.datasheet && unit.datasheet.id === wargear.datasheet_id
    );

  const filteredWeaponDatasheets = weaponsFilter
    ? availableWeaponDatasheets.filter((weapon) =>
        (unit.weapons ?? []).some((name) => {
          return weapon.name?.toLowerCase().includes(name.toLowerCase());
        })
      )
    : availableWeaponDatasheets;

  const toggled = filteredWeaponDatasheets.length > 0;

  return [
    <WeaponPhaseTable weaponDatasheets={filteredWeaponDatasheets} />,
    toggled,
  ];
};

export default ShootingOrFightPhase;
