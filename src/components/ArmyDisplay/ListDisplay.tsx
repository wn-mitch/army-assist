import React from "react";
import useStore from "@/store/store";
import ArmyRuleDisplay from "../ArmyDisplay/ArmyRuleDisplay";
import StratagemPanel from "../ArmyDisplay/StratagemPanel";
import ScrollToTopButton from "../ScrollToTopButton";
import PhaseFilter from "../ArmyDisplay/PhaseFilter";
import ListUnitCard from "../ArmyDisplay/UnitCardComponents/ListUnitCard";

function ListDisplay() {
  const getProcessedUnits = useStore((state) => state.getProcessedUnitList);
  const processedUnits = getProcessedUnits();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sortSetting = useStore((state) => state.settings.listSort);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupedSetting = useStore((state) => state.settings.cardsGroup);

  return (
    <div className="flex flex-col gap-2 w-full">
      <PhaseFilter />
      <ArmyRuleDisplay />
      <ul
        role="list"
        className="columns-1 lg:columns-2 2xl:columns-3 gap-1 auto-rows-min"
      >
        {processedUnits.map((unit) => (
          <ListUnitCard key={unit.id} unit={unit} />
        ))}
      </ul>
      <StratagemPanel />
      <ScrollToTopButton />
    </div>
  );
}

export default ListDisplay;
