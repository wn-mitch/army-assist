import React from "react";
import useStore from "@/store/store";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

const AddListButton = () => {
  const addList = useStore((state) => state.addList);

  return (
    <ul
      key={"add"}
      id="add-list-button"
      tabIndex={0}
      className={`group mx-4 my-2 px-3 py-1 rounded-lg border col-span-1 flex flex-col break-inside-avoid first:mt-0 cursor-pointer shadow-sm bg-gray-50 dark:bg-gray-800 border-gray-50 dark:border-gray-700 focus:outline-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 dark:focus:outline-gray-800 dark:focus:outline dark:focus:outline-2 dark:focus:-outline-offset-2 hover:bg-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-800`}
      onClick={() => addList()}
    >
      <div className="flex flex-col h-full">
        <div
          className={`flex flex-row font-semibold text-xl align-bottom items-end flex-grow cursor-pointer h-2/3`}
        >
          <div className="flex-row flex-1 text-black dark:text-gray-50">
            <span className="justify-center flex flex-1">Add List</span>
          </div>
        </div>
        <div className="flex justify-center items-start gap-1 text-black dark:text-gray-50 h-full w-full">
          <PlusCircleIcon className="h-8 w-8" />
        </div>
      </div>
    </ul>
  );
};

export default AddListButton;
