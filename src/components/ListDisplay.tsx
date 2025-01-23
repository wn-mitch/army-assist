import React from "react";
import useStore from "@/store/store";
import ListUnitCard from "./CardComponents/ListUnitCard";
import ArmyRuleDisplay from "./ArmyRuleDisplay";
import StratagemPanel from "./StratagemPanel";
import SortOptions from "@/types/SortOptions";
import ListUnit from "@/types/ListUnit";
import ScrollToTopButton from "./ScrollToTopButton";
import PhaseFilter from "./PhaseFilter";

function ListDisplay() {
  const units = useStore((state) => state.units);
  const listSort = useStore((state) => state.listSort);

  const sortByListSort = (a: ListUnit, b: ListUnit) => {
    switch (listSort) {
      case SortOptions.Name:
        return a.name.localeCompare(b.name);
      case SortOptions.PasteOrder:
        return -1;
    }
  };

  const sortedUnits = units.toSorted(sortByListSort);

  return (
    <div className="flex flex-col gap-2 w-full">
      <PhaseFilter />
      <ArmyRuleDisplay />
      <ul
        role="list"
        className="columns-1 lg:columns-2 gap-1 auto-rows-min"
      >
        {sortedUnits.map((unit) => (
          <ListUnitCard key={unit.id} unit={unit} />
        ))}
      </ul>
      <StratagemPanel />
      <ScrollToTopButton />
    </div>
  );
}

export default ListDisplay;
