import React, { useCallback, useRef, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PrinterIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useReactToPrint } from "react-to-print";
import useStore from "@/store/store";
import PrintParent from "@/print/PrintParent";
import PhaseOption from "@/types/PhaseOption";
import PrintSettings from "@/types/PrintSettings";
import ContentOption from "@/types/ContentOption";
import SettingsOption from "./UnitCardComponents/SettingsOption";

function Print() {
  const [isOpen, setIsOpen] = useState(false);
  const componentRef = useRef(null);

  const [phaseOptionSetting, setPhaseOptionSetting] = useState(
    PhaseOption.Split
  );

  const [contentOptionSetting, setContentOptionSetting] = useState({
    Units: true,
    Stratagems: true,
    ArmyAbilities: true,
    QR: true,
  });

  const handleContentOptionChange = (option: keyof ContentOption) => {
    setContentOptionSetting((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const getActiveList = useStore((state) => state.getActiveList);
  const text = getActiveList().text;
  const faction = getActiveList().faction;
  const weaponsFilter = useStore((state) => state.settings.weaponsFilter);

  const getProcessedUnits = useStore((state) => state.getProcessedUnitList);
  const processedUnits = getProcessedUnits();

  const [filterCoreStratagems, setFilterCoreStratagems] = useState(true);
  const [truncateCoreAbilities, setTruncateCoreAbilities] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleShow = () => setIsOpen(true);

  const buttonClasses =
    "button flex flex-row items-center gap-x-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full items-center justify-center mx-1 my-1";

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `ArmyAssist.xyz - ${faction}`,
  });

  const handleOnClick = useCallback(() => {
    printFn();
  }, [printFn]);

  const settings: PrintSettings = {
    phaseOptionSetting: phaseOptionSetting,
    contentOptionSetting: contentOptionSetting,
    filterCoreStratagems: filterCoreStratagems,
    truncateCoreAbilities: truncateCoreAbilities,
    weaponsFilter: weaponsFilter,
  };

  return (
    <>
      <button
        onClick={handleShow}
        className="bg-gray-500 text-gray-200 rounded p-2 font-bold hover:bg-gray-700 mx-1"
        aria-label="Open Print Panel"
        id="print-button"
      >
        <PrinterIcon className="h-8 w-8" />
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-scroll overflow-x-wrap text-black dark:text-gray-100"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black opacity-50"
            aria-hidden="true"
          />
          <DialogPanel className="bg-white dark:bg-gray-800 rounded-lg w-full lg:w-3/4 max-w-lg p-4 z-20">
            <DialogTitle className="text-lg font-bold text-center pb-1">
              Print Pages
            </DialogTitle>
            <div className="flex flex-row">
              <span className="text-center text-sm">
                This screen manages the options for printing sheets for your use
                offline. I recommend printing in landscape view for the best
                experience. This uses the weapons filter selected in the site
                settings menu (gear icon).
              </span>
            </div>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Content Options
              </h2>
              <div className="mt-2 divide-y divide-gray-800 dark:divide-gray-200 border-b border-t dark:border-gray-200 border-gray-800">
                {Object.keys(contentOptionSetting).map((contentOption) => (
                  <SettingsOption
                    key={contentOption}
                    label={contentOption}
                    id={`${contentOption}-setting`}
                    checked={
                      contentOptionSetting[contentOption as keyof ContentOption]
                    }
                    onChange={() =>
                      handleContentOptionChange(
                        contentOption as keyof ContentOption
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Truncate Core Rules Descriptions
              </h2>
              <div className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                <SettingsOption
                  label={
                    'Shorten the core rules descriptions? This will cause rules such as "Infiltrators" and "Bodyguard" to have their description removed to save space.'
                  }
                  id={`truncate-core-rules-setting`}
                  checked={truncateCoreAbilities}
                  onChange={() =>
                    setTruncateCoreAbilities(!truncateCoreAbilities)
                  }
                />
              </div>
            </div>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Stratagem Filtering Options
              </h2>
              <div className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                <SettingsOption
                  label={"Filter out core stratagems?"}
                  id={`filter-core-stratagems-setting`}
                  checked={filterCoreStratagems}
                  onChange={() =>
                    setFilterCoreStratagems(!filterCoreStratagems)
                  }
                />
              </div>
            </div>

            <div className="mt-3 bg-gray-200 shadow-sm p-2 rounded-lg text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Stratagems Split By Phase
              </h2>
              <div className="mt-2 divide-y divide-gray-800 dark:divide-gray-200 border-b border-t dark:border-gray-200 border-gray-800">
                {Object.values(PhaseOption).map((phaseOption) => (
                  <SettingsOption
                    key={phaseOption}
                    label={phaseOption}
                    checked={phaseOption === phaseOptionSetting}
                    id={`${phaseOption}-setting`}
                    onChange={() =>
                      setPhaseOptionSetting(phaseOption as PhaseOption)
                    }
                  />
                ))}
              </div>
            </div>

            <div ref={componentRef} className="hidden print:block">
              {PrintParent(text, processedUnits, settings)}
            </div>

            <div className="mt-4 flex w-full flex-col display-hidden">
              <button
                onClick={handleOnClick}
                className={`${buttonClasses} bg-indigo-700 hover:bg-indigo-600`}
                id="print-button"
              >
                <PrinterIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Print
              </button>
            </div>

            <div className="mt-4 flex w-full flex-col">
              <button
                onPointerDown={handleClose}
                className={`${buttonClasses} bg-red-700 hover:bg-red-600`}
                id="close-button"
              >
                <XCircleIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Tap Here to Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default Print;
