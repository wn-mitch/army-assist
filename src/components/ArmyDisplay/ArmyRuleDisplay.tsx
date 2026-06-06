import React from "react";
import useStore from "@/store/store";
import { Disclosure, DisclosureButton } from "@headlessui/react";

import { factions, detachments, type AbilityView } from "@/data/dataset";
import { toGamePhase } from "@/data/phaseMap";
import Phase from "@/types/Phase";

const ArmyRuleDisplay = () => {
  const getActiveRoster = useStore((state) => state.getActiveRoster);
  const getRosterArmyAbilities = useStore(
    (state) => state.getRosterArmyAbilities,
  );

  const phase =
    useStore((state) => state.storedRosters[state.activeList]?.phase) ??
    Phase.Pregame;
  const roster = getActiveRoster()?.roster ?? null;

  // Display names come from the dataset; the roster stores entity ids. Fall
  // back to the raw id when a lookup misses (e.g. unresolved detachment).
  const faction = roster?.faction_id
    ? (factions.get(roster.faction_id)?.name ?? roster.faction_id)
    : "Unknown Faction";
  const detachment = roster?.detachment_id
    ? (detachments.get(roster.detachment_id)?.name ?? roster.detachment_id)
    : "No Detachment Provided";

  // Army/detachment rules act in game phases; the UI-only Pregame/Saves
  // screens surface none. A rule with no phase mappings (most of the 11e
  // seed so far) is treated as always-relevant and shows in every game phase
  // — upstream phase mappings narrow this automatically as they land.
  const gamePhase = toGamePhase(phase);
  const abilities = gamePhase
    ? getRosterArmyAbilities().filter(
        (ability) =>
          ability.phases.length === 0 || ability.phases.includes(gamePhase),
      )
    : [];

  const abilitiesInPhase = abilities.length !== 0;

  const ruleType = (ability: AbilityView) =>
    ability.raw.ability_type === "detachment" ? "Detachment" : "Army";

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="mx-2 px-2">
      <Disclosure as="div">
        {({ open }) => (
          <>
            <DisclosureButton
              id="army-rule-button"
              className={({ open }) =>
                classNames(
                  "font-semibold py-2 rounded-lg w-full shadow-sm dark:font-bold",
                  open
                    ? "bg-gray-500  hover:bg-gray-600 dark:hover:bg-gray-600 dark:bg-gray-500 dark:text-gray-200 dark:hover:text-gray-100 text-white"
                    : "bg-gray-100 hover:bg-gray-600 text-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-white"
                )
              }
            >
              {open
                ? `${faction} - ${detachment} - Hide Detachment Rules`
                : `${faction} - ${detachment} - Show Detachment Rules`}
            </DisclosureButton>
            <Disclosure.Panel>
              {abilitiesInPhase ? (
                <div
                  className={`${
                    abilities.length > 1
                      ? "min-[400px]:columns-2 columns-1"
                      : "columns-1"
                  } my-1 -mx-1`}
                >
                  {abilities.map((ability, index) => (
                    <li
                      key={index}
                      className={`flex flex-col break-inside-avoid first:mt-0 m-1 p-1 bg-white dark:bg-gray-800 rounded-lg`}
                    >
                      <div className="text-md text-gray-900 dark:text-gray-100">
                        {ability.name} - {ruleType(ability)} Rule
                      </div>
                      <div className="text-sm font-thin text-gray-800 dark:text-gray-200 dark:font-normal">
                        {ability.describe()}
                      </div>
                    </li>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-thin text-gray-800 text-center dark:text-gray-200 dark:font-normal">
                  No Army or Detachment Rule in Phase
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default ArmyRuleDisplay;
