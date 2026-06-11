import React from "react";

import type { AbilityView } from "@/data/dataset";
import { describeAbilityView } from "@/data/rosterSelectors";
import { toAppPhase } from "@/data/phaseMap";

const ArmyDetachmentRuleSection = (
  abilities: AbilityView[],
  columnClass: string = "columns-2",
) => {
  return (
    <div className={`${columnClass} gap-1 auto-cols-min px-1`}>
      {abilities.map((ability, index) => {
        // A rule with no game phases is always relevant (e.g. an army-wide
        // rule that isn't scoped to a single phase).
        const phasesText =
          ability.phases.length === 0
            ? "All"
            : ability.phases.map(toAppPhase).join(", ");

        return (
          <div
            key={index}
            className="border border-black break-inside-avoid first:mt-0 my-1"
          >
            <div className="flex flex-row text-lg font-bold">
              <span className="flex-1 text-center ml-1">{ability.name}</span>
            </div>
            <div className="flex flex-row font-semibold">
              <span className="flex-1 text-center">Phases: {phasesText}</span>
            </div>
            <div className="flex flex-row">
              <span className="flex-1 text-sm text-center whitespace-pre-line">
                {describeAbilityView(ability)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArmyDetachmentRuleSection;
