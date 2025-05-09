import React from "react";

import ListUnit from "@/types/ListUnit";

const PregamePhase = ({
  unit,
}: {
  unit: ListUnit;
}): [React.ReactNode, boolean] => {
  if (!unit.datasheetModel) {
    window.alert("Error!");
    return [<></>, false];
  } else {
    return [
      <div className="text-center text-xl font-semibold items-center justify-center align-middle flex flex-col h-full dark:text-gray-200 text-gray-800">
        Deployed?
      </div>,
      true,
    ];
  }
};

export default PregamePhase;
