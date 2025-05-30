import React from "react";
import Note from "@/types/Note";
import PrintSettings from "@/types/PrintSettings";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NoteSection = (notes: Note[] | undefined, settings: PrintSettings) => {
  if (!notes || notes.length === 0) {
    return null;
  }

  return (
    <div className="mt-1">
      <div className="text-sm font-semibold">Notes:</div>
      {notes.map((note, index) => (
        <div key={index} className="mx-1 text-sm italic">
          <span className="font-medium">{note.title}: </span>
          <span>{note.content}</span>
        </div>
      ))}
    </div>
  );
};

export default NoteSection;
