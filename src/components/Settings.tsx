import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/24/outline";
import Phase from "@/types/Phase";
import useStore from "@/store/store";
import SortOptions from "@/types/SortOptions";

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

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  const SettingsOption: React.FC<{
    label: string;
    checked: boolean;
    onChange: () => void;
    className?: string;
  }> = ({ label, checked, onChange, className }) => (
    <label className={`relative flex gap-3 cursor-pointer ${className}`}>
      <div className="min-w-0 flex-1 text-sm/6">
        <span className="select-none">{label}</span>
      </div>
      <div className="flex h-6 shrink-0 items-center">
        <div className="group grid size-4 grid-cols-1">
          <input
            checked={checked}
            onChange={onChange}
            type="checkbox"
            className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-gray-600 checked:bg-gray-600 indeterminate:border-gray-600 indeterminate:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto dark:checked:bg-gray-700 dark:border-2 dark:border-gray-200"
          />
          <svg
            fill="none"
            viewBox="0 0 14 14"
            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
          >
            <path
              d="M3 8L6 11L11 3.5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 group-has-[:checked]:opacity-100"
            />
            <path
              d="M3 7H11"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 group-has-[:indeterminate]:opacity-100"
            />
          </svg>
        </div>
      </div>
    </label>
  );

  return (
    <>
      <button
        onClick={handleShow}
        className="bg-gray-500 text-white rounded p-2 font-bold hover:bg-gray-700 mx-1"
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
          <DialogPanel className="bg-white dark:bg-gray-900 rounded w-full md:w-2/3 max-w-lg p-4 z-20">
            <DialogTitle className="text-xl font-bold text-center dark:text-gray-200">
              Settings
            </DialogTitle>

            <div className="mt-3 bg-gray-100 shadow-sm p-2 rounded-lg dark:bg-gray-800">
              <h2 className="text-lg font-semibold dark:text-gray-200">
                Active Phases
              </h2>
              <div className="mt-2 columns-3">
                {Object.keys(Phase).map((phase) => (
                  <SettingsOption
                    key={phase}
                    label={phase}
                    checked={activePhases[phase as Phase]}
                    onChange={() => togglePhase(phase as Phase)}
                    className={`outline outline-2 -outline-offset-1 focus:outline-gray-800 dark:outline-gray-gray-600 m-1 rounded-lg first:mt-0 p-1 font-semibold text-gray-200 ${
                      activePhases[phase as Phase]
                        ? "bg-gray-600  hover:bg-gray-500 dark:hover:bg-gray-600 dark:bg-gray-700 dark:text-gray-200 text-white dark:hover:text-gray-100"
                        : "bg-white hover:bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 bg-gray-100 shadow-sm p-2 rounded-lg dark:bg-gray-800 dark:text-gray-200">
              <h2 className="text-lg font-semibold dark:text-gray-200">
                List Sort
              </h2>
              <div className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                {Object.values(SortOptions).map((sortOption) => (
                  <SettingsOption
                    key={sortOption}
                    label={sortOption}
                    checked={sortOption === activeSort}
                    onChange={() => setListSort(sortOption as SortOptions)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 bg-gray-100 shadow-sm p-2 rounded-lg dark:bg-gray-800 dark:text-gray-200">
              <h2 className="text-lg font-semibold dark:text-gray-200">
                Cards Collapse
              </h2>
              <SettingsOption
                label="Checking this option creates a button on each datacard that, when clicked, collapses the card to show only the title and keywords. If you use the card clicking feature, this is necessary. If not, disabling this will reduce card height."
                checked={cardsCollapse}
                onChange={() => setCardsCollapse(!cardsCollapse)}
              />
            </div>

            <div className="mt-3 bg-gray-100 shadow-sm p-2 rounded-lg dark:bg-gray-800 dark:text-gray-200">
              <h2 className="text-lg font-semibold dark:text-gray-200">
                Show Datacard Keywords
              </h2>
              <SettingsOption
                label="Checking this option will show the keywords of each datacard. Disabling this option will reduce card height."
                checked={showKeywords}
                onChange={() => setShowKeywords(!showKeywords)}
              />
            </div>

            <div className="mt-3 bg-gray-100 shadow-sm p-2 rounded-lg dark:bg-gray-800 dark:text-gray-200">
              <h2 className="text-lg font-semibold">Enable Dark Mode</h2>
              <SettingsOption
                label="This website has a fully functional dark mode. Enable it here."
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
              />
            </div>

            <div className="mt-4">
              <button
                onClick={handleClose}
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
