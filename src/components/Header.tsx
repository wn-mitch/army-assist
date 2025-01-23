import React from "react";
import ResetButton from "./ResetButton";
import Settings from "./Settings";
import Instructions from "./Instructions";
import Changelog from "./Changelog";

const Header = () => {
  return (
    <header className="bg-gray-800 px-4 py-2">
      <div className="min-w-0 flex items-center justify-between">
        <div className="flex flex-row justify-center items-center">
          <h2 className="text-xl font-bold text-white inline-flex ">
            ArmyAssist.xyz
          </h2>
          <Changelog />
        </div>
        <div className="flex items-center gap-2">
          <Instructions />
          <Settings />
          <ResetButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
