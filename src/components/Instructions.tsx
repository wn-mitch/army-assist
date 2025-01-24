import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  ClipboardIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { FaDiscord, FaLinkedin, FaPatreon } from "react-icons/fa";
import useStore from "@/store/store";
import nrWorldEaters from "@/assets/lists/nr_tau.txt";

function Instructions() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
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

    useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch(nrWorldEaters);
        const text = await response.text();
        setText(text);
      } catch (err) {
        console.error("Failed to fetch text: ", err);
      }
    };

    fetchText();
  }, []);

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  const copySampleToClipboard = async () => {
    try {
      await navigator.clipboard
        .write([
          new ClipboardItem({
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ])
        .then(() => alert("Sample list copied to clipboard!"));
    } catch (err) {
      alert(`${err}`);
      console.error("Failed to copy: ", err);
    }
  };

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  const buttonClasses =
    "button flex flex-row items-center gap-x-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full items-center justify-center mx-1 my-1";

  return (
    <>
      <button
        onTouchEnd={handleShow}
        className="bg-gray-500 text-gray-200 rounded p-2 font-bold hover:bg-gray-700 mx-1"
      >
        <QuestionMarkCircleIcon className="h-6 w-6" />
      </button>

      <Dialog
        open={isOpen}
        onClose={() => {}}
        className="fixed z-10 inset-0 overflow-y-scroll overflow-x-wrap text-black dark:text-gray-100"
      >
        <div className="flex items-center justify-center min-h-screen">
          <DialogPanel className="fixed inset-0 bg-black opacity-30" />

          <div className="my-5 bg-white dark:bg-gray-800 rounded-lg lg:w-3/4 max-w-lg mx-auto p-4 relative z-20">
            <button
              id="close-changelog"
              onTouchEnd={handleClose}
              onPointerDown={handleClose}
              onPointerUp={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
            <DialogTitle className="text-lg font-bold text-center pb-1">
              Instructions & Changelog
            </DialogTitle>
            <ol className="list-decimal list-inside text-base">
              <li>
                Create a list on NewRecruit.eu. If you don't know what that is,
                or just want to explore the site's features before deciding to
                rebuild a list, you can click the button to copy a sample to
                your clipboard
                <button
                  onTouchEnd={copySampleToClipboard}
                  className={`${buttonClasses} bg-gray-600 hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-400 dark:hover:text-gray-800 shadow-md cursor-pointer`}
                >
                  <ClipboardIcon
                    aria-hidden="true"
                    className="-ml-0.5 h-5 w-5"
                  />
                  Copy Sample
                </button>
              </li>
              <li>Click Export</li>
              <li>Click the "Text" Option</li>
              <li>Select the Format as "NR"</li>
              <li>
                Under the "Export Options" dropdown, ensure "Include constant
                selections" is checked
              </li>
              <li>Click Copy to Clipboard</li>
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

            <div className="mt-4 flex lg:flex-row w-full flex-col sm:flex-col">
              <button
                onTouchEnd={handleClose}
                className={`${buttonClasses} bg-red-700 hover:bg-red-600`}
              >
                <XCircleIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Tap Here to Close
              </button>
              <button
                onTouchEnd={() =>
                  openLink("https://www.linkedin.com/in/will--mitch/")
                }
                className={`${buttonClasses} bg-sky-700 hover:bg-sky-800`}
              >
                <FaLinkedin aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Contact me on LinkedIn
              </button>
              <button
                onTouchEnd={() => openLink("https://patreon.com/ArmyAssist")}
                className={`${buttonClasses} bg-rose-600 hover:bg-rose-500`}
              >
                <FaPatreon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Support me on Patreon
              </button>
              <button
                onTouchEnd={() => openLink("https://discord.gg/hVVtGuybhw")}
                className={`${buttonClasses} bg-gray-600 hover:bg-gray-500`}
              >
                <FaDiscord aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Join the Discord
              </button>
            </div>

            <div className="mt-4 text-center text-gray-500">
              Powered by Wahapedia
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Instructions;
