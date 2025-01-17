import React, { useState, useEffect } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  ClipboardDocumentListIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

function Changelog() {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      <button
        onClick={handleShow}
        className="bg-slate-500 text-white rounded p-2 font-bold hover:bg-slate-700 mx-1"
      >
        <ClipboardDocumentListIcon className="h-6 w-6" />
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-scroll"
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
              Changelog
            </DialogTitle>
            <Description className="mt-2"></Description>
            
            <ChangelogEntry
              version="1.3.0"
              date="01/17/2025"
              changes={[
                "Stratagems: Now supported in a flyout menu! They are filtered by phase and detachment. Please report any errors in the discord.",
                "Fixed more spelling errors. Abilities should be ready for feedback on which phases they show up in.",
                "Further improved the mobile and tablet layouts to better support touch devices.",
              ]}
            />
            
            <ChangelogEntry
              version="1.2.1"
              date="01/16/2025"
              changes={[
                "Fixed more spelling errors",
                "Fixed a bug where abilities without text would be displayed",
                "Fixed a bug that caused certain weapons to get excluded"
              ]}
            />

            <ChangelogEntry
              version="1.2.0"
              date="01/15/2025"
              changes={[
                "Added support for the Army and Detachment Rules",
                "Fixed more spelling errors",
                "Fixed (what should be) the last of the allied faction bugs",
              ]}
            />

            <ChangelogEntry
              version="1.1.1"
              date="01/13/2025"
              changes={[
                "Fixed spelling errors for the Norn Assimilator",
                "Made cards not grayed out if the have an available ability in that phase",
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
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Changelog;
