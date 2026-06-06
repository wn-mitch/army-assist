import React from "react";

import type { Stratagem } from "@/data/dataset";
import { describeStratagem } from "@/data/rosterSelectors";

const PhaseStratagemSection = (
  stratagems: Stratagem[],
  columnClass: string = "columns-3",
) => {
  return (
    <div className={`${columnClass} gap-1 auto-cols-min px-1`}>
      {stratagems.map((stratagem, index) => (
        <div
          key={index}
          className="border border-black break-inside-avoid first:mt-0 my-1 px-1"
        >
          <div className="flex flex-row">
            <span className="flex-1 font-semibold text-left">
              {stratagem.name}
            </span>
            <span className="flex-1 font-semibold text-right">
              {stratagem.cp_cost} CP
            </span>
          </div>
          <div className="flex flex-row">
            <span className="flex-1 text-sm text-left whitespace-pre-line">
              {describeStratagem(stratagem)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhaseStratagemSection;
