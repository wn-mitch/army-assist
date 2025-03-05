import React from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 bg-blue-600 text-white rounded p-2 font-bold hover:bg-blue-700 shadow-xl"
      aria-label="Scroll to the top of the page"
      id="scroll-to-top-button"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
};

export default ScrollToTopButton;