import React from "react";
import ResetButton from "./ResetButton";
import Settings from "./Settings";
import Instructions from "./Instructions";
import Changelog from "./Changelog";

const Header = () => {
  return (
    <header className="bg-gray-800 p-4">
      <div className="min-w-0 flex items-center justify-between">
        <div>
        <h2 className="text-2xl font-bold text-white flex-1">Army Assist
          <Changelog />
        </h2>

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
