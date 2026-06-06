import React from "react";

import type { UnitView } from "@/data/dataset";

/**
 * Pregame screen body. Deployment-relevant abilities are surfaced separately
 * by PhaseAbilities; the card body just prompts for the deploy decision.
 */
const PregamePhase = ({
  view,
}: {
  view: UnitView | undefined;
}): [React.ReactNode, boolean] => {
  if (!view) {
    return [<></>, false];
  }
  return [
    <div className="text-center text-xl font-semibold items-center justify-center align-middle flex flex-col h-full text-text">
      Deployed?
    </div>,
    true,
  ];
};

export default PregamePhase;
