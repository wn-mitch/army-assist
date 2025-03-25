import React from "react";
import useStore from "@/store/store";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

const ResetButton = () => {
  const store = useStore();

  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded mx-1 dark:bg-red-700 dark:hover:bg-red-800"
      onClick={() => store.reset()}
      id="reset-button"
    >
      <ArrowRightStartOnRectangleIcon className="h-8 w-8" />
    </button>
  );
};

export default ResetButton;
