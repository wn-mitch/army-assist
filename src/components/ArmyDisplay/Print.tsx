import React, { useCallback, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PrinterIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";
import useStore from "@/store/store";
import PrintParent from "@/print/PrintParent";
import PhaseOption from "@/types/PhaseOption";
import PrintSettings from "@/types/PrintSettings";
import ContentOption from "@/types/ContentOption";
import SettingsOption from "./UnitCardComponents/SettingsOption";
import { rosterFactionName } from "@/data/rosterSelectors";
import Button from "@/components/ui/Button";

function Print() {
  const [isOpen, setIsOpen] = useState(false);

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

  const getActiveRoster = useStore((state) => state.getActiveRoster);
  const activeRoster = getActiveRoster();
  const text = activeRoster?.rawText ?? "";
  const faction = activeRoster ? rosterFactionName(activeRoster) : "";
  const weaponsFilter = useStore((state) => state.settings.weaponsFilter);

  const getRosterUnits = useStore((state) => state.getRosterUnits);
  const rosterRows = getRosterUnits();

  const [filterCoreStratagems, setFilterCoreStratagems] = useState(true);
  const [truncateCoreAbilities, setTruncateCoreAbilities] = useState(true);
  const [columnCount, setColumnCount] = useState<1 | 2 | 3>(3);

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleShow = () => setIsOpen(true);

  const handleOnClick = useCallback(() => {
    const prevTitle = document.title;
    document.title = `ArmyAssist.xyz - ${faction}`;
    const restore = () => {
      document.title = prevTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }, [faction]);

  const settings: PrintSettings = {
    phaseOptionSetting: phaseOptionSetting,
    contentOptionSetting: contentOptionSetting,
    filterCoreStratagems: filterCoreStratagems,
    truncateCoreAbilities: truncateCoreAbilities,
    weaponsFilter: weaponsFilter,
    columnCount: columnCount,
  };

  return (
    <>
      <button
        onClick={handleShow}
        className="text-text-muted hover:bg-panel-hover hover:text-text rounded p-2 font-bold mx-1 transition-colors"
        aria-label="Open Print Panel"
        id="print-button"
      >
        <PrinterIcon className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-scroll overflow-x-wrap text-text"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black/50"
            aria-hidden="true"
          />
          <DialogPanel className="bg-panel-surface border border-panel-border shadow-xl rounded-lg w-full lg:w-3/4 max-w-lg p-4 z-20">
            <DialogTitle className="text-lg font-heading font-bold uppercase tracking-wider text-center pb-1">
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

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Content Options
              </h2>
              <div className="mt-2 divide-y divide-border border-b border-t border-border">
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

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Truncate Core Rules Descriptions
              </h2>
              <div className="mt-2 divide-y divide-border border-b border-t border-border">
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

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Stratagem Filtering Options
              </h2>
              <div className="mt-2 divide-y divide-border border-b border-t border-border">
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

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Stratagems Split By Phase
              </h2>
              <div className="mt-2 divide-y divide-border border-b border-t border-border">
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

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Column Layout
              </h2>
              <div className="mt-2 divide-y divide-border border-b border-t border-border">
                {([1, 2, 3] as const).map((count) => (
                  <SettingsOption
                    key={count}
                    label={`${count} Column${count > 1 ? "s" : ""}`}
                    checked={columnCount === count}
                    id={`column-${count}-setting`}
                    onChange={() => setColumnCount(count)}
                  />
                ))}
              </div>
            </div>

            {createPortal(
              <div id="print-root">{PrintParent(text, rosterRows, settings)}</div>,
              document.body,
            )}

            <div className="mt-4 flex w-full flex-col display-hidden">
              <Button
                variant="accent"
                size="md"
                onClick={handleOnClick}
                className="w-full flex items-center justify-center gap-x-1.5"
                id="print-modal-button"
              >
                <PrinterIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Print
              </Button>
            </div>

            <div className="mt-4 flex w-full flex-col">
              <Button
                size="md"
                className="w-full flex items-center justify-center gap-x-1.5"
                onClick={handleClose}
                id="close-button"
              >
                <XCircleIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Close
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default Print;
