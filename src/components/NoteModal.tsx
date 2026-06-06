import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Phase from "@/types/Phase";
import Note from "@/types/Note";
import useStore from "@/store/store";
import type { RosterUnitRow } from "@/data/rosterSelectors";
import { unitName } from "@/data/rosterSelectors";
import Button from "@/components/ui/Button";

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
          className="block text-sm font-medium text-text-muted"
        >
          Title
        </label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full bg-panel border border-panel-border rounded shadow-sm p-2 text-text placeholder:text-text-dim focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <label
          htmlFor="note-content"
          className="block text-sm font-medium text-text-muted"
        >
          Content
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full bg-panel border border-panel-border rounded shadow-sm p-2 text-text placeholder:text-text-dim focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <p className="block text-sm font-medium text-text-muted mb-2">
          Phases
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.values(Phase).map((phase) => (
            <label key={phase} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedPhases.includes(phase)}
                onChange={() => togglePhase(phase)}
                className="rounded border-border accent-accent shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              />
              <span className="ml-2 mr-3 text-text-muted">
                {phase}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="accent"
          size="md"
          className="w-full"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button size="md" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
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
    <li className="p-2 bg-surface border border-border rounded">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3 className="font-semibold text-text">
            {note.title}
          </h3>
          <p className="text-text-muted">{note.content}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {note.phases.map((phase, phaseIndex) => (
              <span
                key={phaseIndex}
                className="px-2 py-1 bg-accent/15 text-accent text-sm rounded"
              >
                {phase}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost-icon"
            onClick={() => onEdit(index)}
            aria-label="Edit note"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost-icon"
            className="text-danger hover:bg-danger/15 hover:text-danger"
            onClick={() => onDelete(index)}
            aria-label="Delete note"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
}

function NoteModal({ row }: { row: RosterUnitRow }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  const addRosterNote = useStore((state) => state.addRosterNote);
  const editRosterNote = useStore((state) => state.editRosterNote);
  const deleteRosterNote = useStore((state) => state.deleteRosterNote);

  const notes = row.overlay.notes;

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
      deleteRosterNote(row.index, index);
    }
  };

  const handleSaveNewNote = (note: Note) => {
    addRosterNote(row.index, note);
    setIsAddingNote(false);
  };

  const handleUpdateNote = (note: Note) => {
    if (editingNoteIndex !== null) {
      editRosterNote(row.index, editingNoteIndex, note);
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
      <Button
        variant="ghost-icon"
        className="m-auto my-1"
        onClick={handleShow}
        aria-label="Manage notes"
        title="Manage notes"
      >
        <PencilIcon className="h-6 w-6" />
      </Button>

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
              Notes for {unitName(row)}
            </DialogTitle>

            {!isAddingNote && editingNoteIndex === null && (
              <>
                {notes && notes.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {notes.map((note, index) => (
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
                  <p className="mt-4 text-text-muted">
                    No notes available.
                  </p>
                )}
                <div className="mt-4">
                  <Button
                    variant="accent"
                    size="md"
                    className="w-full"
                    onClick={handleStartAddingNote}
                  >
                    New Note
                  </Button>
                </div>
              </>
            )}

            {isAddingNote && (
              <div className="mt-4">
                <h3 className="font-heading font-semibold uppercase tracking-wider text-text mb-2">
                  Add New Note
                </h3>
                <NoteForm
                  note={emptyNote}
                  onSave={handleSaveNewNote}
                  onCancel={handleCancelEdit}
                />
              </div>
            )}

            {editingNoteIndex !== null && notes && (
              <div className="mt-4">
                <h3 className="font-heading font-semibold uppercase tracking-wider text-text mb-2">
                  Edit Note
                </h3>
                <NoteForm
                  note={notes[editingNoteIndex]}
                  onSave={handleUpdateNote}
                  onCancel={handleCancelEdit}
                />
              </div>
            )}

            {!isAddingNote && editingNoteIndex === null && (
              <div className="mt-4">
                <Button size="md" className="w-full" onClick={handleClose}>
                  Close
                </Button>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default NoteModal;
