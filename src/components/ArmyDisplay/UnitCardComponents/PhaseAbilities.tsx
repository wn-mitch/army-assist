import React from "react";

import Phase from "@/types/Phase";
import type { UnitView, AbilityView } from "@/data/dataset";
import useStore from "@/store/store";
import {
  abilitiesForPhase,
  describeAbilityView,
  isCoreAbility,
} from "@/data/rosterSelectors";

const PhaseAbilities: React.FC<{
  view: UnitView | undefined;
  phase: Phase;
}> = ({ view, phase }) => {
  const phaseAbilities = abilitiesForPhase(view, phase);

  const truncateCoreAbilities = useStore(
    (state) => state.settings.truncateCoreRules,
  );

  // Display text is the GW raw text where vendored, else the DSL describer.
  const description = (ability: AbilityView) => {
    if (isCoreAbility(ability) && truncateCoreAbilities) {
      return "See Core Rules";
    }
    return describeAbilityView(ability);
  };

  // NOTE: the legacy card showed a "Damaged: N W Remaining" prose block in the
  // Shooting/Saves/Fight phases. The 40kdc DSL does not yet model degrading
  // profiles as displayable prose, so that block is intentionally dropped here.
  // It returns once the DSL models degrading profiles.

  const abilitiesList = (
    <div className="ml-1">
      {phaseAbilities.map((ability, index) => (
        <li
          key={index}
          className={`flex flex-col break-inside-avoid first:mt-0`}
        >
          <div className="text-md font-semibold text-text">
            {ability.name}
          </div>
          <div className="font-normal text-sm text-text whitespace-pre-line">
            {description(ability)}
          </div>
        </li>
      ))}
    </div>
  );

  return [abilitiesList, phaseAbilities.length > 0];
};

export default PhaseAbilities;
