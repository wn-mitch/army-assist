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
        stratagem.detachment === detachment || stratagem.detachment === "Core"
      );
    })
    .filter((stratagem) => stratagem.phases.includes(phase));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white rounded p-2 font-bold hover:bg-blue-700 shadow-xl ring-4 ring-blue-600 ring-offset-2"
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
                <div className="flex h-full flex-col overflow-y-scroll  bg-gray-800 py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-xl font-bold text-white inline-flex">
                        {phase} Phase Stratagems
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md text-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {filteredStratagems.map((stratagem) => (
                      <li
                        key={stratagem.id}
                        className={`border-2 border-gray-900 rounded-lg py-1 px-1 flex flex-col break-inside-avoid first:mt-0 shadow bg-slate-500 text-gray-200 gap-1 my-2`}
                      >
                        <div className="flex flex-row gap-1">
                          <div className="flex-grow px-2 py-1 text-left text-md font-bold rounded-lg bg-slate-700">
                            {stratagem.name}
                          </div>
                          <div className="px-2 py-1 text-left text-md font-bold rounded-lg bg-slate-700">
                            {stratagem.type}
                          </div>
                          <div className="px-2 py-1 text-left text-md font-bold rounded-lg bg-slate-700">
                            {stratagem.cp_cost} CP
                          </div>
                        </div>
                        <div className="px-2 py-1 text-left text-sm font-semibold rounded-lg bg-slate-800">
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
