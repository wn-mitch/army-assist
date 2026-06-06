import React from "react";
import { Squares2X2Icon, TableCellsIcon } from "@heroicons/react/24/outline";
import useStore from "@/store/store";

const DisplaySettingToggle = () => {
  const listDisplaySetting = useStore(
    (state) => state.settings.listDisplaySetting
  );
  const toggleListDisplaySetting = useStore(
    (state) => state.setListDisplaySetting
  );

  const onClasses = "bg-accent text-accent-foreground rounded hover:bg-accent-hover";
  const offClasses = "text-text bg-panel rounded hover:bg-panel-hover";

  return (
    <button
      onClick={() => toggleListDisplaySetting(!listDisplaySetting)}
      className="fixed bottom-4 right-20 bg-accent text-accent-foreground rounded p-2 font-bold hover:bg-accent-hover shadow-xl flex items-center gap-2"
      aria-label="Toggle the display setting"
      id="display-toggle"
    >
      <TableCellsIcon
        className={`p-1 h-8 w-8 ${listDisplaySetting ? onClasses : offClasses}`}
      />
      <Squares2X2Icon
        className={`p-1 h-8 w-8 ${!listDisplaySetting ? onClasses : offClasses}`}
      />
    </button>
  );
};

export default DisplaySettingToggle;
