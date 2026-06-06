import React, { useEffect } from "react";
import { decompressFromURL } from "@/utils/ListHelper";

import Header from "@/components/Header";
import Body from "./components/Body";
import useStore from "./store/store";
import { themeById, themeForFactionId } from "@/theme/factionThemeMap";

function App() {
    const isDarkMode = useStore((state) => state.settings.isDarkMode);
    const factionThemeId = useStore(
        (state) => state.settings.factionThemeId ?? "",
    );
    const activeFactionId = useStore((state) =>
        state.activeList >= 0
            ? state.storedRosters[state.activeList]?.roster?.faction_id
            : undefined,
    );
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

    // Faction theme: an explicit picker choice wins; "" means auto-resolve
    // from the active roster's faction. The palette overrides the @theme
    // token defaults (Neutral dark) via inline custom properties on <html>.
    useEffect(() => {
        const theme =
            themeById(factionThemeId) ?? themeForFactionId(activeFactionId);
        const tokens = theme.palette[isDarkMode ? "dark" : "light"];
        for (const [key, value] of Object.entries(tokens)) {
            document.documentElement.style.setProperty(
                `--color-${key}`,
                value,
            );
        }
    }, [factionThemeId, activeFactionId, isDarkMode]);

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <Body />
        </div>
    );
}

export default App;
