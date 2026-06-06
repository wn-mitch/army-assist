import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useStore from "@/store/store";
import { describeStratagem } from "@/data/rosterSelectors";

/** "battle-tactic" → "Battle Tactic" for the GW category chip. */
const titleCase = (kebab: string) =>
  kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function StratagemPanel() {
  const [open, setOpen] = useState(false);

  const phase = useStore((state) => (state.storedRosters[state.activeList]?.phase ??
      state.storedLists[state.activeList].phase));
  const getRosterStratagemsByPhase = useStore(
    (state) => state.getRosterStratagemsByPhase,
  );
  const stratagems = getRosterStratagemsByPhase(phase);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white rounded p-2 font-bold hover:bg-blue-700 shadow-xl z-10"
        id="open-stratagems-button"
      >
        Open Stratagem Panel
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                id="stratagem-panel"
                transition
                className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll  bg-gray-200 dark:bg-gray-900 py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-md font-normal text-gray-800 inline-flex dark:text-gray-200">
                        {phase} Phase Stratagems
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          id="close-stratagem-panel-button"
                          className="relative rounded-md text-gray-800 dark:text-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="h-8 w-8" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6 xl:columns-2 lg:columns-1 md:columns-1 sm:columns-1">
                    {stratagems.map((stratagem) => (
                      <li
                        key={stratagem.id}
                        className={`group mx-4 my-2 px-3 py-1 rounded-lg border col-span-1 flex flex-col break-inside-avoid first:mt-0 cursor-pointer shadow-sm bg-gray-50 dark:bg-gray-800 border-gray-50 dark:border-gray-700 focus:outline-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 dark:focus:outline-gray-800 dark:focus:outline dark:focus:outline-2 dark:focus:-outline-offset-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:border-gray-600`}
                      >
                        <div className="flex flex-row sm:justify-center sm:items-center">
                          <div className="flex-grow text-xl font-semibold text-black dark:text-gray-50">
                            {stratagem.name}
                          </div>
                          <div className="flex lg:flex-row flex-col justify-center items-center">
                            <div className="flex-shrink font-light text-sm text-gray-600 px-2 lg:text-right dark:text-gray-400 dark:font-normal text-center">
                              {titleCase(stratagem.type)}
                            </div>
                            <div className="m-2 px-0.5 shadow-md rounded-lg bg-gray-700 my-1 text-gray-100 dark:bg-gray-200 dark:text-gray-800 dark:font-semibold">
                              {stratagem.cp_cost} CP
                            </div>
                          </div>
                        </div>

                        <div className="font-normal dark:font-semibold text-sm text-gray-800 dark:text-gray-200">
                          {describeStratagem(stratagem)}
                        </div>
                        <div className="font-light text-xs text-gray-600 dark:text-gray-400">
                          {titleCase(stratagem.timing)} ·{" "}
                          {titleCase(stratagem.player_turn)} turn
                        </div>
                      </li>
                    ))}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
