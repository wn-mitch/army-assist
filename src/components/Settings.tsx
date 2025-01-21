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

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  const SettingsOption: React.FC<{
    label: string;
    checked: boolean;
    onChange: () => void;
  }> = ({ label, checked, onChange }) => (
    <div className="relative flex gap-3 py-4">
      <div className="min-w-0 flex-1 text-sm/6">
        <label className="select-none font-medium text-gray-900">
          {label}
        </label>
      </div>
      <div className="flex h-6 shrink-0 items-center">
        <div className="group grid size-4 grid-cols-1">
          <input
            checked={checked}
            onChange={onChange}
            type="checkbox"
            className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
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
    </div>
  );

  return (
    <>
      <button onClick={handleShow} className="bg-slate-500 text-white rounded p-2 font-bold hover:bg-slate-700 mx-1">
        <CogIcon className="h-6 w-6" />
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black opacity-50" aria-hidden="true" />
          <DialogPanel className="bg-white rounded w-full md:w-2/3 max-w-lg p-6 z-20">
            <DialogTitle className="text-xl font-bold text-center">
              Settings
            </DialogTitle>
            <div className="mt-2">
              <h2 className="text-lg font-semibold">Active Phases</h2>
              <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                {Object.keys(Phase).map((phase) => (
                  <SettingsOption
                    key={phase}
                    label={phase}
                    checked={activePhases[phase as Phase]}
                    onChange={() => togglePhase(phase as Phase)}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-2">
              <h2 className="text-lg font-semibold">List Sort</h2>
              <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
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

            <div className="mt-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-red-700 font-bold text-white rounded w-full"
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