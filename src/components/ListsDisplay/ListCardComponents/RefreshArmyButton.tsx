import useStore from "@/store/store";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React from "react";

const RefreshArmyButton = ({
  uuid,
  isDropdown,
}: {
  uuid: string;
  isDropdown: boolean;
}) => {
  const refreshArmy = useStore((state) => state.refreshArmy);
  const listDisplaySetting = useStore(
    (state) => state.settings.listDisplaySetting
  );

  const buttonClasses = () => {
    if (isDropdown) {
      return "block text-gray-700 px-4 py-2 text-sm";
    } else {
      return listDisplaySetting
        ? "bg-green-400 dark:bg-green-600 hover:bg-green-500 dark:text-white hover:text-white dark:hover:bg-green-400 rounded-lg p-1 shadow-sm shadow-green-500 dark:shadow-green-600 mx-2 rounded-2xl"
        : "flex flex-grow justify-center bg-green-400 dark:bg-green-600 hover:bg-green-500 hover:text-white dark:hover:bg-green-400 rounded-lg p-1 shadow-sm shadow-green-500 dark:shadow-green-700";
    }
  };

  return (
    <button
      className={buttonClasses()}
      id={`refresh-list-${uuid}-button`}
      onClick={() => {
        refreshArmy(uuid);
        window.alert("Army Refreshed!");
      }}
    >
      {isDropdown ? (
        <span>Refresh Army</span>
      ) : (
        <ArrowPathIcon className="h-8 w-8" />
      )}
    </button>
  );
};

export default RefreshArmyButton;
