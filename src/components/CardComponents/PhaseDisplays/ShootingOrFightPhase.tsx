import React from "react";

import datasheetWargear from "@/assets/json/Datasheets_wargear.json";

import WeaponPhaseTable from "./WeaponPhaseTable";

import Datasheet from "@/types/Datasheet";
import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";

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

  // TODO: Make this a toggleable setting where you can elect to not filter out weapons
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

export default ShootingOrFightPhase;