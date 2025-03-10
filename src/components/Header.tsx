import React from "react";
import ResetButton from "./ResetButton";
import Settings from "./Settings";
import Instructions from "./Instructions";
import Changelog from "./Changelog";
import Print from "./Print";

const Header = () => {
  return (
    <header className="bg-gray-800 dark:bg-gray-950 px-2 py-2">
      <div className="min-w-0 flex items-center justify-between">
        <div className="flex flex-row justify-center items-center">
          <h2 className="text-xl font-bold text-white dark:text-gray-100 inline-flex">
            ArmyAssist.xyz
          </h2>
          <Changelog />
        </div>
        <div className="flex items-center gap-1">
          <Print />
          <Instructions />
          <Settings />
          <ResetButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
