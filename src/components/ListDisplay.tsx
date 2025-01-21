import React from "react";
import useStore from "@/store/store";
import ListUnitCard from "./CardComponents/ListUnitCard";
import FilterPanel from "./FilterPanel";
import ArmyRuleDisplay from "./ArmyRuleDisplay";
import StratagemPanel from "./StratagemPanel";
import SortOptions from "@/types/SortOptions";
import ListUnit from "@/types/ListUnit";

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
      <FilterPanel />
      <ArmyRuleDisplay />
      <ul
        role="list"
        className="columns-1 xl:columns-3 lg:columns-2 md:columns-1 gap-2 auto-rows-min"
      >
        {sortedUnits.map((unit) => (
          <ListUnitCard key={unit.id} unit={unit} />
        ))}
      </ul>
      <StratagemPanel />
    </div>
  );
}

export default ListDisplay;
