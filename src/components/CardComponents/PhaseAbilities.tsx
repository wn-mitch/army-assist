import React, { useEffect, useState } from "react";
import Abilities from "@/assets/json/Datasheets_abilities_modified.json";
import Phase from "@/types/Phase";
import Ability from "@/types/Ability";
import DatasheetModel from "@/types/DatasheetModel";

const PhaseAbilities: React.FC<{
  datasheetModel: DatasheetModel;
  phase: Phase;
}> = ({ datasheetModel, phase }) => {
  const [abilities, setAbilities] = useState<Ability[]>([]);

  useEffect(() => {
    const matchingAbilities = Abilities.filter(
      // @ts-expect-error - Phases are strings, and the engine can't read that
      (ability: Ability) =>
        ability.datasheet_id === datasheetModel.datasheet_id &&
        ability.phases.includes(phase)
    ).map((ability) => {
      switch (ability.ability_id) {
        case "000008344":
          return {
            ...ability,
            name: `Scout ${ability.parameter}`,
            description: `At the start of the first battle round, before the first turn begins, you can move this unit up to ${ability.parameter} as if it were the Movement phase.`,
          };
        case "000008334":
          return {
            ...ability,
            name: `Firing Deck`,
            description:
              'During deployment, if every model in a unit has this ability, then when you set it up, it can be set up anywhere on the battlefield that is more than 9" horizontally away from the enemy deployment zone and all enemy models.',
          };
        case "000008345":
          return {
            ...ability,
            name: `Infiltrators`,
            description:
              'During deployment, if every model in a unit has this ability, then when you set it up, it can be set up anywhere on the battlefield that is more than 9" horizontally away from the enemy deployment zone and all enemy models.',
          };
        case "000008339":
          return {
            ...ability,
            name: `Deadly Demise ${ability.parameter}`,
            description:
              'Some models have \u2018Deadly Demise x\' listed in their abilities. When such a model is destroyed, roll one D6 before removing it from play (if such a model is a TRANSPORT, roll before any embarked models disembark). On a 6, each unit within 6" of that model suffers a number of mortal wounds denoted by \u2018x\' (if this is a random number, roll separately for each unit within 6").',
          };
        case "000008340":
          return {
            ...ability,
            name: `Fights First`,
            description:
              "Units with this ability that are eligible to fight do so in the Fights First step, provided every model in the unit has this ability.",
          };
        case "000008336":
          return {
            ...ability,
            name: "Lone Operative",
            description: "Unless part of an Attached unit (see Leader), this unit can only be selected as the target of a ranged attack if the attacking model is within 12\"."
          }
        case "000008342":
          return {
            ...ability,
            name: "Hover",
            description: "Some AIRCRAFT models have \u2018Hover' listed in their abilities. When you are instructed to Declare Battle Formations, before doing anything else, you must first declare which models from your army with this ability will be in Hover mode. If a model is in Hover mode, then until the end of the battle, its Move characteristic is changed to 20\", it loses the AIRCRAFT keyword and it loses all associated rules for being an AIRCRAFT model. Models in Hover mode do not start the battle in Reserves, but you can choose to place them into Strategic Reserves following the normal rules if you wish"
          }
        case "000008343":
          return {
            ...ability,
            name: "Deep Strike",
            description: "During the Declare Battle Formations step, if every model in a unit has this ability, you can set it up in Reserves instead of setting it up on the battlefield. If you do, in the Reinforcements step of one of your Movement phases you can set up this unit anywhere on the battlefield that is more than 9\" horizontally away from all enemy models. If a unit with the Deep Strike ability arrives from Strategic Reserves, the controlling player can choose for that unit to be set up either using the rules for Strategic Reserves or using the Deep Strike ability. Unit can be set up in Reserves instead of on the battlefield.Unit can be set up in your Reinforcements step, more than 9\" horizontally away from all enemy models."
          }
        case "000008337":
          return {
            ...ability,
            name: "Stealth",
            description: "If every model in a unit has this ability, then each time a ranged attack is made against it, subtract 1 from that attack's Hit roll."
          }
        default:
          if (ability.name === "") {
            return {
              ...ability,
              name: `Unknown Ability ${ability.ability_id}`,
              description:
                "No description provided, please contact the dev for a fix",
            };
          } else {
            return ability;
          }
      }
    });

    setAbilities(matchingAbilities as Ability[]);
  }, [datasheetModel, phase]);

  const abilitiesList = (
    <div className="gap-2">
      {abilities.map((ability, index) => (
        <li
          key={index}
          className={`border-2 border-gray-900 rounded-lg py-1 px-1 flex flex-col break-inside-avoid my-1 first:mt-0 shadow bg-slate-500 text-gray-200 gap-1`}
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

  return [abilitiesList, abilities.length > 0];
};

export default PhaseAbilities;
