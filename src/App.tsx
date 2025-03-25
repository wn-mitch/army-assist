import React, { useEffect } from "react";
import LZstring from "lz-string";

import Header from "@/components/Header";
import Body from "./components/Body";
import useStore from "./store/store";

function App() {
  const isDarkMode = useStore((state) => state.settings.isDarkMode);
  const addListFromURLString = useStore((state) => state.addList);

  useEffect(() => {
    const path = window.location.pathname.substring(1); // Remove the leading '/'
    if (path) {
      const decodedData = LZstring.decompressFromEncodedURIComponent(path);
      addListFromURLString(decodedData)
      window.history.replaceState({}, document.title, "/");
    }
  }, [addListFromURLString]);

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
