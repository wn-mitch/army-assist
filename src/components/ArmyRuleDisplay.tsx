import React, { useState, useEffect } from "react";
import armyAbilities from "@/assets/json/Abilities_modified.json";
import detachmentAbilities from "@/assets/json/Detachment_abilities_modified.json";
import useStore from "@/store/store";
import Ability from "@/types/Ability";
import { Disclosure, DisclosureButton } from "@headlessui/react";

const ArmyRuleDisplay = () => {
  const faction = useStore((state) => state.faction);
  const detachment =
    useStore((state) => state.detachment) || "No Detachment Provided";
  const phase = useStore((state) => state.phase);

  const [abilities, setAbilities] = useState<Ability[]>([]);

  useEffect(() => {
    const filteredArmyAbilities = armyAbilities
      .filter(
        (ability) =>
          ability.faction_id === faction && ability.phases.includes(phase)
      )
      .map((x) => ({
        ...x,
        type: "Army",
        datasheet_id: "",
        line: "",
        ability_id: "",
        model: "",
        parameter: "",
      }));

    const filteredDetachmentAbilities = detachmentAbilities
      .filter(
        (ability) =>
          ability.faction_id === faction &&
          ability.detachment === detachment &&
          ability.phases.includes(phase)
      )
      .map((x) => ({
        ...x,
        type: "Detachment",
        datasheet_id: "",
        line: "",
        ability_id: "",
        model: "",
        parameter: "",
      }));

    setAbilities([...filteredArmyAbilities, ...filteredDetachmentAbilities]);
  }, [faction, detachment, phase]);

  const abilitiesInPhase = abilities.length !== 0;

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="mx-2 px-2">
      <Disclosure as="div">
        {({ open }) => (
          <>
            <DisclosureButton
              className={({ open }) =>
                classNames(
                  "font-semibold py-2 rounded-lg w-full shadow-sm dark:font-bold",
                  open
                    ? "bg-gray-600  hover:bg-gray-500 dark:hover:bg-gray-600 dark:bg-gray-500 dark:text-gray-200 text-white dark:hover:text-gray-100"
                    : "bg-white hover:bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200",
                  "cursor-pointer focus:outline-none focus:-outline-offset-2 focus:outline-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600"
                )
              }
            >
              {open ? `${faction} - ${detachment} - Hide Army Rules` : `${faction} - ${detachment} - Show Army Rules`}
            </DisclosureButton>
            <Disclosure.Panel>
              {abilitiesInPhase ? (
                <div className="min-[400px]:columns-2 columns-1 my-1 -mx-1">
                  {abilities.map((ability, index) => (
                    <li
                      key={index}
                      className={`flex flex-col break-inside-avoid first:mt-0 m-1 p-1 bg-white dark:bg-gray-800 rounded-lg`}
                    >
                      <div className="text-md text-gray-900 dark:text-gray-100">
                        {ability.name} - {ability.type} Rule
                      </div>
                      <div className="text-sm font-thin text-gray-800 dark:text-gray-200 dark:font-normal">
                        {ability.description}
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
