import React, { useState } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

function Changelog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  const ChangelogEntry: React.FC<{
    version: string;
    date: string;
    changes: string[];
  }> = ({ version, date, changes }) => (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">
        {version} - {date}
      </h2>
      <ul className="list-disc list-inside">
        {changes.map((change, index) => (
          <li key={index}>{change}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <button onClick={handleShow} className="bg-slate-500 text-white rounded p-2 font-bold hover:bg-slate-700 mx-4">
        <QuestionMarkCircleIcon className="h-6 w-6" />
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <DialogPanel className="fixed inset-0 bg-black opacity-30" />

          <div className="bg-white rounded w-2/3 mx-auto p-6 relative z-20">
            <DialogTitle className="text-xl font-bold text-center">
              Instructions & Changelog
            </DialogTitle>
            <Description className="mt-2">
              <ol className="list-decimal list-inside">
                <li>Create a list on NewRecruit.eu</li>
                <li>Click Export</li>
                <li>Click the Text Option</li>
                <li>Select the Format as NR</li>
                <li>Click Copy to Clipboard</li>
                <li>Paste into the pastebox</li>
                <li>Please report any issues you find in the discord linked in the header.</li>
              </ol>
            </Description>

            <ChangelogEntry
              version="1.0.0"
              date="01/09/2025"
              changes={[
                "Initial release",
                "Supports own player phases, with limited support for the Charge phase",
              ]}
            />

            <div className="mt-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-red-700 font-bold text-white rounded w-full"
              >
                Tap Anywhere to Close
              </button>
            </div>

            <div className="mt-4 text-center text-gray-500">
              Powered by Wahapedia
            </div>

          </div>
        </div>
      </Dialog>
    </>
  );
}

export default Changelog;
