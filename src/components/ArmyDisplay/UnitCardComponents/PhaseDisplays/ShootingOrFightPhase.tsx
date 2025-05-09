import React from "react";

import WeaponPhaseTable from "./WeaponPhaseTable";

import Phase from "@/types/Phase";
import DatasheetWargear from "@/types/DatasheetWargear";

const ShootingOrFightPhase = ({
  counts,
  phasedWeapons,
  phase,
}: {
  counts: Record<string, number>;
  phasedWeapons: DatasheetWargear[];
  phase: Phase;
}): [React.ReactNode, boolean] => {
  console.log(phasedWeapons)
  const toggled = phasedWeapons.length > 0;

  return [
    <WeaponPhaseTable
      counts={counts}
      weaponDatasheets={phasedWeapons}
      phase={phase}
    />,
    toggled,
  ];
};

export default ShootingOrFightPhase;
