import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { FaDiscord, FaLinkedin, FaPatreon } from "react-icons/fa";
import useStore from "@/store/store";

function Instructions() {
  const [isOpen, setIsOpen] = useState(false);
  const isFirstVisit = useStore((state) => state.isFirstVisit);
  const setFirstVisit = useStore((state) => state.setFirstVisit);

  useEffect(() => {
    if (isFirstVisit) {
      setIsOpen(true);
      setFirstVisit(false);
    }
  }, [isFirstVisit, setFirstVisit]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  const buttonClasses =
    "button flex flex-row items-center gap-x-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full items-center justify-center mx-1 my-1";

  return (
    <>
      <button
        onClick={handleShow}
        className="bg-gray-500 text-gray-200 rounded p-2 font-bold hover:bg-gray-700 mx-1"
        aria-label="Open Instructions Panel"
        id="instructions-button"
      >
        <QuestionMarkCircleIcon className="h-8 w-8" />
      </button>

      <Dialog
        open={isOpen}
        onClose={() => {}}
        className="fixed z-10 inset-0 overflow-y-scroll overflow-x-wrap text-black dark:text-gray-100"
      >
        <div className="flex items-center justify-center min-h-screen">
          <DialogPanel className="fixed inset-0 bg-black opacity-30" />

          <div className="my-5 bg-white dark:bg-gray-800 rounded-lg lg:w-3/4 max-w-2xl mx-auto p-4 relative z-20">
            <button
              id="close-changelog"
              onTouchEnd={handleClose}
              onPointerDown={handleClose}
              onPointerUp={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <XCircleIcon className="h-8 w-8" />
            </button>
            <DialogTitle className="text-lg font-bold text-center pb-1">
              Instructions
            </DialogTitle>
            <ol className="list-decimal list-inside text-base">
              <li>
                Create a list on ListForge (listforge.net). If you just want to
                explore the site's features, you can click the sample on the
                List Dashboard
              </li>
              <li>Click Export or Share</li>
              <li>Copy the list text to your clipboard</li>
              <li>Paste into the pastebox</li>
              <li>Please report any issues you find in the discord below</li>
            </ol>

            <DialogTitle className="text-lg font-bold text-center py-1">
              About Me
            </DialogTitle>
            <p className="text-base">
              Hi, I’m Will Mitchell (aka TheAlpacalypse), the developer behind
              ArmyAssist. Your feedback and suggestions are invaluable — please
              come connect with me on Discord or Patreon. Let’s build something
              awesome together!
            </p>

            <div className="mt-4 flex w-full flex-col">
              <div className="flex flex-col lg:flex-row">
                <button
                  id="linkedin-link"
                  onTouchEnd={() =>
                    openLink("https://www.linkedin.com/in/will--mitch/")
                  }
                  onClick={() =>
                    openLink("https://www.linkedin.com/in/will--mitch/")
                  }
                  className={`${buttonClasses} bg-sky-700 hover:bg-sky-800`}
                >
                  <FaLinkedin aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                  Contact me on LinkedIn
                </button>
                <button
                  id="patreon-link"
                  onTouchEnd={() => openLink("https://patreon.com/ArmyAssist")}
                  onClick={() => openLink("https://patreon.com/ArmyAssist")}
                  className={`${buttonClasses} bg-rose-600 hover:bg-rose-500`}
                >
                  <FaPatreon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                  Support me on Patreon
                </button>
                <button
                  id="discord-link"
                  onTouchEnd={() => openLink("https://discord.gg/hVVtGuybhw")}
                  onClick={() => openLink("https://discord.gg/hVVtGuybhw")}
                  className={`${buttonClasses} bg-gray-600 hover:bg-gray-500`}
                >
                  <FaDiscord aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                  Join the Discord
                </button>
              </div>
              <button
                onTouchEnd={handleClose}
                onClick={handleClose}
                className={`${buttonClasses} bg-red-700 hover:bg-red-600`}
                id="close-button"
              >
                <XCircleIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Tap Here to Close
              </button>
            </div>

            <div className="mt-4 text-center text-gray-500">
              Data from game-datacards
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Instructions;
