import React from "react";

import PrintSettings from "@/types/PrintSettings";
import type { AbilityView } from "@/data/dataset";
import { isCoreAbility } from "@/data/rosterSelectors";

/**
 * Render a unit's phase abilities for print. Display text is the ability's
 * DSL-derived description (the dataset carries no rules prose); Core abilities
 * collapse to "See Core Rules" when truncation is enabled — mirroring the
 * card-tree PhaseAbilities component.
 */
const AbilitySection = (
  abilities: AbilityView[],
  settings: PrintSettings,
) => {
  const description = (ability: AbilityView) => {
    if (isCoreAbility(ability) && settings.truncateCoreAbilities) {
      return "See Core Rules";
    }
    return ability.describe();
  };

  return abilities.map((ability, index) => (
    <div key={index} className="mx-1 inline-block text-sm">
      • <span className="font-bold">{ability.name}: </span>
      <span className="whitespace-pre-line">{description(ability)}</span>
    </div>
  ));
};

export default AbilitySection;
