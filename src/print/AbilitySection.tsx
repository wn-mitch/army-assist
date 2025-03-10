import Ability from "@/types/Ability";
import PrintSettings from "@/types/PrintSettings";
import React from "react";

const AbilitySection = (abilities: Ability[], settings: PrintSettings) =>
{
  return abilities.map((ability: Ability) => (
    <div className="mx-1 inline-block text-sm">
      • <span className="font-bold">{ability.name}: </span>
      <span>{ability.type === "Core" && settings.truncateCoreAbilities ? ability.description : "See Core Rules"}</span>
    </div>
  ))
  
}

export default AbilitySection;
