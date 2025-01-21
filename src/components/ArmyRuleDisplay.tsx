import React, { useState, useEffect } from "react";
import armyAbilities from "@/assets/json/Abilities_modified.json";
import detachmentAbilities from "@/assets/json/Detachment_abilities_modified.json";
import factions from "@/assets/json/Factions.json";
import useStore from "@/store/store";
import Ability from "@/types/Ability";

const ArmyRuleDisplay = () => {
  const faction = useStore((state) => state.faction);
  const detachment =
    useStore((state) => state.detachment) || "No Detachment Provided";
  const phase = useStore((state) => state.phase);

  const factionName = factions.find((x) => x.id === faction)?.name;

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
    
    console.log(filteredArmyAbilities, filteredDetachmentAbilities);

    setAbilities([...filteredArmyAbilities, ...filteredDetachmentAbilities]);
  }, [faction, detachment, phase]);

  const headerSection = () => {
    return (
      <div className="text-center text-lg font-bold rounded-lg bg-slate-800 text-white">
        {factionName} - {detachment}
      </div>
    );
  };

  if (abilities.length !== 0) {
    return (
      <div className="gap-2">
        {headerSection()}
        {abilities.map((ability,index) => (
          <li
            key={index}
            className={`border-2 border-gray-900 rounded-lg py-1 px-1 flex flex-col break-inside-avoid my-1 first:mt-0 shadow bg-slate-500 text-gray-200 gap-1`}
          >
            <div className="px-2 py-1 text-left text-md font-bold rounded-lg bg-slate-700">
              {ability.name} - {ability.type} Rule
            </div>
            <div className="px-2 py-1 text-left text-sm font-semibold rounded-lg bg-slate-800">
              {ability.description}
            </div>
          </li>
        ))}
      </div>
    );
  } else {
    return <div className="gap-2">{headerSection()}</div>;
  }
};

export default ArmyRuleDisplay;
