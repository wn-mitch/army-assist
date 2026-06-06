import useStore from "@/store/store";
import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";

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

  const buttonClasses = () => {
    if (isDropdown) {
      return "block text-text px-4 py-2 text-sm";
    } else {
      return listDisplaySetting
        ? "bg-danger text-white hover:bg-danger/85 rounded p-1 shadow-sm mx-2 rounded-2xl"
        : "flex flex-grow justify-center bg-danger text-white hover:bg-danger/85 rounded p-1 shadow-sm";
    }
  };

  return (
    <button
      className={buttonClasses()}
      id={`delete-list-${uuid}-button`}
      onClick={() => {
        const confirmation = window.confirm(
          "Are you sure you want to delete this list?"
        );
        if (confirmation) {
          deleteList(uuid);
        }
      }}
    >
      {isDropdown ? <span>Delete</span> : <TrashIcon className="h-8 w-8" />}
    </button>
  );
};

export default DeleteListButton;
