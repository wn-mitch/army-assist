import React, { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import PatreonButton from "./Patreon";
import DiscordButton from "./Discord";
import Changelog from "./Changelog";

const FlyoutMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      {!isOpen && (
        <button
          onClick={toggleMenu}
          className="bg-slate-500 text-white rounded p-2 font-bold hover:bg-slate-700 mx-4"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      )}
      <div
        className={`absolute top-0 right-0 transition-transform duration-300 ${
          isOpen ? "transform translate-x-0 visible" : "transform translate-x-full invisible"
        }`}
      >
        <div className="inline-flex flex-row">
          <div className="px-4">
            <PatreonButton />
          </div>
          <div className="px-4">
            <DiscordButton />
          </div>
          <div className="px-4">
            <Changelog />
          </div>
          <div className="px-4">
            <button
              onClick={toggleMenu}
              className="bg-slate-500 text-white rounded p-2 font-bold hover:bg-slate-700"
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyoutMenu;
