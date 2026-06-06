import React from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <Button
      variant="ghost-icon"
      onClick={scrollToTop}
      // Floating utility: panel fill so it reads over content, but never
      // accent — the stratagem opener owns the floating CTA slot.
      className="fixed bottom-4 right-4 bg-panel shadow-xl"
      aria-label="Scroll to the top of the page"
      id="scroll-to-top-button"
    >
      <ArrowUpIcon className="h-8 w-8" />
    </Button>
  );
};

export default ScrollToTopButton;
