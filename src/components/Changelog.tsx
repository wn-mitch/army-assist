import React, { useState, useEffect } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {FaDiscord, FaPatreon} from "react-icons/fa";
import useStore from "@/store/store";
import nrWorldEaters from "@/assets/lists/nr_world_eaters.txt";

function Changelog() {
  const [isOpen, setIsOpen] = useState(false);
  const isFirstVisit = useStore((state) => state.isFirstVisit);
  const setFirstVisit = useStore((state) => state.setFirstVisit);

  useEffect(() => {
    if (isFirstVisit) {
      setIsOpen(true);
      setFirstVisit(false);
    }
  }, [isFirstVisit, setFirstVisit]);

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  const ChangelogEntry: React.FC<{
    version: string;
    date: string;
    changes: string[];
  }> = ({ version, date, changes }) => (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">
        {version} - {date}
      </h2>
      <ul className="list-disc list-inside">
        {changes.map((change, index) => (
          <li key={index}>{change}</li>
        ))}
      </ul>
    </div>
  );

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

  return (
    <>
      <button
        onClick={handleShow}
        className="bg-slate-500 text-white rounded p-2 font-bold hover:bg-slate-700 mx-4"
      >
        <QuestionMarkCircleIcon className="h-6 w-6" />
      </button>

      <Dialog
        open={isOpen}
        onClose={() => {}}
        className="fixed z-10 inset-0 overflow-y-scroll"
      >
        <div className="flex items-center justify-center min-h-screen">
          <DialogPanel className="fixed inset-0 bg-black opacity-30" />

          <div className="bg-white rounded w-2/3 mx-auto p-6 relative z-20">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
            <DialogTitle className="text-xl font-bold text-center">
              Instructions & Changelog
            </DialogTitle>
            <Description className="mt-2">
              <ol className="list-decimal list-inside">
                <li>
                  Create a list on NewRecruit.eu. If you don't know what that
                  is, or just want to explore the site's features before
                  deciding to rebuild a list, you can{" "}
                  <a
                    href="#"
                    onClick={copySampleToClipboard}
                    className="text-blue-500 underline z-20"
                  >
                    click here to copy a sample to the clipboard
                  </a>
                  .
                </li>
                <li>Click Export</li>
                <li>Click the Text Option</li>
                <li>Select the Format as NR</li>
                <li>Click Copy to Clipboard</li>
                <li>Paste into the pastebox</li>
                <li>
                  Please report any issues you find in the discord linked in the
                  header.
                </li>
              </ol>
            </Description>
            
            <ChangelogEntry
              version="1.1.1"
              date="01/13/2025"
              changes={[
                "Fixed spelling errors for the Norn Assimilator",
                "Made cards not grayed out if the have an available ability in that phase"
              ]}
            />
            
            <ChangelogEntry
              version="1.1.0"
              date="01/13/2025"
              changes={[
                "Ability Support: Abilities on datasheet cards are now displayed in the relevant phase. This includes abilities that are not tied to a specific phase. This was a pretty massive undertaking and there are almost certainly cards in the wrong phase. Please let me know if you see any issues. The game has over 3500 abilities and I have to programatically assign them to phases.",
                "Please join the discord to offer feedback and report issues! Link at the bottom of the Changelog.",
                "Further worked to improve the look of the mobile layout",
                "Added Toughness to the Saves cards",
                "Fixed more allied faction bugs",
              ]}
            />

            <ChangelogEntry
              version="1.0.2"
              date="01/12/2025"
              changes={[
                "Fixed a slew of bugs related to missing Keyword Tags",
                "Added support for allied units in factions. This is something that I have to manually update, so please let me know if you see any issues or missing units. I tried to make tester list with every faction but I am not sure on all of the ally rules.",
                "The copy to clipboard sample actually works now",
              ]}
            />

            <ChangelogEntry
              version="1.0.1"
              date="01/11/2025"
              changes={[
                "Cards are now pre-toggled if there is not any information available for them during that phase (ie, no guns during the shooting phase)",
                "Adds a settings modal with the ability to filter out phases you don't need (World Eaters don't need a Shooting Phase)",
                "Improved the look of the mobile layout",
                "Fixed a slew of bugs related to missing Keyword Tags",
                "Added support for Saves",
              ]}
            />

            <ChangelogEntry
              version="1.0.0"
              date="01/10/2025"
              changes={[
                "Initial release",
                "Supports own player phases, with limited support for the Charge phase",
              ]}
            />

            <div className="mt-4">
              <button
                onClick={handleClose}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              >
                <XCircleIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Tap Here to Close
              </button>
              <a
                href="https://patreon.com/ListAssist"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 my-2"
              >
                <FaPatreon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Support me on Patreon
              </a>
              <a
                href="https://discord.gg/hVVtGuybhw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-2"
              >
                <FaDiscord aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Join the Discord
              </a>
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

export default Changelog;
