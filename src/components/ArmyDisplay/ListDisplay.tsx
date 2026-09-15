import React, { useMemo, useState } from "react";
import useStore from "@/store/store";
import ArmyRuleDisplay from "../ArmyDisplay/ArmyRuleDisplay";
import StratagemPanel from "../ArmyDisplay/StratagemPanel";
import ScrollToTopButton from "../ScrollToTopButton";
import PhaseFilter from "../ArmyDisplay/PhaseFilter";
import ListUnitCard from "../ArmyDisplay/UnitCardComponents/ListUnitCard";
import AttachmentModal from "../ArmyDisplay/UnitCardComponents/AttachmentModal";
import {
  displayCards,
  effectiveAttachments,
  rosterUnitRows,
} from "@/data/rosterSelectors";

function ListDisplay() {
  // Select the stable stored roster; derive rows via useMemo so the selector
  // doesn't return a fresh array each render (which would loop Zustand).
  const stored = useStore((state) => state.storedRosters[state.activeList]);
  const sortSetting = useStore((state) => state.settings.listSort);
  const groupedSetting = useStore((state) => state.settings.cardsGroup);

  const [attachmentManagerIndex, setAttachmentManagerIndex] = useState<
    number | null
  >(null);
  const rows = useMemo(() => (stored ? rosterUnitRows(stored) : []), [stored]);
  const attachments = useMemo(() => effectiveAttachments(rows), [rows]);
  const cards = useMemo(
    () => displayCards(rows, sortSetting, groupedSetting, attachments),
    [rows, sortSetting, groupedSetting, attachments],
  );
  const attachmentManagerRow =
    attachmentManagerIndex === null
      ? undefined
      : rows.find((row) => row.index === attachmentManagerIndex);

  return (
    <div className="flex flex-col gap-2 w-full">
      <PhaseFilter />
      <ArmyRuleDisplay />
      <ul
        role="list"
        className="columns-1 lg:columns-2 2xl:columns-3 gap-1 auto-rows-min"
      >
        {cards.map((card) => (
          <ListUnitCard
            key={card.row.index}
            row={card.row}
            groupCount={card.groupCount}
            onManageAttachments={setAttachmentManagerIndex}
          />
        ))}
      </ul>
      {attachmentManagerRow && (
        <AttachmentModal
          visible
          onClose={() => setAttachmentManagerIndex(null)}
          row={attachmentManagerRow}
          rows={rows}
          onManageAttachments={setAttachmentManagerIndex}
        />
      )}
      <StratagemPanel />
      <ScrollToTopButton />
    </div>
  );
}

export default ListDisplay;
