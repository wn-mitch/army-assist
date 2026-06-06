import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/24/outline";
import Phase from "@/types/Phase";
import useStore from "@/store/store";
import SortOptions from "@/types/SortOptions";
import SettingsOption from "./ArmyDisplay/UnitCardComponents/SettingsOption";
import { allFactions } from "@/theme/palettes";
import Button from "@/components/ui/Button";

function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const activePhases = useStore((state) => state.settings.activePhases);
  const togglePhase = useStore((state) => state.togglePhase);

  const activeSort = useStore((state) => state.settings.listSort);
  const setListSort = useStore((state) => state.setListSort);

  const cardsCollapse = useStore((state) => state.settings.cardsCollapse);
  const setCardsCollapse = useStore((state) => state.setCardsCollapse);

  const showKeywords = useStore((state) => state.settings.showKeywords);
  const setShowKeywords = useStore((state) => state.setShowKeywords);

  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const setIsDarkMode = useStore((state) => state.setIsDarkMode);

  const factionThemeId = useStore(
    (state) => state.settings.factionThemeId ?? ""
  );
  const setFactionThemeId = useStore((state) => state.setFactionThemeId);

  const cardsGroup = useStore((state) => state.settings.cardsGroup);
  const setCardsGroup = useStore((state) => state.setCardsGroup);

  const weaponsFilter = useStore((state) => state.settings.weaponsFilter);
  const setWeaponsFilter = useStore((state) => state.setWeaponsFilter);
  
  const truncateCoreRules = useStore((state) => state.settings.truncateCoreRules);
  const setTruncateCoreRules = useStore((state) => state.setTruncateCoreRules);

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  return (
    <>
      <button
        onClick={handleShow}
        className="text-text-muted hover:bg-panel-hover hover:text-text rounded p-2 font-bold mx-1 transition-colors"
        aria-label="Open Settings Panel"
        id="settings-button"
      >
        <CogIcon className="h-8 w-8" />
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black/50"
            aria-hidden="true"
          />
          <DialogPanel className="bg-panel-surface border border-panel-border shadow-xl rounded-lg w-full lg:w-3/4 max-w-lg p-4 z-20">
            <DialogTitle className="text-xl font-heading font-bold uppercase tracking-wider text-center text-text">
              Settings
            </DialogTitle>

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Active Phases
              </h2>
              <div className="mt-2 columns-3">
                {Object.keys(Phase).map((phase) => (
                  <SettingsOption
                    key={phase}
                    label={phase}
                    checked={activePhases[phase as Phase]}
                    onChange={() => togglePhase(phase as Phase)}
                    className={`m-1 rounded first:mt-0 p-1 font-semibold transition-colors ${
                      activePhases[phase as Phase]
                        ? "bg-accent text-accent-foreground hover:bg-accent-hover"
                        : "bg-panel text-text-muted hover:bg-panel-hover hover:text-text"
                    }`}
                    id={""}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                List Sort
              </h2>
              <div className="mt-2 divide-y divide-border border-b border-t border-border">
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

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Cards Collapse
              </h2>
              <SettingsOption
                label="Checking this option creates a button on each datacard that, when clicked, collapses the card to show only the title and keywords. If you use the card clicking feature, this is necessary. If not, disabling this will reduce card height."
                checked={cardsCollapse}
                onChange={() => setCardsCollapse(!cardsCollapse)}
                id={""}
              />
            </div>

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Cards Group
              </h2>
              <SettingsOption
                label="Checking this option groups identical cards together and displays their count in the unit name"
                checked={cardsGroup}
                onChange={() => setCardsGroup(!cardsGroup)}
                id={""}
              />
            </div>

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Show Datacard Keywords
              </h2>
              <SettingsOption
                label="Checking this option will show the keywords of each datacard. Disabling this option will reduce card height."
                checked={showKeywords}
                onChange={() => setShowKeywords(!showKeywords)}
                id={""}
              />
            </div>
            
            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Filter Weapons
              </h2>
              <SettingsOption
                label="Filter the weapons shown on the datacard by what's on your list. If you see (or don't see, rather) missing weapons, this is a good option to disable."
                checked={weaponsFilter}
                onChange={() => setWeaponsFilter(!weaponsFilter)}
                id={""}
              />
            </div>

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Truncate Core Rules
              </h2>
              <SettingsOption
                label="Shorten the rules descriptions for core rules items that you probably already know. This covers Infiltrators, Stealth, etc."
                checked={truncateCoreRules}
                onChange={() => setTruncateCoreRules(!truncateCoreRules)}
                id={""}
              />
            </div>

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Enable Dark Mode
              </h2>
              <SettingsOption
                label="This website has a fully functional dark mode. Enable it here."
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                id={""}
              />
            </div>

            <div className="mt-3 bg-surface border border-border shadow-sm p-2 rounded text-text">
              <h2 className="text-lg font-heading font-semibold uppercase tracking-wider text-text">
                Faction Theme
              </h2>
              <p className="text-sm">
                Auto follows the faction of the list you open.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1">
                <button
                  onClick={() => setFactionThemeId("")}
                  aria-pressed={factionThemeId === ""}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-sm font-medium text-left transition-colors ${
                    factionThemeId === ""
                      ? "bg-accent text-accent-foreground"
                      : "bg-panel text-text-muted hover:bg-panel-hover hover:text-text"
                  }`}
                  id="faction-theme-auto"
                >
                  <span
                    aria-hidden="true"
                    className="w-3 h-3 rounded-full inline-block shrink-0 ring-1 ring-inset ring-border bg-[conic-gradient(from_0deg,#14b8a6,#3b82f6,#dc2626,#f59e0b,#14b8a6)]"
                  />
                  Auto (list faction)
                </button>
                {allFactions.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setFactionThemeId(theme.id)}
                    aria-pressed={factionThemeId === theme.id}
                    title={theme.tagline}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-sm font-medium text-left transition-colors ${
                      factionThemeId === theme.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-panel text-text-muted hover:bg-panel-hover hover:text-text"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="w-3 h-3 rounded-full inline-block shrink-0 ring-1 ring-inset ring-border"
                      style={{
                        backgroundColor:
                          theme.palette[isDarkMode ? "dark" : "light"].accent,
                      }}
                    />
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Button size="md" className="w-full" onClick={handleClose}>
                Close
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default Settings;
