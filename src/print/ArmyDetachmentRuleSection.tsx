import Ability from "@/types/Ability";
import React from "react";

const ArmyDetachmentRuleSection = (abilities: Ability[]) => {
  return (
    <div className="columns-2 gap-1 auto-cols-min px-1">
      {abilities.map((ability) => {
        return (
          <div className="border border-black break-inside-avoid first:mt-0 my-1">
            <div className="flex flex-row text-lg font-bold">
              <span className="flex-1 text-center ml-1">{ability.name}</span>
            </div>
            <div className="flex flex-row font-semibold">
              <span className="flex-1 text-center">
                Phases: {ability.phases.join(", ")}
              </span>
            </div>
            <div className="flex flex-row">
              <span className="flex-1 text-sm text-center">
                {ability.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArmyDetachmentRuleSection;
