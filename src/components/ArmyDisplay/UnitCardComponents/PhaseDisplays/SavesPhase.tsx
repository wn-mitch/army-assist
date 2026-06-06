import React from "react";

import ModelSaveTable from "./ModelSaveTable";
import type { UnitView } from "@/data/dataset";
import { formatSave, formatSkill, formatStat } from "@/data/format";
import {
  feelNoPainAbility,
  feelNoPainThreshold,
} from "@/data/rosterSelectors";

const SavesPhase = ({
  view,
}: {
  view: UnitView | undefined;
}): [React.ReactNode, boolean] => {
  if (!view) {
    return [<></>, false];
  }

  const profile = view.profileAt(0);

  const saveText = formatSave(profile.Sv);
  const invSaveText =
    profile.invuln_sv != null ? `${profile.invuln_sv}++` : "-";

  // Feel No Pain: prefer the threshold from the DSL effect; fall back to the
  // ability's own name text when the DSL carries no numeric threshold.
  const fnp = feelNoPainAbility(view);
  const fnpThreshold = feelNoPainThreshold(fnp);
  let fnpText = "-";
  if (fnp) {
    fnpText =
      fnpThreshold !== undefined ? `FNP ${fnpThreshold}+` : fnp.name;
  }

  return [
    <ModelSaveTable
      save={saveText}
      invSave={invSaveText}
      fnp={fnpText}
      toughness={formatStat(profile.T)}
      wounds={formatStat(profile.W)}
      leadership={formatSkill(profile.Ld)}
    />,
    true,
  ];
};

export default SavesPhase;
