import React from "react";

import type { RosterUnit } from "@/data/dataset";
import { unitEnhancement, describeEnhancement } from "@/data/rosterSelectors";

/**
 * Render a roster unit's enhancement for print. The package Enhancement record
 * carries no per-phase scoping, so (like the card-tree PhaseEnhancements
 * component) it is shown in every phase whenever the unit has one. Description
 * text is the linked ability's DSL description; points come from the record.
 */
const EnhancementSection = (rosterUnit: RosterUnit) => {
  const enhancement = unitEnhancement(rosterUnit);
  if (!enhancement) return null;

  const description = describeEnhancement(enhancement);

  return (
    <div className="mx-1 inline-block text-sm">
      •{" "}
      <span className="font-bold">
        {enhancement.name}
        {typeof enhancement.cost === "number"
          ? ` (${enhancement.cost} pts)`
          : ""}
        :{" "}
      </span>
      <span className="whitespace-pre-line">{description}</span>
    </div>
  );
};

export default EnhancementSection;
