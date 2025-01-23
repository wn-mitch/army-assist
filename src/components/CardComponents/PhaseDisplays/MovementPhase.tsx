import React from "react";

import DatasheetModel from "@/types/DatasheetModel";

const MovementPhase = ({
  datasheetModel,
}: {
  datasheetModel: DatasheetModel;
}): [React.ReactNode, boolean] => [
  <div className="text-center text-xl font-semibold items-center justify-center align-middle flex flex-col h-full">
    {datasheetModel.M}
  </div>,
  true,
];

export default MovementPhase;
