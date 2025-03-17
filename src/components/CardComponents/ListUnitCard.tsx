import React, { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import useStore from "@/store/store";

import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";

import PhaseAbilities from "@/components/CardComponents/PhaseAbilities";

import SavesPhase from "./PhaseDisplays/SavesPhase";
import CommandPhase from "./PhaseDisplays/CommandPhase";
import MovementPhase from "./PhaseDisplays/MovementPhase";
import ShootingOrFightPhase from "./PhaseDisplays/ShootingOrFightPhase";
import ChargePhase from "./PhaseDisplays/ChargePhase";
import PhaseEnhancements from "./PhaseEnhancements";

function ListUnitCard({ unit }: { unit: ListUnit }) {
  const phase = useStore((state) => state.phase);
  const toggleUnit = useStore((state) => state.toggleUnit);

  const cardsCollapse = useStore((state) => state.cardsCollapse);
  const cardsGroup = useStore((state) => state.cardsGroup);
  const showKeywords = useStore((state) => state.showKeywords);
  const weaponsFilter = useStore((state) => state.weaponsFilter);

  let characteristic: React.ReactNode;
  let toggled = true;

  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const movementThreshold = 10; // Pixels of movement allowed for a tap

    if (Math.abs(touchStartY - touchEndY) < movementThreshold) {
      toggleUnit(unit); // Treat as a tap if movement is minimal
    }

    setTouchStartY(null);
  };

  const filteredWeapons = weaponsFilter
    ? unit.weaponsDatasheets.filter((weapon) =>
        Object.keys(unit.count ?? {}).some((name: string) => {
          return weapon.name?.toLowerCase().includes(name.toLowerCase());
        })
      )
    : unit.weaponsDatasheets;

  const phasedWeapons = filteredWeapons.filter((wargear) =>
    phase === "Shooting" ? wargear.type === "Ranged" : wargear.type === "Melee"
  );

  switch (phase) {
    case Phase.Command:
      [characteristic, toggled] = CommandPhase({ unit });
      break;
    case Phase.Movement:
      [characteristic, toggled] = MovementPhase({ unit });
      break;
    case Phase.Shooting:
    case Phase.Fight:
      [characteristic, toggled] = ShootingOrFightPhase({
        counts: unit.count || {},
        phasedWeapons,
        phase,
      });
      break;
    case Phase.Charge:
      [characteristic, toggled] = ChargePhase();
      break;
    case Phase.Saves:
      [characteristic, toggled] = SavesPhase({ unit });
      break;
  }

  // @ts-expect-error - This works. Not sure why flagged.
  const [phasedAbilities, abilitiesToggle] = PhaseAbilities({
    unit,
    phase,
  });

  const [phasedEnhancements, enhancementsToggle] = PhaseEnhancements({
    unit,
    phase,
  });

  const cardToggled =
    unit.toggled && (toggled || abilitiesToggle || enhancementsToggle);

  const fadedClasses = cardToggled ? "" : "opacity-50";

  const groupingNumber = cardsGroup ? `[${unit.groupCount}x]` : "";

  return (
    <ul
      key={unit.datasheet_id}
      tabIndex={0}
      className={`group mx-4 my-2 px-3 py-1 rounded-lg border col-span-1 flex flex-col break-inside-avoid first:mt-0 cursor-pointer ${fadedClasses} shadow-sm bg-gray-50 dark:bg-gray-800 border-gray-50 dark:border-gray-700 focus:outline-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 dark:focus:outline-gray-800 dark:focus:outline dark:focus:outline-2 dark:focus:-outline-offset-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:border-gray-800`}
      // onClick={() => toggleUnit(unit)}
      // onTouchStart={handleTouchStart}
      // onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-row">
        <div
          className={`flex flex-row font-semibold text-xl align-middle items-center flex-grow ${fadedClasses} cursor-pointer`}
        >
          <div className="flex-row text-gray-800 dark:text-gray-400 break-inside-avoid mr-1">
            {groupingNumber}
          </div>
          <div className="flex-1 flex-row flex-grow text-black dark:text-gray-50">
            {unit.name}
          </div>

          {showKeywords && (
            <div className="flex-shrink font-light text-sm text-gray-600 px-2 text-right dark:text-gray-300 dark:font-normal break-words">
              {unit.keywords}
            </div>
          )}
        </div>
        {cardsCollapse && (
          <div className="flex justify-center items-center">
            <button
              className="m-auto flex shadow-md rounded-xl bg-gray-300 border-gray-300 my-1 text-gray-700 hover:bg-gray-400 hover:text-gray-200 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
              id={`toggle-${unit.name}-button`}
              onClick={() => toggleUnit(unit)}
            >
              {cardToggled ? (
                <ChevronDownIcon className="h-8 w-8" />
              ) : (
                <ChevronUpIcon className="h-8 w-8" />
              )}
            </button>
          </div>
        )}
      </div>

      {!(cardsCollapse && !cardToggled) && (
        <div className="flex flex-col gap-1">
          <div className="">{characteristic}</div>
          <div className="">{phasedAbilities}</div>
          <div className="">{phasedEnhancements}</div>
        </div>
      )}
    </ul>
  );
}

export default ListUnitCard;
