import React, { useState, useEffect } from "react";
import armyAbilities from "@/assets/json/Abilities_modified.json";
import detachmentAbilities from "@/assets/json/Detachment_abilities_modified.json";
import useStore from "@/store/store";
import Ability from "@/types/Ability";
import { Disclosure } from "@headlessui/react";

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

  return (
    <div className="mx-2 px-2">
      <Disclosure as="div">
        {({ open }) => (
          <>
            <Disclosure.Button className="font-semibold py-2 border rounded-lg w-full shadow-sm">
              {open ? "Hide Army Rule" : "Show Army Rule"}
            </Disclosure.Button>
            <Disclosure.Panel>
              {abilitiesInPhase ? (
                <div className="columns-2">
                  {abilities.map((ability, index) => (
                    <li
                      key={index}
                      className={`flex flex-col break-inside-avoid first:mt-0 m-1 p-1`}
                    >
                      <div className="text-md">
                        {ability.name} - {ability.type} Rule
                      </div>
                      <div className="text-sm font-thin text-gray-800">
                        {ability.description}
                      </div>
                    </li>
                  ))}

                </div>
              ) : (
                <div className="text-sm font-thin text-gray-800 text-center">
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
