import React from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import useStore from "@/store/store";

import datasheetsModels from "@/assets/json/Datasheets_models.json";
import datasheets from "@/assets/json/Datasheets.json";
import datasheetKeywords from "@/assets/json/Datasheets_keywords.json";

import ListUnit from "@/types/ListUnit";
import DatasheetModel from "@/types/DatasheetModel";
import Phase from "@/types/Phase";

import PhaseAbilities from "@/components/CardComponents/PhaseAbilities";

import SavesPhase from "./PhaseDisplays/SavesPhase";
import CommandPhase from "./PhaseDisplays/CommandPhase";
import MovementPhase from "./PhaseDisplays/MovementPhase";
import ShootingOrFightPhase from "./PhaseDisplays/ShootingOrFightPhase";
import ChargePhase from "./PhaseDisplays/ChargePhase";

function ListUnitCard({ unit }: { unit: ListUnit }) {
  const phase = useStore((state) => state.phase);
  const toggleUnit = useStore((state) => state.toggleUnit);
  const faction = useStore((state) => state.faction);

  const cardsCollapse = useStore((state) => state.cardsCollapse);
  const showKeywords = useStore((state) => state.showKeywords);

  if (!phase) {
    window.alert("Phase not set");
  }

  if (!faction) {
    window.alert("Faction not set");
  }

  const datasheetsMatchingName = datasheets.filter(
    (item) => item.name.toLowerCase() === unit.name.toLowerCase()
  );

  // Create an array of all unique factions in the datasheets
  const uniqueFactions = Array.from(
    new Set(datasheetsMatchingName.map((item) => item.faction_id))
  );

  // @ts-expect-error - Line 145 has a check that should prevent this from being null
  const datasheet = uniqueFactions.includes(faction)
    ? datasheetsMatchingName.filter((item) => item.faction_id === faction)[0]
    : datasheetsMatchingName[0];

  if (!datasheet) {
    window.alert(`Datasheet not found for unit ${unit.name}`);
    return null;
  }

  const datasheetModel = datasheetsModels.find(
    (datasheetModel: DatasheetModel) =>
      datasheetModel.datasheet_id === datasheet.id
  );

  if (!datasheetModel) {
    window.alert(`Datasheet model not found for unit ${unit.name}`);
    return null;
  }

  let characteristic: React.ReactNode;
  let toggled = true;

  switch (phase) {
    case Phase.Command:
      [characteristic, toggled] = CommandPhase({ datasheetModel });
      break;
    case Phase.Movement:
      [characteristic, toggled] = MovementPhase({ datasheetModel });
      break;
    case Phase.Shooting:
    case Phase.Fight:
      [characteristic, toggled] = ShootingOrFightPhase({
        unit,
        datasheet,
        phase,
      });
      break;
    case Phase.Charge:
      [characteristic, toggled] = ChargePhase();
      break;
    case Phase.Saves:
      [characteristic, toggled] = SavesPhase({ datasheetModel });
      break;
    default:
      characteristic = (
        <div className="text-center text-xl font-extrabold">BROKEN</div>
      );
      toggled = false;
  }

  // @ts-expect-error - This works. Not sure why flagged.
  const [phasedAbilities, abilitiesToggle] = PhaseAbilities({
    datasheetModel,
    phase,
  });

  const cardToggled = unit.toggled && (toggled || abilitiesToggle);
  const fadedClasses = cardToggled ? "" : "opacity-50";

  const unitFilteredKeywords = datasheetKeywords
    .filter((keyword) => keyword.datasheet_id === datasheet.id)
    .map((x) => x.keyword)
    .join(", ");

  return (
    <ul
      key={unit.datasheet_id}
      tabIndex={0}
      className={`group mx-4 my-2 px-3 py-1 rounded-lg border col-span-1 flex flex-col break-inside-avoid first:mt-0 cursor-pointer ${fadedClasses} shadow-sm bg-gray-50 dark:bg-gray-800 border-gray-50 dark:border-gray-700 focus:outline-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 dark:focus:outline-gray-800 dark:focus:outline dark:focus:outline-2 dark:focus:-outline-offset-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:border-gray-800`}  
      onClick={() => toggleUnit(unit)}
    >
      <div className="flex flex-row">
        <div
          className={`flex flex-row font-semibold text-xl align-middle items-center flex-grow ${fadedClasses}`}
        >
          <div className="flex-row flex-grow text-black dark:text-gray-50">{unit.name}</div>

          {showKeywords && (
            <div className="flex-shrink font-light text-sm text-gray-600 px-2 text-right dark:text-gray-300 dark:font-normal">
              {unitFilteredKeywords}
            </div>
          )}
        </div>
        {cardsCollapse && (
          <div className="flex justify-center items-center">
            <div className="m-auto flex flex-shrink shadow-md rounded-xl bg-gray-300 border-gray-300 my-1 text-gray-700 hover:bg-gray-400 hover:text-gray-200 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-gray-100">
              {cardToggled ? (
                <ChevronDownIcon className="h-8 w-8" />
              ) : (
                <ChevronUpIcon className="h-8 w-8" />
              )}
            </div>
          </div>
        )}
      </div>

      {!(cardsCollapse && !cardToggled) && (
        <div className="flex flex-col gap-1">
          <div className="">{characteristic}</div>
          <div className="">{phasedAbilities}</div>
        </div>
      )}
    </ul>
  );
}

export default ListUnitCard;
