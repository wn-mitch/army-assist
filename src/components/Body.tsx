import React from "react";
import Pastebox from "./Pastebox";
import useStore from "@/store/store";
import ListDisplay from "./ListDisplay";

function Body() {
  const hasUnits = useStore((state) => state.units.length > 0);

  const bodyContent = hasUnits ? <ListDisplay /> : <Pastebox />;

    return (
      <div className="flex flex-1 bg-gray-200 dark:bg-gray-900">
        {bodyContent}
      </div>
    );
}

export default Body;
