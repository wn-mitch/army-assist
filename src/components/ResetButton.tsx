import React from "react";
import useStore from "@/store/store";

const ResetButton = () => {
  const store = useStore();

  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1 dark:bg-red-700 dark:hover:bg-red-800"
      onTouchEnd={() => store.reset()}
    >
      Reset
    </button>
  );
}

export default ResetButton;