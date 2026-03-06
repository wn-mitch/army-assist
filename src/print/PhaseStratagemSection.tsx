import React from "react";

import { Stratagem } from "@/types/Stratagem";

const PhaseStratagemSection = (stratagems: Stratagem[], columnClass: string = "columns-3") => {
  return (
    <div className={`${columnClass} gap-1 auto-cols-min px-1`}>
      {stratagems.map((stratagem) => {
        return (
          <div className="border border-black break-inside-avoid first:mt-0 my-1 px-1">
            <div className="flex flex-row">
              <span className="flex-1 font-semibold text-left">
                {stratagem.name}
              </span>
              <span className="flex-1 font-semibold text-right">
                {stratagem.cp_cost} CP
              </span>
            </div>
            <div className="flex flex-row">
              <span className="flex-1 text-sm text-left">
                {stratagem.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhaseStratagemSection;
