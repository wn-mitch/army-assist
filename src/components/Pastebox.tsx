import React from "react";
import useStore from "../store/store";

export default function Pastebox() {
  const [text, setText] = React.useState("");
  const store = useStore();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = store.parseText(text);

    if(!result) {
      window.alert("Error: Invalid List Format. Use the NR format (NewRecruit.eu). If the list format is correct, this is likely caused by a parser bug, and the dev can fix it with a copy of your list!");
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-full">
      <div className="h-full">
        <textarea
          id="comment"
          name="comment"
          rows={5}
          placeholder="Paste in your Army List in the NR format (NewRecruit.eu)"
          className="block w-full resize-none h-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          value={text}
          onChange={handleChange}
        />
      </div>
      <div className="mt-2 flex">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center rounded-md bg-indigo-600 mx-10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
