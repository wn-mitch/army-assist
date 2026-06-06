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
      className={`group mx-4 my-2 px-3 py-1 rounded border border-border col-span-1 flex flex-col break-inside-avoid first:mt-0 cursor-pointer shadow-sm bg-surface focus:outline-accent focus:outline focus:outline-2 focus:-outline-offset-2 hover:bg-panel-hover`}
      onClick={() => addList()}
    >
      <div className="flex flex-col h-full">
        <div
          className={`flex flex-row font-heading font-bold uppercase tracking-wider text-xl align-bottom items-end flex-grow cursor-pointer h-2/3`}
        >
          <div className="flex-row flex-1 text-text">
            <span className="justify-center flex flex-1">Add List</span>
          </div>
        </div>
        <div className="flex justify-center items-start gap-1 text-text h-full w-full">
          <PlusCircleIcon className="h-8 w-8" />
        </div>
      </div>
    </ul>
  );
};

export default AddListButton;
