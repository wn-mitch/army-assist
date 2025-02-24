import React, { useEffect } from "react";

import Header from "@/components/Header";
import Body from "./components/Body";
import useStore from "./store/store";

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);

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
