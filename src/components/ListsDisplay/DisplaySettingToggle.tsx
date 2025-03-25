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

  const onClasses = "bg-white text-blue-600 rounded-md hover:bg-gray-100";
  const offClasses = "text-white bg-blue-700 rounded-md hover:bg-blue-800";

  return (
    <button
      onClick={() => toggleListDisplaySetting(!listDisplaySetting)}
      className="fixed bottom-4 right-20 bg-blue-600 text-white rounded-md p-2 font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2"
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
