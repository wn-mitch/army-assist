import React from "react";

import Phase from "@/types/Phase";
import type { RosterUnit } from "@/data/dataset";
import {
  unitEnhancement,
  describeEnhancement,
} from "@/data/rosterSelectors";

/**
 * Enhancement on a roster unit. The package Enhancement record carries no
 * per-phase scoping (unlike the legacy model), so the enhancement is shown in
 * every phase whenever the unit has one. Description text is the linked
 * ability's DSL description; points come from the Enhancement record.
 */
const PhaseEnhancements: React.FC<{
  rosterUnit: RosterUnit;
  // `phase` is accepted for parity with the other phase blocks; the package
  // carries no per-phase enhancement scoping so it isn't used to filter.
  phase: Phase;
}> = ({ rosterUnit }) => {
  const enhancement = unitEnhancement(rosterUnit);

  if (!enhancement) {
    return [<div className="ml-1" />, false];
  }

  const description = describeEnhancement(enhancement);

  const enhancementList = (
    <div className="ml-1">
      <li className={`flex flex-col break-inside-avoid first:mt-0`}>
        <div className="text-md font-semibold text-text">
          {enhancement.name}
          {typeof enhancement.cost === "number" ? ` (${enhancement.cost} pts)` : ""}
        </div>
        {description && (
          <div className="font-normal text-sm text-text whitespace-pre-line">
            {description}
          </div>
        )}
      </li>
    </div>
  );

  return [enhancementList, true];
};

export default PhaseEnhancements;
