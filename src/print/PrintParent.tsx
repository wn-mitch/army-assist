import React from "react";

import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";
import PrintSettings from "@/types/PrintSettings";
import PhaseOption from "@/types/PhaseOption";

import PhaseStratagemSection from "./PhaseStratagemSection";
import PregameSection from "./PregameSection";
import CommandSection from "./CommandSection";
import ShootingSection from "./ShootingSection";
import MovementSection from "./MovementSection";
import SavesSection from "./SavesSection";
import ChargeSection from "./ChargeSection";
import FightSection from "./FightSection";
import CollectiveStratagemSection from "./CollectiveStratagemSection";
import ArmyDetachmentRuleSection from "./ArmyDetachmentRuleSection";

import useStore from "@/store/store";
import { qrCode } from "@/utils/ListHelper";

const PrintParent = (
  text: string,
  processedUnits: ListUnit[],
  settings: PrintSettings
) => {
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

  const qr = qrCode(text);

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
          (settings.contentOptionSetting.Stratagems ||
            settings.contentOptionSetting.ArmyAbilities) &&
          settings.phaseOptionSetting === PhaseOption.Split)) && (
        <>
          {phaseSection(Phase.Pregame, PregameSection, settings)}
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

      {settings.contentOptionSetting.QR && (
        <div className="break-inside-avoid flex justify-center items-center">
          <div className="max-w-[200mm] max-h-[200mm] w-full h-full">{qr}</div>
        </div>
      )}
    </div>
  );
};

export default PrintParent;
