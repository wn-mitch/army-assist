import React, { useEffect } from "react";
import { decompressFromURL } from "@/utils/ListHelper";

import Header from "@/components/Header";
import Body from "./components/Body";
import useStore from "./store/store";

function App() {
    const isDarkMode = useStore((state) => state.settings.isDarkMode);
    const addListFromURLString = useStore((state) => state.addList);
    const addListListforge = useStore((state) => state.addListListforge);

    useEffect(() => {
        const path = window.location.pathname.substring(1); // Remove the leading '/'
        if (path) {
            // Check if the path starts with 'listforge/'
            if (path.startsWith("listforge/")) {
                const listforgeData = path.substring(10); // Remove 'listforge/' prefix
                const decodedListforgeData = decompressFromURL(listforgeData);
                if (!decodedListforgeData) {
                    console.error(
                        "Error adding listforge list from URL string:",
                        decodedListforgeData,
                    );
                    return;
                }
                addListListforge(decodedListforgeData);
            } else {
                const decodedData = decompressFromURL(path);
                if (!decodedData) {
                    console.error(
                        "Error adding newrecruit list from URL string:",
                        decodedData,
                    );
                    return;
                }
                addListFromURLString(decodedData);
            }

            window.history.replaceState({}, document.title, "/");
        }
    }, [addListFromURLString, addListListforge]);

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
