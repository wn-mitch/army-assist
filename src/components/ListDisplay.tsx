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
  const cardsGroup = useStore((state)=> state.cardsGroup)

  const sortByListSort = (a: ListUnit, b: ListUnit) => {
    switch (listSort) {
      case SortOptions.Name:
        return a.name.localeCompare(b.name);
      case SortOptions.PasteOrder:
        return -1;
    }
  };



  const groupedUnits = cardsGroup
    ? units.reduce((acc: ListUnit[], curr:ListUnit) => {
        const index = acc.findIndex((item) => item.name === curr.name);
        if (index !== -1) {
          acc[index].count = (acc[index].count || 1) + 1;
        } else {
          acc.push({ ...curr, count: 1 });
        }
        return acc;
      }, [])
    : units;

  const sortedUnits = groupedUnits.toSorted(sortByListSort);

  return (
    <div className="flex flex-col gap-2 w-full">
      <PhaseFilter />
      <ArmyRuleDisplay />
      <ul
        role="list"
        className="columns-1 lg:columns-2 2xl:columns-3 gap-1 auto-rows-min"
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
