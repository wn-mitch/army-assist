import React, { useState, useRef } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ShareIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { linkBuilder, qrCode } from "@/utils/ListHelper";
import useStore from "@/store/store";
import StoredRoster from "@/types/StoredRoster";
import { FaCopy } from "react-icons/fa";
import Button from "@/components/ui/Button";

interface ShareListModalProps {
  list: StoredRoster;
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

  const buttonClasses = () => {
    if (isDropdown) {
      return "block text-text px-4 py-2 text-sm";
    } else {
      return listDisplaySetting
        ? "bg-accent text-accent-foreground hover:bg-accent-hover rounded p-1 shadow-sm mx-2 rounded-2xl"
        : "flex flex-grow justify-center bg-accent text-accent-foreground hover:bg-accent-hover rounded p-1 shadow-sm";
    }
  };

  const copListToClipboard = async () => {
    try {
      await navigator.clipboard
        .write([
          new ClipboardItem({
            "text/plain": new Blob([linkBuilder(list.rawText)], {
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

  const qr = qrCode(list.rawText);

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
        className="fixed z-10 inset-0 overflow-y-scroll overflow-x-wrap text-text"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black/50"
            aria-hidden="true"
          />
          <DialogPanel className="bg-panel-surface border border-panel-border rounded-lg shadow-xl w-full lg:w-1/2 max-w-2xl p-4 z-20">
            <div ref={qrRef} className="flex flex-row flex-1">
              {qr}
            </div>

            <div className="mt-4 px-8 flex w-full flex-col">
              <Button
                variant="accent"
                size="md"
                className="w-full flex items-center justify-center gap-x-1.5"
                onClick={() => copListToClipboard()}
                id="copy-button"
              >
                <FaCopy aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Copy List Link
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
};

export default ShareListModal;
