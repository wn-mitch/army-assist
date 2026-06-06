import React from "react";
import ResetButton from "./ArmyDisplay/ResetButton";
import Settings from "./Settings";
import Instructions from "./Instructions";
import Changelog from "./Changelog";
import useStore from "@/store/store";
import Print from "./ArmyDisplay/Print";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const activeList = useStore((state) => state.activeList);
  const editForceMode = useStore((state) => state.settings.editForceMode);
  const toggleEditForceMode = useStore((state) => state.toggleEditForceMode);

  const handleEditForceToggle = () => {
    toggleEditForceMode(!editForceMode);
  };

  return (
    <header className="bg-panel border-b border-panel-border px-2 py-2">
      <div className="min-w-0 flex items-center justify-between">
        <div className="flex flex-row justify-center items-center">
          <h2 className="text-xl font-heading font-bold uppercase tracking-wider text-text inline-flex">
            ArmyAssist.xyz
          </h2>
          <Changelog />
        </div>
        <div className="flex items-center gap-1">
          {activeList >= 0
            ? [
                <button
                  key="edit-force"
                  onClick={handleEditForceToggle}
                  className={`rounded p-2 font-bold mx-1 transition-colors ${
                    editForceMode
                      ? "bg-accent text-accent-foreground hover:bg-accent-hover"
                      : "text-text-muted hover:bg-panel-hover hover:text-text"
                  }`}
                  aria-label={`${
                    editForceMode ? "Disable" : "Enable"
                  } Edit Force Mode`}
                  id="edit-force-button"
                >
                  <PencilSquareIcon className="h-8 w-8" />
                </button>,
                <Print key="print" />,
                <Settings key="settings" />,
                <ResetButton key="reset" />,
              ]
            : [<Instructions key="instructions" />, <Settings key="settings" />]}
        </div>
      </div>
    </header>
  );
};

export default Header;
