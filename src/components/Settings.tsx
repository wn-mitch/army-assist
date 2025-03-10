import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/24/outline";
import Phase from "@/types/Phase";
import useStore from "@/store/store";
import SortOptions from "@/types/SortOptions";
import SettingsOption from "./CardComponents/SettingsOption";

function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const activePhases = useStore((state) => state.activePhases);
  const togglePhase = useStore((state) => state.togglePhase);

  const activeSort = useStore((state) => state.listSort);
  const setListSort = useStore((state) => state.setListSort);

  const cardsCollapse = useStore((state) => state.cardsCollapse);
  const setCardsCollapse = useStore((state) => state.setCardsCollapse);

  const showKeywords = useStore((state) => state.showKeywords);
  const setShowKeywords = useStore((state) => state.setShowKeywords);

  const isDarkMode = useStore((state) => state.isDarkMode);
  const setIsDarkMode = useStore((state) => state.setIsDarkMode);

  const cardsGroup = useStore((state) => state.cardsGroup);
  const setCardsGroup = useStore((state) => state.setCardsGroup);

  const weaponsFilter = useStore((state) => state.weaponsFilter);
  const setWeaponsFilter = useStore((state) => state.setWeaponsFilter);

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  return (
    <>
      <button
        onClick={handleShow}
        className="bg-gray-500 text-white rounded p-2 font-bold hover:bg-gray-700 mx-1"
        aria-label="Open Settings Panel"
        id="settings-button"
      >
        <CogIcon className="h-6 w-6" />
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black opacity-50"
            aria-hidden="true"
          />
          <DialogPanel className="bg-white dark:bg-gray-800 rounded-lg w-full lg:w-3/4 max-w-lg p-4 z-20">
            <DialogTitle className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
              Settings
            </DialogTitle>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Active Phases
              </h2>
              <div className="mt-2 columns-3">
                {Object.keys(Phase).map((phase) => (
                  <SettingsOption
                    key={phase}
                    label={phase}
                    checked={activePhases[phase as Phase]}
                    onChange={() => togglePhase(phase as Phase)}
                    className={`outline outline-2 -outline-offset-1 focus:outline-gray-700 dark:outline-gray-gray-600 m-1 rounded-lg first:mt-0 p-1 font-semibold text-gray-200 ${
                      activePhases[phase as Phase]
                        ? "bg-gray-500  hover:bg-gray-600 dark:hover:bg-gray-600 dark:bg-gray-500 dark:text-gray-200 dark:hover:text-gray-100 text-white"
                        : "bg-gray-100 hover:bg-gray-600 text-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-white"
                    }`}
                    id={""}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                List Sort
              </h2>
              <div className="mt-2 divide-y divide-gray-800 dark:divide-gray-200 border-b border-t dark:border-gray-200 border-gray-800">
                {Object.values(SortOptions).map((sortOption) => (
                  <SettingsOption
                    key={sortOption}
                    label={sortOption}
                    checked={sortOption === activeSort}
                    onChange={() => setListSort(sortOption as SortOptions)}
                    id={""}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Cards Collapse
              </h2>
              <SettingsOption
                label="Checking this option creates a button on each datacard that, when clicked, collapses the card to show only the title and keywords. If you use the card clicking feature, this is necessary. If not, disabling this will reduce card height."
                checked={cardsCollapse}
                onChange={() => setCardsCollapse(!cardsCollapse)}
                id={""}
              />
            </div>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Cards Group
              </h2>
              <SettingsOption
                label="Checking this option groups identical cards together and displays their count in the unit name"
                checked={cardsGroup}
                onChange={() => setCardsGroup(!cardsGroup)}
                id={""}
              />
            </div>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Show Datacard Keywords
              </h2>
              <SettingsOption
                label="Checking this option will show the keywords of each datacard. Disabling this option will reduce card height."
                checked={showKeywords}
                onChange={() => setShowKeywords(!showKeywords)}
                id={""}
              />
            </div>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Filter Weapons
              </h2>
              <SettingsOption
                label="Filter the weapons shown on the datacard by what's on your list. If you see (or don't see, rather) missing weapons, this is a good option to disable."
                checked={weaponsFilter}
                onChange={() => setWeaponsFilter(!weaponsFilter)}
                id={""}
              />
            </div>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Enable Dark Mode
              </h2>
              <SettingsOption
                label="This website has a fully functional dark mode. Enable it here."
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                id={""}
              />
            </div>

            <div className="mt-4">
              <button
                onPointerDown={handleClose}
                className="px-4 py-2 bg-red-700 font-bold text-white rounded w-full dark:bg-gray-500"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default Settings;
