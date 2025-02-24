import React from "react";

import LeadershipOCTable from "./LeadershipOCTable";
import ListUnit from "@/types/ListUnit";

const CommandPhase = ({
  unit,
}: {
  unit: ListUnit;
}): [React.ReactNode, boolean] => {
  if (!unit.datasheetModel) {
    window.alert("Error!");
    return [<></>, false];
  } else {
    return [
      <LeadershipOCTable
        leadership={unit.datasheetModel.Ld}
        oc={unit.datasheetModel.OC}
      />,
      true,
    ];
  }
};

export default CommandPhase;
