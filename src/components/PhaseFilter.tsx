import React from "react";
import useStore from "@/store/store";
import Phase from "@/types/Phase";

function PhaseFilter() {
  const phase = useStore((state) => state.phase);
  const setPhase = useStore((state) => state.setPhase);

  const isActivePhase = (currentPhase: Phase) => currentPhase === phase;

  const renderButton = (currentPhase: Phase, position: "left" | "middle" | "right") => {
    const baseClasses = "relative inline-flex items-center px-3 py-2 text-2xl font-bold ring-1 ring-inset ring-gray-300 focus:z-10 w-full text-center justify-center cursor-pointer select-none";
    const positionClasses = {
      left: "rounded-l-md",
      middle: "-ml-px",
      right: "rounded-r-md -ml-px",
    };
    const activeClasses = isActivePhase(currentPhase) ? "bg-slate-900 text-white" : "bg-white text-gray-900 hover:bg-gray-50";

    return (
      <button
        type="button"
        className={`${baseClasses} ${positionClasses[position]} ${activeClasses}`}
        onClick={() => setPhase(currentPhase)}
      >
        {currentPhase}
      </button>
    );
  };

  return (
    <span className="isolate inline-flex rounded-md shadow-sm border-4 border-slate-900 w-full">
      {renderButton(Phase.Command, "left")}
      {renderButton(Phase.Movement, "middle")}
      {renderButton(Phase.Shooting, "middle")}
      {renderButton(Phase.Charge, "middle")}
      {renderButton(Phase.Fight, "right")}
    </span>
  );
}

export default PhaseFilter;
