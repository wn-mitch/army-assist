import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Stratagems from "@/assets/json/Stratagems_modified.json";
import useStore from "@/store/store";

export default function StratagemPanel() {
  const [open, setOpen] = useState(false);
  const faction = useStore((state) => state.faction);
  const phase = useStore((state) => state.phase);
  const detachment = useStore((state) => state.detachment);

  const stratagemNames = new Set();

  if (!faction || !phase || !detachment) {
    return null;
  }

  const formatDescription = (description: string) => {
    const keywords = ["WHEN:", "TARGET:", "EFFECT:", "RESTRICTIONS:", "PHASE:"];
    let formattedDescription = description;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "g");
      formattedDescription = formattedDescription.replace(regex, "\n$1");
    });
    return formattedDescription.split("\n").map((part, index, arr) => {
      if (part) {
        return (
          <span key={index}>
            {part}
            <br />
            {index === arr.length - 1 ? "" : <hr />}
          </span>
        );
      }
    });
  };

  const filteredStratagems = Stratagems.map((stratagem) => {
    const [splitDetachment, splitType] = stratagem.type.split(" - ");
    if (splitDetachment === "Core") {
      return {
        ...stratagem,
        detachment: "Core",
        type: splitType,
      };
    } else {
      return {
        ...stratagem,
        type: splitType,
      };
    }
  })
    .filter(
      (stratagem) =>
        stratagem.faction_id === faction || stratagem.faction_id === ""
    )
    .filter((stratagem) => {
      return (
        stratagem.detachment === detachment ||
        stratagem.detachment === "" ||
        stratagem.detachment === "Core"
      );
    })
    .filter((stratagem) => stratagem.phases.includes(phase))
    .filter((stratagem) => {
      if(stratagemNames.has(stratagem.name)) {
        return false;
      } else {
        stratagemNames.add(stratagem.name);
        return true;
      }
    });
  
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white rounded p-2 font-bold hover:bg-blue-700 shadow-xl z-10"
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
                          onTouchEnd={() => setOpen(false)}
                          className="relative rounded-md text-gray-800 dark:text-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6 xl:columns-2 lg:columns-1 md:columns-1 sm:columns-1">
                    {filteredStratagems.map((stratagem) => (
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
                              {stratagem.type}
                            </div>
                            <div className="m-2 px-0.5 shadow-md rounded-lg bg-gray-700 my-1 text-gray-100 dark:bg-gray-200 dark:text-gray-800 dark:font-semibold">
                              {stratagem.cp_cost} CP
                            </div>
                          </div>
                        </div>

                        <div className="font-normal dark:font-semibold text-sm text-gray-800 dark:text-gray-200">
                          {formatDescription(stratagem.description)}
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
