import React from "react";

import Phase from "@/types/Phase";
import PrintSettings from "@/types/PrintSettings";
import PhaseOption from "@/types/PhaseOption";

import PhaseStratagemSection from "./PhaseStratagemSection";
import PregameSection, { type PrintRow } from "./PregameSection";
import CommandSection from "./CommandSection";
import ShootingSection from "./ShootingSection";
import MovementSection from "./MovementSection";
import SavesSection from "./SavesSection";
import ChargeSection from "./ChargeSection";
import FightSection from "./FightSection";
import CollectiveStratagemSection from "./CollectiveStratagemSection";
import ArmyDetachmentRuleSection from "./ArmyDetachmentRuleSection";

import useStore from "@/store/store";
import {
  displayCards,
  attachedUnitIndices,
  allStratagems,
  type RosterUnitRow,
} from "@/data/rosterSelectors";
import { toGamePhase } from "@/data/phaseMap";
import { qrCode } from "@/utils/ListHelper";

type ContentFunction = (
  rows: PrintRow[],
  settings: PrintSettings,
) => React.JSX.Element[];

const PrintParent = (
  text: string,
  rows: RosterUnitRow[],
  settings: PrintSettings,
) => {
  const marginTop = "5mm";
  const marginRight = "5mm";
  const marginBottom = "5mm";
  const marginLeft = "5mm";

  const getPageMargins = () => {
    return `@page { margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft} !important; }`;
  };

  const getActiveRoster = useStore((state) => state.getActiveRoster);
  const getArmyAbilities = useStore((state) => state.getRosterArmyAbilities);
  const listSort = useStore((state) => state.settings.listSort);
  const cardsGroup = useStore((state) => state.settings.cardsGroup);

  const roster = getActiveRoster()?.roster ?? null;

  // Stratagems: core filtering maps to `category === "core"`.
  const stratagems = settings.filterCoreStratagems
    ? allStratagems(roster).filter((s) => s.category !== "core")
    : allStratagems(roster);

  const armyAbilities = getArmyAbilities();

  const qr = qrCode(text);

  // Top-level cards (leaders + standalone), grouped/sorted per the UI settings.
  const cards = displayCards(rows, listSort, cardsGroup);

  // Render a top-level card and its attached units (nested) for a phase.
  const renderUnitForPhase = (
    card: { row: RosterUnitRow; groupCount: number },
    phase: Phase,
    settings: PrintSettings,
    contentFunction: ContentFunction,
  ) => {
    const leaderContent = contentFunction(
      [{ row: card.row, groupCount: card.groupCount }],
      settings,
    );

    const attachedRows = attachedUnitIndices(rows, card.row.index)
      .map((i) => rows[i])
      .filter((r): r is RosterUnitRow => r !== undefined);

    if (attachedRows.length === 0) {
      return leaderContent;
    }

    const attachedContent = attachedRows.flatMap((attachedRow) =>
      contentFunction([{ row: attachedRow, groupCount: 1 }], settings),
    );

    return leaderContent.map((element, index) => {
      if (index === 0 && attachedContent.length > 0) {
        return (
          <div
            key={`leader-${card.row.index}-${phase}`}
            className="leader-unit-group my-1"
          >
            {element}
            <div className="ml-4 border-l-2 border-gray-400 pl-2">
              {attachedContent}
            </div>
          </div>
        );
      }
      return element;
    });
  };

  const columnClass =
    settings.columnCount === 1
      ? "columns-1"
      : settings.columnCount === 2
        ? "columns-2"
        : "columns-3";

  const phaseSection = (
    phase: Phase,
    contentFunction: ContentFunction,
    settings: PrintSettings,
  ) => {
    const gamePhase = toGamePhase(phase);
    const phaseStratagems = gamePhase
      ? stratagems.filter((s) => s.phases.includes(gamePhase))
      : [];

    return (
      <div className="break-after-page">
        <h1 className="text-xl font-bold text-black text-center">
          {phase}
        </h1>
        {settings.contentOptionSetting.Units && (
          <div className={`${columnClass} gap-1 auto-cols-min px-1`}>
            {cards.flatMap((card) =>
              renderUnitForPhase(card, phase, settings, contentFunction),
            )}
          </div>
        )}
        {settings.contentOptionSetting.Stratagems &&
          settings.phaseOptionSetting === PhaseOption.Split && (
            <div className="break-inside-avoid py-1">
              {PhaseStratagemSection(phaseStratagems, columnClass)}
            </div>
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

      {settings.contentOptionSetting.Stratagems &&
        settings.phaseOptionSetting === PhaseOption.Compact && (
          <div className="break-inside-avoid">
            {CollectiveStratagemSection(stratagems, columnClass)}
          </div>
        )}

      {settings.contentOptionSetting.ArmyAbilities && (
        <div className="break-inside-avoid">
          {ArmyDetachmentRuleSection(armyAbilities, columnClass)}
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
