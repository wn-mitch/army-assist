import useStore from "@/store/store";
import React from "react";
import ScrollToTopButton from "../ScrollToTopButton";
import TableLayout from "./TableLayout";
import TileLayout from "./TileLayout";
import DisplaySettingToggle from "./DisplaySettingToggle";

const StoredListDisplay = () => {
  const storedLists = useStore((state) => state.storedLists);
  const displaySetting = useStore((state) => state.settings.listDisplaySetting);

  return (
    <div
      className="flex flex-col gap-2 w-full mt-2 px-3"
      id="stored-lists-display"
    >
      {displaySetting ? (
        <TableLayout storedLists={storedLists} />
      ) : (
        <TileLayout storedLists={storedLists} />
      )}
      <DisplaySettingToggle />
      <ScrollToTopButton />
    </div>
  );
};

export default StoredListDisplay;
