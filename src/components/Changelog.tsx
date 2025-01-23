import React, { useState, useEffect } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import changelogData from "@/assets/json/Changelog.json";

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

  const currentVersion = changelogData[0].version;

  return (
    <>
      <button
        onClick={handleShow}
        className="bg-gray-500 text-gray-200 rounded p-2 font-semibold hover:bg-gray-700 mx-2"
      >
        v{currentVersion}
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-scroll p-10"
      >
        <div className="flex items-center justify-center min-h-screen">
          <DialogPanel className="fixed inset-0 bg-black opacity-30" />

          <div className="bg-white dark:bg-gray-800 rounded-lg w-2/3 mx-auto p-6 relative z-20">
            <button
              id="close-changelog"
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-300"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
            <DialogTitle className="text-xl font-bold text-center dark:text-gray-200">
              Changelog
            </DialogTitle>
            <Description className="mt-2"></Description>

            <div className="mt-2">
              {changelogData.map((entry, index) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-row align-middle items-center">
                    <h3 className="text-lg font-bold dark:text-gray-200">{entry.version}</h3>
                    <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {entry.date}
                    </p>
                  </div>
                  <ul className="list-disc list-inside">
                    {entry.changes.map((change, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Changelog;
