import React from "react";
import useStore from "@/store/store";
import ListUnitCard from "./CardComponents/ListUnitCard";
import ArmyRuleDisplay from "./ArmyRuleDisplay";
import StratagemPanel from "./StratagemPanel";
import ScrollToTopButton from "./ScrollToTopButton";
import PhaseFilter from "./PhaseFilter";

function ListDisplay() {
  const getProcessedUnits = useStore((state) => state.getProcessedUnitList);
  const processedUnits = getProcessedUnits();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sortSetting = useStore((state) => state.listSort);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupedSetting = useStore((state) => state.cardsGroup);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const units = useStore((state) => state.units);

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
