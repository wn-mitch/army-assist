import React, { useState, useMemo } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import useStore from "@/store/store";

import Phase from "@/types/Phase";

import PregamePhase from "./PhaseDisplays/PregamePhase";
import CommandPhase from "./PhaseDisplays/CommandPhase";
import MovementPhase from "./PhaseDisplays/MovementPhase";
import ShootingOrFightPhase from "./PhaseDisplays/ShootingOrFightPhase";
import ChargePhase from "./PhaseDisplays/ChargePhase";
import SavesPhase from "./PhaseDisplays/SavesPhase";
import PhaseEnhancements from "./PhaseEnhancements";
import PhaseAbilities from "./PhaseAbilities";
import NoteModal from "@/components/NoteModal";
import PhaseNotes from "./PhaseNotes";
import LeaderAttachmentModal from "./LeaderAttachmentModal";

import { dataset } from "@/data/dataset";
import {
  unitName,
  unitKeywords,
  rosterWeapons,
  visibleWeapons,
  weaponsForPhase,
  effectiveLeaderIndex,
  attachedUnitIndices,
  rosterUnitRows,
  type RosterUnitRow,
  type RosterWeapon,
} from "@/data/rosterSelectors";

/**
 * Every weapon on the resolved datasheet, paired with a count of 1, ordered by
 * name. Used when the "Filter Weapons" setting is off so the card shows the
 * unit's full datasheet armoury (matching the legacy `weaponsDatasheets`
 * behaviour) rather than only the weapons present on the imported list.
 */
function allDatasheetWeapons(row: RosterUnitRow): RosterWeapon[] {
  const view = row.view;
  if (!view) return [];
  return [...view.weapons]
    .map((weapon) => ({ weapon, count: 1 }))
    .sort((a, b) => a.weapon.name.localeCompare(b.weapon.name));
}

function ListUnitCard({
  row,
  groupCount,
  isAttachedView = false,
}: {
  row: RosterUnitRow;
  groupCount?: number;
  isAttachedView?: boolean;
}) {
  // ALL hooks must be called unconditionally at the top.
  const [leaderModalVisible, setLeaderModalVisible] = useState(false);
  const stored = useStore((state) => state.storedRosters[state.activeList]);
  const phase = stored?.phase ?? Phase.Pregame;
  // Derive rows via useMemo so we don't return a fresh array from the selector
  // (which would trigger an infinite Zustand render loop).
  const rows = useMemo(
    () => (stored ? rosterUnitRows(stored) : []),
    [stored],
  );
  const toggleRosterUnit = useStore((state) => state.toggleRosterUnit);
  const cardsCollapse = useStore((state) => state.settings.cardsCollapse);
  const cardsGroup = useStore((state) => state.settings.cardsGroup);
  const showKeywords = useStore((state) => state.settings.showKeywords);
  const weaponsFilter = useStore((state) => state.settings.weaponsFilter);
  const forceEditMode = useStore((state) => state.settings.editForceMode);

  const { rosterUnit, view, overlay } = row;
  const resolved = rosterUnit.ref.resolved;
  const candidates = rosterUnit.ref.candidates ?? [];

  // Leader-attachment eligibility from the dataset attachment graph.
  const unitId = view?.id;
  const canBeLeader =
    !!unitId && dataset.bodyguardsAttachableFrom(unitId).length > 0;
  const canBeAttached =
    !!unitId && dataset.leadersAttachableTo(unitId).length > 0;

  // Units rendered nested under this card (its effective bodyguards).
  const attachedIndices = attachedUnitIndices(rows, row.index);
  const attachedRows = attachedIndices
    .map((i) => rows[i])
    .filter((r): r is RosterUnitRow => r !== undefined);

  // Weapons for the current combat phase. With the filter on, show only the
  // weapons present on the imported list (count > 0). With it off, fall back to
  // the unit's full datasheet armoury so weapons absent from the list (e.g.
  // alternate loadouts) are still visible.
  const phasedWeapons = weaponsFilter
    ? weaponsForPhase(visibleWeapons(rosterWeapons(rosterUnit)), phase)
    : weaponsForPhase(allDatasheetWeapons(row), phase);

  let characteristic: React.ReactNode;
  let toggled = true;

  switch (phase) {
    case Phase.Pregame:
      [characteristic, toggled] = PregamePhase({ view });
      break;
    case Phase.Command:
      [characteristic, toggled] = CommandPhase({ view });
      break;
    case Phase.Movement:
      [characteristic, toggled] = MovementPhase({ view });
      break;
    case Phase.Shooting:
    case Phase.Fight:
      [characteristic, toggled] = ShootingOrFightPhase({
        weapons: phasedWeapons,
        phase,
      });
      break;
    case Phase.Charge:
      [characteristic, toggled] = ChargePhase();
      break;
    case Phase.Saves:
      [characteristic, toggled] = SavesPhase({ view });
      break;
  }

  // @ts-expect-error - phase blocks return a [node, boolean] tuple.
  const [phasedAbilities, abilitiesToggle] = PhaseAbilities({ view, phase });

  const [phasedEnhancements, enhancementsToggle] = PhaseEnhancements({
    rosterUnit,
    phase,
  });

  const [phasedNotes, notesToggle] = PhaseNotes({ overlay, phase });

  const cardToggled =
    overlay.toggled &&
    (toggled || abilitiesToggle || enhancementsToggle || notesToggle);

  const fadedClasses = cardToggled ? "" : "opacity-50";

  const groupingNumber =
    cardsGroup && groupCount ? `[${groupCount}x]` : "";

  const name = unitName(row);
  const keywords = unitKeywords(row);

  // Skip rendering if attached under a leader (shown nested with the leader).
  if (
    !isAttachedView &&
    effectiveLeaderIndex(rows, row.index) !== null
  ) {
    return <div className="hidden"></div>;
  }

  const cardClasses = isAttachedView
    ? "ml-4 p-2 border border-gray-200 dark:border-gray-700 rounded-md mb-2 bg-gray-50 dark:bg-gray-800"
    : "group mx-4 my-2 px-3 py-1 rounded-lg border col-span-1 flex flex-col break-inside-avoid first:mt-0 cursor-pointer shadow-sm bg-gray-50 dark:bg-gray-800 border-gray-50 dark:border-gray-700 focus:outline-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 dark:focus:outline-gray-800 dark:focus:outline dark:focus:outline-2 dark:focus:-outline-offset-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:border-gray-800 last:mb-20";

  return (
    <ul
      tabIndex={isAttachedView ? -1 : 0}
      className={`${cardClasses} ${fadedClasses}`}
    >
      <div className="flex flex-row">
        <div
          className={`flex flex-row font-semibold text-xl align-middle items-center flex-grow ${fadedClasses}`}
        >
          <div className="flex-row text-gray-800 dark:text-gray-400 break-inside-avoid mr-1">
            {groupingNumber}
          </div>
          <div className="flex-1 flex-row flex-grow text-black dark:text-gray-50">
            {name}
            {!resolved && (
              <span className="ml-2 align-middle text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-amber-200 text-amber-800 dark:bg-amber-600 dark:text-amber-50">
                unresolved
              </span>
            )}
            {!resolved && candidates.length > 0 && (
              <div className="text-xs font-normal text-gray-600 dark:text-gray-400">
                did you mean: {candidates.map((c) => c.name).join(", ")}
              </div>
            )}
          </div>

          {showKeywords && (
            <div className="flex-shrink font-light text-sm text-gray-600 px-2 text-right dark:text-gray-300 dark:font-normal break-words">
              {keywords}
            </div>
          )}
        </div>

        {/* Buttons only in main view, not the nested attached view. Rendered
            only in force-edit mode, where it actually has children — otherwise
            an empty container would inflate `.justify-center` element counts. */}
        {!isAttachedView && forceEditMode && (
          <div className="flex justify-center items-center gap-1 mx-1">
            {(canBeLeader || canBeAttached) && forceEditMode && (
              <button
                className="m-auto flex shadow-md rounded-xl bg-indigo-300 border-indigo-300 my-1 text-indigo-700 hover:bg-indigo-400 hover:text-indigo-200 dark:bg-indigo-500 dark:text-indigo-200 dark:hover:bg-indigo-600 dark:hover:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                onClick={(e) => {
                  e.stopPropagation();
                  setLeaderModalVisible(true);
                }}
                title={
                  canBeLeader ? "Manage attached units" : "Attach to leader"
                }
              >
                <UserGroupIcon className="h-8 w-8 p-1" />
              </button>
            )}
            {forceEditMode && <NoteModal row={row} />}
          </div>
        )}

        {cardsCollapse && !isAttachedView && (
          <div className="flex justify-center items-center">
            <button
              className="m-auto flex shadow-md rounded-xl bg-gray-300 border-gray-300 my-1 text-gray-700 hover:bg-gray-400 hover:text-gray-200 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
              id={`toggle-${name}-button`}
              onClick={() => toggleRosterUnit(row.index)}
            >
              {cardToggled ? (
                <ChevronDownIcon className="h-8 w-8" />
              ) : (
                <ChevronUpIcon className="h-8 w-8" />
              )}
            </button>
          </div>
        )}
      </div>

      {(isAttachedView || !(cardsCollapse && !cardToggled)) && (
        <div className="flex flex-col gap-1">
          <div className="">{characteristic}</div>
          <div className="">{phasedAbilities}</div>
          <div className="">{phasedEnhancements}</div>
          <div className="">{phasedNotes}</div>

          {attachedRows.length > 0 && !isAttachedView && (
            <div className="mt-2 border-t pt-2">
              <div className="font-bold mb-1 text-gray-900 dark:text-gray-100">
                Attached Units:
              </div>
              {attachedRows.map((attachedRow) => (
                <ListUnitCard
                  key={`attached-${attachedRow.index}`}
                  row={attachedRow}
                  isAttachedView={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {leaderModalVisible && (
        <LeaderAttachmentModal
          visible={leaderModalVisible}
          onClose={() => setLeaderModalVisible(false)}
          row={row}
          rows={rows}
          isLeader={canBeLeader}
        />
      )}
    </ul>
  );
}

export default ListUnitCard;
