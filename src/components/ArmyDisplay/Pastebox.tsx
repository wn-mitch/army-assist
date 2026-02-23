import useStore from "@/store/store";
import React from "react";

export default function Pastebox() {
    const [text, setText] = React.useState("");
    const store = useStore();

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = store.parseText(text, "");

        if (!result) {
            window.alert(
                "Error: Invalid List Format. Use the ListForge format (listforge.club). If the list format is correct, this is likely caused by a parser bug, and the dev can fix it with a copy of your list!",
            );
            setText("");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full h-full gap-2"
        >
            <div className="mt-2 mx-2 h-full">
                <textarea
                    id="comment"
                    name="comment"
                    rows={5}
                    placeholder="Paste in your Army List from ListForge (listforge.club). Please double check the site abilities/weapons vs. what you know is on the list!"
                    className="block w-full resize-none h-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 dark:focus:outline-gray-400 sm:text-sm/6"
                    value={text}
                    onChange={handleChange}
                />
            </div>
            <div className="flex mb-2">
                <button
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-gray-600 dark:bg-gray-600 mx-10 px-3 py-2 text-sm font-semibold text-white dark:text-gray-200 shadow-sm hover:bg-gray-500 dark:hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 dark:focus-visible:outline-gray-400 dark:hover:text-gray-800"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}
