import useStore from "@/store/store";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

const AddListRow = () => {
  const addList = useStore((state) => state.addList);

  return (
    <tr
      key={"add"}
      id="add-list-button"
      className="text-center hover:bg-gray-100 hover:dark:bg-gray-900 cursor-pointer"
      onClick={() => addList()}
    >
      <td
        colSpan={6}
        className="px-3 py-3 text-center font-semibold text-gray-900 dark:text-gray-100 cursor-pointer"
      >
        <div className="flex justify-center items-center gap-2">
          <span>Add New List</span>
          <PlusCircleIcon className="h-6 w-6" />
        </div>
      </td>
    </tr>
  );
};

export default AddListRow;
