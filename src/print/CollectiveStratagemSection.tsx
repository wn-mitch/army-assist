import React from "react";

import type { Stratagem } from "@/data/dataset";
import { describeStratagem } from "@/data/rosterSelectors";
import { toAppPhase } from "@/data/phaseMap";

const CollectiveStratagemSection = (
  stratagems: Stratagem[],
  columnClass: string = "columns-3",
) => {
  return (
    <div className={`${columnClass} gap-1 auto-cols-min px-1`}>
      {stratagems.map((stratagem, index) => (
        <div
          key={index}
          className="border border-black break-inside-avoid first:mt-0 my-1"
        >
          <div className="flex flex-row text-lg font-bold">
            <span className="flex-1 text-left ml-1">{stratagem.name}</span>
            <span className="flex-1 text-right mr-1">
              {stratagem.cp_cost} CP
            </span>
          </div>
          <div className="flex flex-row font-semibold">
            <span className="flex-1 text-center">
              Phases: {stratagem.phases.map(toAppPhase).join(", ")}
            </span>
          </div>
          <div className="flex flex-row">
            <span className="flex-1 text-sm text-center whitespace-pre-line">
              {describeStratagem(stratagem)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollectiveStratagemSection;
