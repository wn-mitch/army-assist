import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
    QuestionMarkCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { FaDiscord, FaLinkedin, FaPatreon } from "react-icons/fa";
import useStore from "@/store/store";
import Button from "@/components/ui/Button";

function Instructions() {
    const [isOpen, setIsOpen] = useState(false);
    const isFirstVisit = useStore((state) => state.isFirstVisit);
    const setFirstVisit = useStore((state) => state.setFirstVisit);

    useEffect(() => {
        if (isFirstVisit) {
            setIsOpen(true);
            setFirstVisit(false);
        }
    }, [isFirstVisit, setFirstVisit]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        } else {
            window.removeEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleClose = () => setIsOpen(false);
    const handleShow = () => setIsOpen(true);

    const openLink = (url: string) => {
        window.open(url, "_blank", "noopener noreferrer");
    };

    const linkButtonClasses =
        "w-full flex items-center justify-center gap-x-1.5 mx-1 my-1";

    return (
        <>
            <button
                onClick={handleShow}
                className="text-text-muted hover:bg-panel-hover hover:text-text rounded p-2 font-bold mx-1 transition-colors"
                aria-label="Open Instructions Panel"
                id="instructions-button"
            >
                <QuestionMarkCircleIcon className="h-8 w-8" />
            </button>

            <Dialog
                open={isOpen}
                onClose={() => {}}
                className="fixed z-10 inset-0 overflow-y-scroll overflow-x-wrap text-text"
            >
                <div className="flex items-center justify-center min-h-screen">
                    <DialogPanel className="fixed inset-0 bg-black/50" />

                    <div className="my-5 bg-panel-surface border border-panel-border shadow-xl rounded-lg lg:w-3/4 max-w-2xl mx-auto p-4 relative z-20">
                        <Button
                            variant="ghost-icon"
                            id="close-instructions"
                            onClick={handleClose}
                            className="absolute top-2 right-2"
                            aria-label="Close Instructions"
                        >
                            <XCircleIcon className="h-8 w-8" />
                        </Button>
                        <DialogTitle className="text-lg font-heading font-bold uppercase tracking-wider text-center pb-1">
                            Instructions
                        </DialogTitle>
                        <ol className="list-decimal list-inside text-base">
                            <li>
                                Create a list on ListForge (listforge.club). If
                                you just want to explore the site's features,
                                you can click the sample on the List Dashboard
                            </li>
                            <li>Click Export or Share</li>
                            <li>Copy the list text to your clipboard</li>
                            <li>Paste into the pastebox</li>
                            <li>
                                Tap the pencil icon (Edit Force Mode) to attach
                                leaders to their units and add unit notes
                            </li>
                            <li>
                                Please report any issues you find in the discord
                                below
                            </li>
                        </ol>

                        <DialogTitle className="text-lg font-heading font-bold uppercase tracking-wider text-center py-1">
                            About Me
                        </DialogTitle>
                        <p className="text-base">
                            Hi, I’m Will Mitchell (aka TheAlpacalypse), the
                            developer behind ArmyAssist. Your feedback and
                            suggestions are invaluable: come connect with me on
                            Discord or Patreon. Let’s build something awesome
                            together!
                        </p>

                        <div className="mt-4 flex w-full flex-col">
                            <div className="flex flex-col lg:flex-row">
                                <Button
                                    size="md"
                                    id="linkedin-link"
                                    onClick={() =>
                                        openLink(
                                            "https://www.linkedin.com/in/will--mitch/",
                                        )
                                    }
                                    className={linkButtonClasses}
                                >
                                    <FaLinkedin
                                        aria-hidden="true"
                                        className="-ml-0.5 h-5 w-5"
                                    />
                                    Contact me on LinkedIn
                                </Button>
                                <Button
                                    size="md"
                                    id="patreon-link"
                                    onClick={() =>
                                        openLink(
                                            "https://patreon.com/ArmyAssist",
                                        )
                                    }
                                    className={linkButtonClasses}
                                >
                                    <FaPatreon
                                        aria-hidden="true"
                                        className="-ml-0.5 h-5 w-5"
                                    />
                                    Support me on Patreon
                                </Button>
                                <Button
                                    variant="accent"
                                    size="md"
                                    id="discord-link"
                                    onClick={() =>
                                        openLink(
                                            "https://discord.gg/hVVtGuybhw",
                                        )
                                    }
                                    className={linkButtonClasses}
                                >
                                    <FaDiscord
                                        aria-hidden="true"
                                        className="-ml-0.5 h-5 w-5"
                                    />
                                    Join the Discord
                                </Button>
                            </div>
                            <Button
                                size="md"
                                onClick={handleClose}
                                className={linkButtonClasses}
                                id="close-button"
                            >
                                <XCircleIcon
                                    aria-hidden="true"
                                    className="-ml-0.5 h-5 w-5"
                                />
                                Close
                            </Button>
                        </div>

                        <div className="mt-4 text-center text-text-dim">
                            Data from the 40k Data Consortium
                            (@alpaca-software/40kdc-data)
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default Instructions;
