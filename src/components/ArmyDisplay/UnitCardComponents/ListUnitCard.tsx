import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import useStore from "@/store/store";

import ListUnit from "@/types/ListUnit";
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

function ListUnitCard({
  unit,
  isAttachedView = false,
}: {
  unit: ListUnit;
  isAttachedView?: boolean;
}) {
  // ALL hooks must be called unconditionally at the top
  const [leaderModalVisible, setLeaderModalVisible] = useState(false);
  const activeList = useStore((state) => state.activeList);
  const storedLists = useStore((state) => state.storedLists);
  const phase = storedLists[activeList].phase;
  const toggleUnit = useStore((state) => state.toggleUnit);
  const cardsCollapse = useStore((state) => state.settings.cardsCollapse);
  const cardsGroup = useStore((state) => state.settings.cardsGroup);
  const showKeywords = useStore((state) => state.settings.showKeywords);
  const weaponsFilter = useStore((state) => state.settings.weaponsFilter);

  // Check if this unit can be a leader or be attached to one
  const getAttachableUnits = useStore((state) => state.getAttachableUnits);
  const getLeadersForUnit = useStore((state) => state.getLeadersForUnit);

  const possibleLeaderUnits =
    unit.datasheet &&
    unit.datasheet.id &&
    getLeadersForUnit(unit.datasheet.id.toString());
  const possibleAttachedUnits =
    unit.datasheet &&
    unit.datasheet.id &&
    getAttachableUnits(unit.datasheet.id.toString());

  const canBeAttached =
    (possibleLeaderUnits && possibleLeaderUnits.length > 0) || false;
  const canBeLeader =
    (possibleAttachedUnits && possibleAttachedUnits.length > 0) || false;

  // Get any attached units
  const attachedUnits = unit.attached_units
    ? storedLists[activeList].units.filter((u) =>
        unit.attached_units?.includes(String(u.id))
      )
    : [];

  // Calculate initial state that would be used if we're rendering normally
  let characteristic: React.ReactNode;
  let toggled = true;

  const filteredWeapons = weaponsFilter
    ? unit.weaponsDatasheets.filter((weapon) =>
        Object.keys(unit.count ?? {}).some((name: string) => {
          return (
            name &&
            weapon.name &&
            (name.toLowerCase().includes(weapon.name.toLowerCase()) ||
              weapon.name.toLowerCase().includes(name.toLowerCase()))
          );
        })
      )
    : unit.weaponsDatasheets;

  const phasedWeapons = filteredWeapons.filter((wargear) =>
    phase === "Shooting" ? wargear.type === "Ranged" : wargear.type === "Melee"
  );

  switch (phase) {
    case Phase.Pregame:
      [characteristic, toggled] = PregamePhase({ unit });
      break;
    case Phase.Command:
      [characteristic, toggled] = CommandPhase({ unit });
      break;
    case Phase.Movement:
      [characteristic, toggled] = MovementPhase({ unit });
      break;
    case Phase.Shooting:
    case Phase.Fight:
      [characteristic, toggled] = ShootingOrFightPhase({
        counts: unit.count || {},
        phasedWeapons,
        phase,
      });
      break;
    case Phase.Charge:
      [characteristic, toggled] = ChargePhase();
      break;
    case Phase.Saves:
      [characteristic, toggled] = SavesPhase({ unit });
      break;
  }

  // @ts-expect-error - This works. Not sure why flagged.
  const [phasedAbilities, abilitiesToggle] = PhaseAbilities({
    unit,
    phase,
  });

  const [phasedEnhancements, enhancementsToggle] = PhaseEnhancements({
    unit,
    phase,
  });

  const [phasedNotes, notesToggle] = PhaseNotes({
    unit,
    phase,
  });

  const cardToggled =
    unit.toggled &&
    (toggled || abilitiesToggle || enhancementsToggle || notesToggle);

  const fadedClasses = cardToggled ? "" : "opacity-50";

  const groupingNumber = cardsGroup ? `[${unit.groupCount}x]` : "";

  // Skip rendering this unit if it's attached to a leader (will be shown with the leader)
  // Instead of returning null, render an empty element to maintain hook consistency
  if (unit.attached_to_leader_id && !isAttachedView) {
    return <div className="hidden"></div>; // Empty div instead of null
  }

  // Determine styling based on whether this is a standalone card or an attached unit view
  const cardClasses = isAttachedView
    ? "ml-4 p-2 border border-gray-200 dark:border-gray-700 rounded-md mb-2 bg-gray-50 dark:bg-gray-800"
    : "group mx-4 my-2 px-3 py-1 rounded-lg border col-span-1 flex flex-col break-inside-avoid first:mt-0 cursor-pointer shadow-sm bg-gray-50 dark:bg-gray-800 border-gray-50 dark:border-gray-700 focus:outline-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 dark:focus:outline-gray-800 dark:focus:outline dark:focus:outline-2 dark:focus:-outline-offset-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:border-gray-800 last:mb-20";

  return (
    <ul
      key={unit.datasheet_id}
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
            {unit.name}
          </div>

          {showKeywords && (
            <div className="flex-shrink font-light text-sm text-gray-600 px-2 text-right dark:text-gray-300 dark:font-normal break-words">
              {unit.keywords}
            </div>
          )}
        </div>

        {/* Only show buttons in main view, not in attached view */}
        {!isAttachedView && (
          <div className="flex justify-center items-center gap-1 mx-1">
            {(canBeLeader || canBeAttached) && (
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
            <NoteModal unit={unit} />
          </div>
        )}

        {cardsCollapse && !isAttachedView && (
          <div className="flex justify-center items-center">
            <button
              className="m-auto flex shadow-md rounded-xl bg-gray-300 border-gray-300 my-1 text-gray-700 hover:bg-gray-400 hover:text-gray-200 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
              id={`toggle-${unit.name}-button`}
              onClick={() => toggleUnit(unit)}
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

      {/* Always show content for attached view or if expanded in main view */}
      {(isAttachedView || !(cardsCollapse && !cardToggled)) && (
        <div className="flex flex-col gap-1">
          <div className="">{characteristic}</div>
          <div className="">{phasedAbilities}</div>
          <div className="">{phasedEnhancements}</div>
          <div className="">{phasedNotes}</div>

          {/* Display attached units if this is a leader */}
          {attachedUnits.length > 0 && !isAttachedView && (
            <div className="mt-2 border-t pt-2">
              <div className="font-bold mb-1 text-gray-900 dark:text-gray-100">
                Attached Units:
              </div>
              {attachedUnits.map((attachedUnit) => (
                <ListUnitCard
                  key={`attached-${attachedUnit.id}`}
                  unit={attachedUnit}
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
          unit={unit}
          isLeader={canBeLeader}
        />
      )}
    </ul>
  );
}

export default ListUnitCard;
