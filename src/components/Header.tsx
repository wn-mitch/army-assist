import React from "react";
import ResetButton from "./ResetButton";
import Changelog from "./Changelog";
import DiscordButton from "./Discord";
import PatreonButton from "./Patreon";

const Header = () => {
  return (
    <header className="bg-gray-800 p-4">
      <div className="min-w-0 flex">
        <h2 className="text-2xl font-bold text-white flex-1">
          Army Assist
        </h2>
        <PatreonButton />
        <DiscordButton />
        <Changelog />
        <ResetButton />
      </div>
    </header>
  );
};

export default Header;
