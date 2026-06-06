import React from "react";
import useStore from "@/store/store";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

const ResetButton = () => {
  const store = useStore();

  return (
    <button
      className="bg-danger text-white hover:bg-danger/85 font-bold p-2 rounded mx-1"
      onClick={() => store.reset()}
      id="reset-button"
    >
      <ArrowRightStartOnRectangleIcon className="h-8 w-8" />
    </button>
  );
};

export default ResetButton;
