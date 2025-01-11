import React, { useState } from "react";
import useStore from "@/store/store";
import Phase from "@/types/Phase";

function PhaseFilter() {
  const phase = useStore((state) => state.phase);
  const setPhase = useStore((state) => state.setPhase);
  const activePhases = useStore((state) => state.activePhases);
  const [isDropdown, setIsDropdown] = useState(window.innerWidth <= 768);

  const handleResize = () => {
    setIsDropdown(window.innerWidth <= 768);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        key={currentPhase}
        type="button"
        className={`${baseClasses} ${positionClasses[position]} ${activeClasses}`}
        onClick={() => setPhase(currentPhase)}
      >
        {currentPhase}
      </button>
    );
  };

  const renderDropdown = () => (
    <select
      value={phase}
      onChange={(e) => setPhase(e.target.value as Phase)}
      className="w-full p-2 text-2xl font-bold bg-white border-4 border-slate-900 rounded-md"
    >
      {Object.keys(Phase).map((phase) => (
        activePhases[phase as Phase] && <option key={phase} value={phase}>{phase}</option>
      ))}
    </select>
  );

  return (
    <div className="w-full">
      {isDropdown ? (
        renderDropdown()
      ) : (
        <span className="isolate inline-flex rounded-md shadow-sm border-4 border-slate-900 w-full">
          {Object.keys(Phase).map((phase, index, array) => (
            activePhases[phase as Phase] && renderButton(phase as Phase, index === 0 ? "left" : index === array.length - 1 ? "right" : "middle")
          ))}
        </span>
      )}
    </div>
  );
}

export default PhaseFilter;
