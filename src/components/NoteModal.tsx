import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Phase from "@/types/Phase";
import Note from "@/types/Note";
import useStore from "@/store/store";
import ListUnit from "@/types/ListUnit";

function NoteForm({
  note,
  onSave,
  onCancel,
}: {
  note: Note;
  onSave: (updatedNote: Note) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [selectedPhases, setSelectedPhases] = useState<Phase[]>(note.phases);

  const togglePhase = (phase: Phase) => {
    if (selectedPhases.includes(phase)) {
      setSelectedPhases(selectedPhases.filter((p) => p !== phase));
    } else {
      setSelectedPhases([...selectedPhases, phase]);
    }
  };

  const handleSave = () => {
    onSave({
      title,
      content,
      phases: selectedPhases,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="note-title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="note-content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Content
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phases
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.values(Phase).map((phase) => (
            <label key={phase} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedPhases.includes(phase)}
                onChange={() => togglePhase(phase)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 mr-3 text-gray-700 dark:text-gray-300">
                {phase}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          className="px-4 py-2 bg-green-700 font-bold text-white rounded w-full dark:bg-green-500"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="px-4 py-2 bg-red-500 font-bold text-white rounded w-full"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function UnitNote({
  note,
  index,
  onEdit,
  onDelete,
}: {
  note: Note;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <li className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {note.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{note.content}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {note.phases.map((phase, phaseIndex) => (
              <span
                key={phaseIndex}
                className="px-2 py-1 bg-blue-200 dark:bg-blue-600 text-white rounded"
              >
                {phase}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(index)}
            className="p-1 rounded bg-green-500 text-white hover:bg-green-600"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(index)}
            className="p-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}

function NoteModal({ unit }: { unit: ListUnit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  const addNewNote = useStore((state) => state.addNewNote);
  const editNote = useStore((state) => state.editNote);
  const deleteNote = useStore((state) => state.deleteNote);

  const handleStartAddingNote = () => {
    setIsAddingNote(true);
    setEditingNoteIndex(null);
  };

  const handleEditNote = (index: number) => {
    setEditingNoteIndex(index);
    setIsAddingNote(false);
  };

  const handleDeleteNote = (index: number) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(unit, index);
    }
  };

  const handleSaveNewNote = (note: Note) => {
    addNewNote(unit, note);
    setIsAddingNote(false);
  };

  const handleUpdateNote = (note: Note) => {
    if (editingNoteIndex !== null) {
      editNote(unit, editingNoteIndex, note);
      setEditingNoteIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setIsAddingNote(false);
    setEditingNoteIndex(null);
  };

  const emptyNote: Note = {
    title: "",
    content: "",
    phases: [
      Phase.Pregame,
      Phase.Movement,
      Phase.Command,
      Phase.Shooting,
      Phase.Charge,
      Phase.Fight,
      Phase.Saves,
    ],
  };

  return (
    <>
      <button
        className="m-auto flex shadow-md rounded-xl bg-green-300 border-green-300 my-1 text-green-700 hover:bg-green-400 hover:text-green-200 dark:bg-green-500 dark:text-green-200 dark:hover:bg-green-600 dark:hover:text-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-400"
        onClick={handleShow}
      >
        <PencilIcon className="h-8 w-8 p-1" />
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black opacity-50"
            aria-hidden="true"
          />
          <DialogPanel className="bg-white dark:bg-gray-800 rounded-lg w-full lg:w-3/4 max-w-lg p-4 z-20">
            <DialogTitle className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
              Notes for {unit.name}
            </DialogTitle>

            {!isAddingNote && editingNoteIndex === null && (
              <>
                {unit.notes && unit.notes.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {unit.notes.map((note, index) => (
                      <UnitNote
                        key={index}
                        note={note}
                        index={index}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    No notes available.
                  </p>
                )}
                <div className="mt-4">
                  <button
                    className="px-4 py-2 bg-green-700 font-bold text-white rounded w-full dark:bg-green-500"
                    onClick={handleStartAddingNote}
                  >
                    New Note
                  </button>
                </div>
              </>
            )}

            {isAddingNote && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Add New Note
                </h3>
                <NoteForm
                  note={emptyNote}
                  onSave={handleSaveNewNote}
                  onCancel={handleCancelEdit}
                />
              </div>
            )}

            {editingNoteIndex !== null && unit.notes && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Edit Note
                </h3>
                <NoteForm
                  note={unit.notes[editingNoteIndex]}
                  onSave={handleUpdateNote}
                  onCancel={handleCancelEdit}
                />
              </div>
            )}

            {!isAddingNote && editingNoteIndex === null && (
              <div className="mt-4">
                <button
                  onPointerDown={handleClose}
                  className="px-4 py-2 bg-red-700 font-bold text-white rounded w-full dark:bg-red-500"
                >
                  Close
                </button>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default NoteModal;
