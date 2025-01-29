import React from "react";

import LeadershipOCTable from "./LeadershipOCTable";
import ListUnit from "@/types/ListUnit";

const CommandPhase = ({
  unit,
}: {
  unit: ListUnit;
}): [React.ReactNode, boolean] => [
  <LeadershipOCTable leadership={unit.datasheetModel.Ld} oc={unit.datasheetModel.OC} />,
  true,
];

export default CommandPhase;
