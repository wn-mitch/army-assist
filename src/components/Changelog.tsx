import React, { useState, useEffect } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import changelogData from "@/assets/json/Changelog.json";
import { getCurrentVersion } from "@/utils/VersionHelper";

function Changelog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  const currentVersion = getCurrentVersion();

  return (
    <>
      <button
        onClick={handleShow}
        className="font-mono text-xs text-text-muted hover:text-text hover:bg-panel-hover rounded px-2 py-1 mx-2 transition-colors"
        id="changelog-button"
      >
        v{currentVersion}
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-auto"
        id="changelog-modal"
      >
        <div className="flex items-center justify-center min-h-screen">
          <DialogPanel className="fixed inset-0 bg-black/50" />

          <div className="bg-panel-surface border border-panel-border shadow-xl rounded-lg w-5/6 lg:w-3/4 mx-auto p-6 relative z-20">
            <button
              id="close-changelog"
              onPointerDown={handleClose}
              className="absolute top-2 right-2 text-text-muted hover:text-text"
            >
              <XCircleIcon className="h-8 w-8" />
            </button>
            <DialogTitle className="text-xl font-heading font-bold uppercase tracking-wider text-center text-text">
              Changelog
            </DialogTitle>
            <Description className="mt-2"></Description>

            <div className="mt-2">
              {changelogData.map((entry, index) => (
                <div
                  key={index}
                  className="mb-4 bg-surface border border-border shadow-sm p-2 rounded"
                >
                  <div className="flex flex-row align-middle items-center">
                    <h3 className="text-lg font-heading font-bold tracking-wider text-text">
                      {entry.version}
                    </h3>
                    <p className="ml-2 text-sm font-mono text-text-muted">
                      {entry.date}
                    </p>
                  </div>
                  <ul className="list-disc list-inside">
                    {entry.changes.map((change, idx) => (
                      <li key={idx} className="text-sm text-text">
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onPointerDown={handleClose}
                className="px-4 py-2 bg-danger text-white font-bold rounded w-full transition-colors hover:bg-danger/85"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Changelog;
