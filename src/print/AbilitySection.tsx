import Ability from "@/types/Ability";
import PrintSettings from "@/types/PrintSettings";
import React from "react";

const AbilitySection = (abilities: Ability[], settings: PrintSettings) => {
  const description = (ability: Ability) => {
    if (ability.type === "Core") {
      if (settings.truncateCoreAbilities) {
        return "See Core Rules";
      } else {
        return ability.description;
      }
    } else {
      return ability.description;
    }
  };

  return abilities.map((ability: Ability) => (
    <div className="mx-1 inline-block text-sm">
      • <span className="font-bold">{ability.name}: </span>
      <span>{description(ability)}</span>
    </div>
  ));
};

export default AbilitySection;
