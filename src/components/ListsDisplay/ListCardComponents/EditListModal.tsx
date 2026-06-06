import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PencilSquareIcon, XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import StoredRoster from "@/types/StoredRoster";
import {
  rosterFactionName,
  rosterDetachmentName,
} from "@/data/rosterSelectors";
import useStore from "@/store/store";

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

  const closeButtonClasses =
    "button flex flex-row items-center gap-x-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full items-center justify-center mx-1 my-1";

  const buttonClasses = () => {
    if (isDropdown) {
      return "block text-gray-700 px-4 py-2 text-sm";
    } else {
      return listDisplaySetting
        ? "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:text-white hover:text-white dark:hover:bg-gray-400 rounded-lg p-1 shadow-sm shadow-gray-500 dark:shadow-gray-600 mx-2 rounded-2xl"
        : "flex flex-grow justify-center bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 hover:text-white dark:hover:bg-gray-400 rounded-lg p-1 shadow-sm shadow-gray-500 dark:shadow-gray-700";
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
        className="fixed z-10 inset-0 overflow-y-scroll overflow-x-wrap text-gray-800 dark:text-gray-100"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black opacity-50"
            aria-hidden="true"
          />
          <DialogPanel className="bg-white dark:bg-gray-800 rounded-lg w-full lg:w-1/2 max-w-2xl p-4 z-20">
            <DialogTitle className="text-lg font-bold text-center pb-1">
              Edit List
            </DialogTitle>
            <div>
              <label
                htmlFor="list-name"
                className="block text-md/6 font-medium text-gray-900 dark:text-gray-100"
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
                  className="block w-full resize-none h-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline outline-1 -outline-offset-1 outline-gray-300 dark:gray-indigo-700 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 dark:focus:outline-gray-400 sm:text-sm/6"
                  onChange={(event) => setNewListName(event.target.value)}
                />
                <button
                  onClick={handleSave}
                  className="flex items-center gap-x-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
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
                className="block text-md/6 font-medium text-gray-900 dark:text-gray-100"
              >
                List Text
              </label>
              <textarea
                id="list-text"
                name="list-text"
                rows={10}
                value={newListText}
                className="mt-2 block w-full resize-vertical rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-base text-gray-900 dark:text-gray-100 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 dark:focus:outline-gray-400 sm:text-sm/6"
                onChange={(event) => setNewListText(event.target.value)}
              />
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

export default EditListModal;
