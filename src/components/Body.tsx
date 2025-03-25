import React from "react";
import useStore from "@/store/store";
import SingleListDisplay from "./ArmyDisplay/SingleListDisplay";
import StoredListDisplay from "./ListsDisplay/StoredListsDisplay";

function Body() {
  const activeListIndex = useStore((state) => state.activeList);
  const hasActiveList = activeListIndex >= 0;

  const bodyContent = () => {
    if (!hasActiveList) {
      return <StoredListDisplay />;
    } else {
      return <SingleListDisplay activeListIndex={activeListIndex}/>
    }
  };

  return (
    <div className="flex flex-1 bg-gray-200 dark:bg-gray-900">
      {bodyContent()}
    </div>
  );
}

export default Body;
