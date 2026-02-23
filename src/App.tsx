import React, { useEffect } from "react";
import { decompressFromURL } from "@/utils/ListHelper";

import Header from "@/components/Header";
import Body from "./components/Body";
import useStore from "./store/store";

function App() {
    const isDarkMode = useStore((state) => state.settings.isDarkMode);
    const addList = useStore((state) => state.addList);

    useEffect(() => {
        const path = window.location.pathname.substring(1); // Remove the leading '/'
        if (path) {
            // Strip optional 'listforge/' prefix for backwards compatibility
            const data = path.startsWith("listforge/")
                ? path.substring(10)
                : path;
            const decodedData = decompressFromURL(data);
            if (!decodedData) {
                console.error(
                    "Error adding list from URL string:",
                    decodedData,
                );
                return;
            }
            addList(decodedData);
            window.history.replaceState({}, document.title, "/");
        }
    }, [addList]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <Body />
        </div>
    );
}

export default App;
