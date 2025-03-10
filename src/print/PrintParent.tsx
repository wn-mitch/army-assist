import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";
import React from "react";
import PhaseStratagemSection from "./PhaseStratagemSection";
import CommandSection from "./CommandSection";
import ShootingSection from "./ShootingSection";
import MovementSection from "./MovementSection";
import SavesSection from "./SavesSection";
import ChargeSection from "./ChargeSection";
import FightSection from "./FightSection";
import PrintSettings from "@/types/PrintSettings";
import PhaseOption from "@/types/PhaseOption";
import CollectiveStratagemSection from "./CollectiveStratagemSection";
import useStore from "@/store/store";
import ArmyDetachmentRuleSection from "./ArmyDetachmentRuleSection";

const PrintParent = (processedUnits: ListUnit[], settings: PrintSettings) => {
  const marginTop = "5mm";
  const marginRight = "5mm";
  const marginBottom = "5mm";
  const marginLeft = "5mm";

  const getPageMargins = () => {
    return `@page { margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft} !important; }`;
  };

  const getStratagems = useStore((state) => state.getStratagems);
  const stratagems = getStratagems();

  const filteredStratagems = settings.filterCoreStratagems
    ? stratagems.filter((stratagem) => stratagem.faction_id !== "")
    : stratagems;

  const getArmyAbilities = useStore((state) => state.getArmyAbilities);
  const armyAbilities = getArmyAbilities();

  const phaseSection = (
    phase: Phase,
    contentFunction: (
      units: ListUnit[],
      settings: PrintSettings
    ) => React.JSX.Element[],
    settings: PrintSettings
  ) => {
    return (
      <div className="break-after-page">
        <h1 className="text-xl font-bold dark:text-gray-200 text-center">
          {phase}
        </h1>
        {settings.contentOptionSetting.Units && (
          <>
            <div className="columns-3 gap-1 auto-cols-min px-1">
              {contentFunction(processedUnits, settings)}
            </div>
          </>
        )}
        {settings.contentOptionSetting.Stratagems && (
          <>
            {settings.phaseOptionSetting === PhaseOption.Split && (
              <>
                <div className="break-inside-avoid py-1">
                  {PhaseStratagemSection(
                    filteredStratagems.filter((stratagem) =>
                      stratagem.phases.includes(phase)
                    )
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="print-container">
      <style>{getPageMargins()}</style>

      {(settings.contentOptionSetting.Units ||
        (!settings.contentOptionSetting.Units &&
          settings.phaseOptionSetting === PhaseOption.Split)) && (
        <>
          {phaseSection(Phase.Command, CommandSection, settings)}
          {phaseSection(Phase.Movement, MovementSection, settings)}
          {phaseSection(Phase.Shooting, ShootingSection, settings)}
          {phaseSection(Phase.Charge, ChargeSection, settings)}
          {phaseSection(Phase.Fight, FightSection, settings)}
          {phaseSection(Phase.Saves, SavesSection, settings)}
        </>
      )}

      {settings.contentOptionSetting.Stratagems && (
        <>
          {settings.phaseOptionSetting === PhaseOption.Compact && (
            <div className="break-inside-avoid">
              {CollectiveStratagemSection(filteredStratagems)}
            </div>
          )}
        </>
      )}

      {settings.contentOptionSetting.ArmyAbilities && (
        <div className="break-inside-avoid">
          {ArmyDetachmentRuleSection(armyAbilities)}
        </div>
      )}
    </div>
  );
};

export default PrintParent;
