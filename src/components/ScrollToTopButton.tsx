import React from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 bg-accent text-accent-foreground rounded p-2 font-bold hover:bg-accent-hover shadow-xl"
      aria-label="Scroll to the top of the page"
      id="scroll-to-top-button"
    >
      <ArrowUpIcon className="p-1 h-8 w-8" />
    </button>
  );
};

export default ScrollToTopButton;