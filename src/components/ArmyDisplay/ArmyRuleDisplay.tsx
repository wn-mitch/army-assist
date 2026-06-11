import React from "react";
import useStore from "@/store/store";
import { Disclosure, DisclosureButton } from "@headlessui/react";

import { factions, type AbilityView } from "@/data/dataset";
import {
  describeAbilityView,
  rosterDetachmentName,
} from "@/data/rosterSelectors";
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
  const activeRoster = getActiveRoster();
  const roster = activeRoster?.roster ?? null;

  // Display names come from the dataset; the roster stores entity ids. Fall
  // back to the raw id when a lookup misses (e.g. unresolved faction).
  const faction = roster?.faction_id
    ? (factions.get(roster.faction_id)?.name ?? roster.faction_id)
    : "Unknown Faction";
  // 11e lists can field several detachments; the shared selector joins their
  // names with " + " (and the rules panel below stacks every detachment's
  // rule). Empty string means no detachment resolved.
  const detachmentName = rosterDetachmentName(activeRoster ?? undefined);
  const detachment = detachmentName || "No Detachment Provided";

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
                  "font-heading uppercase tracking-wider font-bold py-2 rounded w-full shadow-sm",
                  open
                    ? "bg-accent text-accent-foreground hover:bg-accent-hover"
                    : "text-text-muted hover:bg-panel-hover hover:text-text"
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
                      className={`flex flex-col break-inside-avoid first:mt-0 m-1 p-1 bg-surface rounded`}
                    >
                      <div className="text-md text-text">
                        {ability.name} - {ruleType(ability)} Rule
                      </div>
                      <div className="text-sm font-normal text-text whitespace-pre-line">
                        {describeAbilityView(ability)}
                      </div>
                    </li>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-normal text-text text-center">
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
