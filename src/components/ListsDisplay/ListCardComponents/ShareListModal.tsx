import React, { useState, useRef } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ShareIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { linkBuilder, qrCode } from "@/utils/ListHelper";
import useStore from "@/store/store";
import StoredList from "@/types/StoredList";
import { FaCopy } from "react-icons/fa";

interface ShareListModalProps {
  list: StoredList;
  isDropdown: boolean;
}

const ShareListModal: React.FC<ShareListModalProps> = ({
  list,
  isDropdown,
}) => {
  const [open, setOpen] = useState(false);
  const listDisplaySetting = useStore(
    (state) => state.settings.listDisplaySetting
  );
  const qrRef = useRef<HTMLDivElement>(null); // Reference to the QR code container

  const handleClose = () => {
    setOpen(false);
  };
  const handleShow = () => setOpen(true);

  const closeButtonClasses =
    "button flex flex-row items-center gap-x-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full items-center justify-center mx-1 my-1";

  const buttonClasses = () => {
    if (isDropdown) {
      return "block text-gray-700 px-4 py-2 text-sm";
    } else {
      return listDisplaySetting
        ? "bg-indigo-400 dark:bg-indigo-600 hover:bg-indigo-500 dark:text-white hover:text-white dark:hover:bg-indigo-400 rounded-lg p-1 shadow-sm shadow-indigo-500 dark:shadow-indigo-600 mx-2 rounded-2xl"
        : "flex flex-grow justify-center bg-indigo-400 dark:bg-indigo-600 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-400 rounded-lg p-1 shadow-sm shadow-indigo-500 dark:shadow-indigo-700";
    }
  };

  const copListToClipboard = async () => {
    try {
      await navigator.clipboard
        .write([
          new ClipboardItem({
            "text/plain": new Blob([linkBuilder(list.text)], {
              type: "text/plain",
            }),
          }),
        ])
        .then(() => alert("List link copied to clipboard!"));
    } catch (err) {
      alert(`${err}`);
      console.error("Failed to copy: ", err);
    }
  };

  const qr = qrCode(list.text);

  return (
    <>
      <button
        onClick={handleShow}
        className={buttonClasses()}
        aria-label="Open Share Panel"
        id={`share-list-${list.uuid}-button`}
      >
        {isDropdown ? (
          <span>Share QR Code</span>
        ) : (
          <ShareIcon className="h-8 w-8" />
        )}
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-scroll overflow-x-wrap text-gray-800 dark:text-gray-100"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black opacity-50"
            aria-hidden="true"
          />
          <DialogPanel className="bg-white rounded-lg w-full lg:w-1/2 max-w-2xl p-4 z-20">
            <div ref={qrRef} className="flex flex-row flex-1">
              {qr}
            </div>

            <div className="mt-4 px-8 flex w-full flex-col">
              <button
                onPointerDown={() => copListToClipboard()}
                className={`${closeButtonClasses} bg-indigo-700 hover:bg-indigo-600 shadow-sm shadow-indigo-700 dark:shadow-indigo-500 px-8`}
                id="copy-button"
              >
                <FaCopy aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Copy List Link
              </button>
            </div>

            <div className="mt-4 flex w-full flex-col">
              <button
                onPointerDown={handleClose}
                className={`${closeButtonClasses} bg-red-700 hover:bg-red-600`}
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
};

export default ShareListModal;
