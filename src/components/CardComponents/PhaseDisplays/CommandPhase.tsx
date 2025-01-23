import React from "react";

import DatasheetModel from "@/types/DatasheetModel";
import LeadershipOCTable from "./LeadershipOCTable";

const CommandPhase = ({
  datasheetModel,
}: {
  datasheetModel: DatasheetModel;
}): [React.ReactNode, boolean] => [
  <LeadershipOCTable leadership={datasheetModel.Ld} oc={datasheetModel.OC} />,
  true,
];

export default CommandPhase;
