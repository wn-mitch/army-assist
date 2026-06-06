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
      return "block text-text px-4 py-2 text-sm";
    } else {
      return listDisplaySetting
        ? "bg-success text-white hover:bg-success/85 rounded p-1 shadow-sm mx-2 rounded-2xl"
        : "flex flex-grow justify-center bg-success text-white hover:bg-success/85 rounded p-1 shadow-sm";
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
