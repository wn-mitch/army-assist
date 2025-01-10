import React from "react";

import ListUnit from "@/types/ListUnit";
import useStore from "@/store/store";
import {
  getDatasheetCharacteristicByPhase,
} from "@/utils/jsonUtils";

function ListUnitCard({ unit }: { unit: ListUnit }) {
  const phase = useStore((state) => state.phase);
  const toggleUnit = useStore((state) => state.toggleUnit);
  const faction = useStore((state) => state.faction);
 
  const characteristic = getDatasheetCharacteristicByPhase(unit, phase ?? "", faction ?? "");

  const fadedClasses = unit.toggled ? "" : "opacity-50";

  return (
    <li
      key={unit.id}
      className={`col-span-1 border-4 border-gray-900 rounded-lg py-1 px-1 flex flex-col break-inside-avoid my-1 first:mt-0 shadow bg-slate-600 text-gray-200 ${fadedClasses}`}
      onClick={() => toggleUnit(unit)}
    >
      <div className="text-center text-lg font-bold rounded-lg bg-slate-900">{unit.name}</div>
      {characteristic}
    </li>
  );
}

export default ListUnitCard;
