import useStore from "@/store/store";
import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import clsx from "clsx";
import { buttonClasses, menuItemClasses } from "@/components/ui/buttonStyles";

const DeleteListButton = ({
  uuid,
  isDropdown,
}: {
  uuid: string;
  isDropdown: boolean;
}) => {
  const deleteList = useStore((state) => state.deleteList);
  const listDisplaySetting = useStore(
    (state) => state.settings.listDisplaySetting
  );

  const classes = isDropdown
    ? clsx(menuItemClasses, "text-danger")
    : buttonClasses(
        "danger",
        "sm",
        listDisplaySetting ? "mx-2" : "flex flex-grow justify-center"
      );

  return (
    <button
      className={classes}
      id={`delete-list-${uuid}-button`}
      aria-label="Delete list"
      onClick={() => {
        const confirmation = window.confirm(
          "Are you sure you want to delete this list?"
        );
        if (confirmation) {
          deleteList(uuid);
        }
      }}
    >
      {isDropdown ? <span>Delete</span> : <TrashIcon className="h-6 w-6" />}
    </button>
  );
};

export default DeleteListButton;
