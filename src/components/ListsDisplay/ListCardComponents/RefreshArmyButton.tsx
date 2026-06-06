import useStore from "@/store/store";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React from "react";
import { buttonClasses, menuItemClasses } from "@/components/ui/buttonStyles";

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

  const classes = isDropdown
    ? menuItemClasses
    : buttonClasses(
        "standard",
        "sm",
        listDisplaySetting ? "mx-2" : "flex flex-grow justify-center"
      );

  return (
    <button
      className={classes}
      id={`refresh-list-${uuid}-button`}
      aria-label="Refresh army"
      onClick={() => {
        refreshArmy(uuid);
        window.alert("Army Refreshed!");
      }}
    >
      {isDropdown ? (
        <span>Refresh Army</span>
      ) : (
        <ArrowPathIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default RefreshArmyButton;
