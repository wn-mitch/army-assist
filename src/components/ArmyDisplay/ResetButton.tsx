import React from "react";
import useStore from "@/store/store";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";

/**
 * Exits the active list back to the dashboard (store.reset() only clears the
 * active selection, so this is plain toolbar rhythm, not a danger action).
 */
const ResetButton = () => {
  const store = useStore();

  return (
    <Button
      variant="ghost-icon"
      className="mx-1"
      onClick={() => store.reset()}
      id="reset-button"
      aria-label="Back to list dashboard"
    >
      <ArrowRightStartOnRectangleIcon className="h-8 w-8" />
    </Button>
  );
};

export default ResetButton;
