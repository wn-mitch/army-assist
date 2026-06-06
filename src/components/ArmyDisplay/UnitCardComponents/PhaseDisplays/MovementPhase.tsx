import React from "react";

import type { UnitView } from "@/data/dataset";
import { formatInches } from "@/data/format";

const MovementPhase = ({
  view,
}: {
  view: UnitView | undefined;
}): [React.ReactNode, boolean] => [
  <div className="text-center text-xl font-semibold items-center justify-center align-middle flex flex-col h-full dark:text-gray-100">
    {view ? formatInches(view.profileAt(0).M) : "-"}
  </div>,
  true,
];

export default MovementPhase;
