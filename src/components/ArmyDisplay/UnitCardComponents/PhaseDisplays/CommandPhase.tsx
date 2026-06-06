import React from "react";

import LeadershipOCTable from "./LeadershipOCTable";
import type { UnitView } from "@/data/dataset";
import { formatSkill, formatStat } from "@/data/format";

const CommandPhase = ({
  view,
}: {
  view: UnitView | undefined;
}): [React.ReactNode, boolean] => {
  if (!view) {
    return [<></>, false];
  }
  const profile = view.profileAt(0);
  return [
    <LeadershipOCTable
      leadership={formatSkill(profile.Ld)}
      oc={formatStat(profile.OC)}
    />,
    true,
  ];
};

export default CommandPhase;
