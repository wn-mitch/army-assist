import React from "react";
import Pastebox from "./Pastebox";
import useStore from "@/store/store";
import ListDisplay from "./ListDisplay";

function Body() {
  const hasUnits = useStore((state) => state.units.length > 0);

  if (!hasUnits) {
    return (
      <div className="flex flex-1 p-2">
        <Pastebox />
      </div>
    );
  } else {
    return (
      <div className="flex flex-1 p-2">
        <ListDisplay />
      </div>
    );
  }
}

export default Body;
