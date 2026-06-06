import React from "react";

import WeaponPhaseTable from "./WeaponPhaseTable";

import Phase from "@/types/Phase";
import type { RosterWeapon } from "@/data/rosterSelectors";

const ShootingOrFightPhase = ({
  weapons,
  phase,
}: {
  weapons: RosterWeapon[];
  phase: Phase;
}): [React.ReactNode, boolean] => {
  const toggled = weapons.length > 0;

  return [<WeaponPhaseTable weapons={weapons} phase={phase} />, toggled];
};

export default ShootingOrFightPhase;
