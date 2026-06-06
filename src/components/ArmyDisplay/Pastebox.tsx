import useStore from "@/store/store";
import React from "react";
import Button from "@/components/ui/Button";

export default function Pastebox() {
    const [text, setText] = React.useState("");
    const store = useStore();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = store.parseText(text, "");

        if (!result) {
            window.alert(
                "Could not read this list. Supported formats: ListForge (text or share link), NewRecruit (JSON file or text export), GW app, Rosterizer. If your list is one of these, this is a parser bug — the dev can fix it with a copy of your list!",
            );
            setText("");
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (!content) return;

            const result = store.parseText(content, "");
            if (!result) {
                window.alert(
                    "Error: Could not parse the uploaded file. Ensure it is a valid New Recruit JSON export.",
                );
            }
        };
        reader.readAsText(file);

        // Reset input so the same file can be re-uploaded
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
                    placeholder="Paste your army list — ListForge text or share link, NewRecruit export (.json file or text), GW app text, or Rosterizer."
                    className="block w-full resize-none h-full rounded bg-panel px-3 py-1.5 text-base text-text outline outline-1 -outline-offset-1 outline-panel-border placeholder:text-text-dim focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-accent sm:text-sm/6"
                    value={text}
                    onChange={handleChange}
                />
                <p className="mt-1 text-xs text-text-dim">
                    Tip: avoid using &quot; - &quot; (space-dash-space) in your
                    ListForge list name.
                </p>
            </div>
            <div className="flex mb-2 gap-2 mx-10">
                <Button
                    variant="accent"
                    size="md"
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center"
                >
                    Submit
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                />
                <Button
                    size="md"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex flex-1 items-center justify-center"
                >
                    Import NR File
                </Button>
            </div>
        </form>
    );
}
