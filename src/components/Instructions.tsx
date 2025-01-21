import React, { useState, useEffect } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
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

  const copySampleToClipboard = async () => {
    try {
      const response = await fetch(nrWorldEaters);
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      alert("Sample copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  const buttonClasses =
    "button flex flex-row items-center gap-x-1.5 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full items-center justify-center mx-1 my-1";

  return (
    <>
      <button
        onClick={handleShow}
        className="bg-slate-500 text-white rounded p-2 font-bold hover:bg-slate-700 mx-1"
      >
        <QuestionMarkCircleIcon className="h-6 w-6" />
      </button>

      <Dialog
        open={isOpen}
        onClose={() => {}}
        className="fixed z-10 inset-0 overflow-y-scroll overflow-x-wrap"
      >
        <div className="flex items-center justify-center min-h-screen">
          <DialogPanel className="fixed inset-0 bg-black opacity-30" />

          <div className="bg-white rounded w-2/3 mx-auto p-6 relative z-20">
            <button
              id="close-changelog"
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
            <DialogTitle className="text-xl font-bold text-center">
              Instructions & Changelog
            </DialogTitle>
            <ol className="list-decimal list-inside">
              <li>
                Create a list on NewRecruit.eu. If you don't know what that is,
                or just want to explore the site's features before deciding to
                rebuild a list, you can click the button to copy a sample to
                your clipboard
                <button
                  onClick={copySampleToClipboard}
                  onTouchEnd={copySampleToClipboard}
                  className={`${buttonClasses} bg-gray-600 hover:bg-gray-500`}
                >
                  <ClipboardIcon
                    aria-hidden="true"
                    className="-ml-0.5 h-5 w-5"
                  />
                  Copy Sample
                </button>
              </li>
              <li>Click Export</li>
              <li>Click the Text Option</li>
              <li>Select the Format as NR</li>
              <li>Click Copy to Clipboard</li>
              <li>Paste into the pastebox</li>
              <li>
                Please report any issues you find in the discord linked in this
                modal.
              </li>
            </ol>

            <br />
            <DialogTitle className="text-xl font-bold text-center">
              About Me
            </DialogTitle>
            <p>
              Hi, I’m Will Mitchell (aka TheAlpacalypse), the developer behind
              ArmyAssist. By day, I’m a technical project manager, but I’ve
              always enjoyed keeping my web development skills sharp. As a
              Warhammer 40k enthusiast looking to streamline my own gaming
              experience, I created this tool to make playing more seamless and
              fun.
              <br />
              <br />
              I’ve always been passionate about blending technology and gaming,
              and I’m thrilled to share this resource with the community. Your
              feedback and suggestions are invaluable—feel free to connect with
              me on Discord or Patreon. Let’s build something awesome together!
            </p>

            <div className="mt-4 flex lg:flex-row w-full flex-col sm:flex-col">
              <button
                onClick={handleClose}
                onTouchEnd={handleClose}
                className={`${buttonClasses} bg-red-600 hover:bg-red-500`}
              >
                <XCircleIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Tap Here to Close
              </button>
              <button
                onClick={() =>
                  openLink("https://www.linkedin.com/in/will--mitch/")
                }
                onTouchEnd={() =>
                  openLink("https://www.linkedin.com/in/will--mitch/")
                }
                className={`${buttonClasses} bg-sky-700 hover:bg-sky-800`}
              >
                <FaLinkedin aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Contact me on LinkedIn
              </button>
              <button
                onClick={() => openLink("https://patreon.com/ArmyAssist")}
                onTouchEnd={() => openLink("https://patreon.com/ArmyAssist")}
                className={`${buttonClasses} bg-rose-600 hover:bg-rose-500`}
              >
                <FaPatreon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Support me on Patreon
              </button>
              <button
                onClick={() => openLink("https://discord.gg/hVVtGuybhw")}
                onTouchEnd={() => openLink("https://discord.gg/hVVtGuybhw")}
                className={`${buttonClasses} bg-indigo-600 hover:bg-indigo-500`}
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
