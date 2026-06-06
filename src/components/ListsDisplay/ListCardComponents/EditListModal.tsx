import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PencilSquareIcon, XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import StoredRoster from "@/types/StoredRoster";
import {
  rosterFactionName,
  rosterDetachmentName,
} from "@/data/rosterSelectors";
import useStore from "@/store/store";
import Button from "@/components/ui/Button";

interface EditListModalProps {
  list: StoredRoster;
  isDropdown: boolean;
}

const EditListModal: React.FC<EditListModalProps> = ({ list, isDropdown }) => {
  const editList = useStore((state) => state.editList);
  const listDisplaySetting = useStore(
    (state) => state.settings.listDisplaySetting
  );

  const [open, setOpen] = useState(false);
  const [newListName, setNewListName] = useState(list.name || "");
  const [newListText, setNewListText] = useState(list.rawText || "");

  const handleClose = () => {
    setOpen(false);
  };

  const handleShow = () => setOpen(true);

  const handleSave = () => {
    editList(list.uuid, newListName, newListText);
    handleClose();
  };

  const buttonClasses = () => {
    if (isDropdown) {
      return "block text-text px-4 py-2 text-sm";
    } else {
      return listDisplaySetting
        ? "text-text bg-panel hover:bg-panel-hover rounded p-1 shadow-sm mx-2 rounded-2xl"
        : "flex flex-grow justify-center text-text bg-panel hover:bg-panel-hover rounded p-1 shadow-sm";
    }
  };

  const placeholderText = () => {
    if (list.name) {
      return list.name;
    }
    const faction = rosterFactionName(list);
    const detachment = rosterDetachmentName(list);
    return faction && detachment ? `${faction} - ${detachment}` : "";
  };

  return (
    <>
      <button
        onClick={handleShow}
        className={buttonClasses()}
        aria-label="Open Edit List Panel"
        id={`edit-list-${list.uuid}-button`}
      >
        {isDropdown ? <span>Edit List</span> : <PencilSquareIcon className="h-8 w-8" />}
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
            <DialogTitle className="font-heading font-bold uppercase tracking-wider text-lg text-text text-center pb-1">
              Edit List
            </DialogTitle>
            <div>
              <label
                htmlFor="list-name"
                className="block text-md/6 font-medium text-text"
              >
                List Name
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="list-name"
                  name="list-name"
                  type="text"
                  placeholder={placeholderText()}
                  value={newListName}
                  aria-describedby="email-description"
                  className="block w-full resize-none h-full rounded bg-panel px-3 py-1.5 text-base text-text outline outline-1 -outline-offset-1 outline-panel-border placeholder:text-text-dim focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-accent sm:text-sm/6"
                  onChange={(event) => setNewListName(event.target.value)}
                />
                <button
                  onClick={handleSave}
                  className="flex items-center gap-x-1.5 rounded px-4 py-2 text-sm font-semibold text-white bg-success hover:bg-success/85 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success"
                  id="save-button"
                >
                  <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                  Save
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="list-text"
                className="block text-md/6 font-medium text-text"
              >
                List Text
              </label>
              <textarea
                id="list-text"
                name="list-text"
                rows={10}
                value={newListText}
                className="mt-2 block w-full resize-vertical rounded bg-panel px-3 py-2 text-base text-text outline outline-1 -outline-offset-1 outline-panel-border placeholder:text-text-dim focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-accent sm:text-sm/6"
                onChange={(event) => setNewListText(event.target.value)}
              />
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

export default EditListModal;
