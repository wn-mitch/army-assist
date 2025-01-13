import React, { useEffect, useState } from "react";
import Abilities from "@/assets/json/Abilities_modified.json";
import Phase from "@/types/Phase";
import Ability from "@/types/Ability";
import DatasheetModel from "@/types/DatasheetModel";

const PhaseAbilities: React.FC<{ unit: DatasheetModel; phase: Phase }> = ({
  unit,
  phase,
}) => {
  const [abilities, setAbilities] = useState<Ability[]>([]);

  useEffect(() => {
    const matchingAbilities = Abilities.filter(
    // @ts-expect-error - Phases are strings, and the engine can't read that
      (ability: Ability) =>
        ability.datasheet_id === unit.datasheet_id &&
        ability.phases.includes(phase)
    );
    setAbilities(matchingAbilities as Ability[]);
  }, [unit, phase]);

  return (
    <div className="gap-2">
      {abilities.map((ability) => (
        <li
          key={ability.ability_id}
          className={`border-2 border-gray-900 rounded-lg py-1 px-1 flex flex-col break-inside-avoid my-1 first:mt-0 shadow bg-slate-600 text-gray-200 gap-1`}
        >
          <div className="px-2 py-1 text-left text-md font-bold rounded-lg bg-slate-700">
            {ability.name}
          </div>
          <div className="px-2 py-1 text-left text-sm font-semibold rounded-lg bg-slate-800">
            {ability.description}
          </div>
        </li>
      ))}
    </div>
  );
};

export default PhaseAbilities;
