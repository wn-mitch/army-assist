import React from "react";

import ListUnit from "@/types/ListUnit";

const MovementPhase = ({
  unit,
}: {
  unit: ListUnit;
}): [React.ReactNode, boolean] => [
  <div className="text-center text-xl font-semibold items-center justify-center align-middle flex flex-col h-full dark:text-gray-100">
    {unit.datasheetModel && unit.datasheetModel.M}
  </div>,
  true,
];

export default MovementPhase;
