import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";
import Side from "@/types/Side";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import factions from "@/assets/json/Factions.json";
import Faction from "@/types/Faction";

interface StoreState {
  text: string;
  units: ListUnit[];
  round: number;
  turn: Side;
  phase: Phase;
  faction: string | null;
  reset: () => void;
  setText: (text: string) => void;
  parseText: (text: string) => boolean;
  setPhase: (phase: Phase) => void;
  toggleUnit: (unit: ListUnit) => void;
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      text: "",
      units: [],
      round: 1,
      turn: Side.Me,
      phase: Phase.Command,
      faction: null,
      reset: () =>
        set({
          text: "",
          units: [],
          round: 1,
          turn: Side.Me,
          phase: Phase.Command,
        }),
      setText: (text: string) => set({ text }),
      parseText: (text: string):boolean => {
        const lines = text.split("\n");

        const faction = lines[0].trim().match(/[\w]+ - ([\w'\s]+) -/);

        if (!faction || !faction[1]) {
          console.error("Faction not found in the list");
          return false;
        }

        const factionAbbreviation = factions?.find(
          (f) => f.name === faction[1]
        )?.id;
        set({ faction: factionAbbreviation });

        const listUnits: ListUnit[] = [];
        let lastParentUnit: ListUnit | null = null;

        lines.forEach((line, index) => {
          const parentMatch = line.match(
            /^([\w\s-]+)\s\[\d+pts\]:\s?([\w\s,’'-]+)?$/
          );
          const childMatch = line.match(
            /•\s(\d+)x\s([\w\s\-’'/&]+)([\s[\]\d\w]+)?:\s([()\w\s,'&-]+)$/
          );

          if (parentMatch) {
            const [, name, details] = parentMatch;
            lastParentUnit = {
              id: index,
              name,
              details: details,
              children: [],
              toggled: true,
              count: null,
              points: null,
            };

            listUnits.push(lastParentUnit);
          } else if (childMatch) {
            const [, count, name, , details] = childMatch;
            const unit: ListUnit = {
              id: index,
              name,
              details: details || "",
              toggled: true,
              count: parseInt(count),
              points: null,
            };

            if (lastParentUnit && lastParentUnit.children) {
              lastParentUnit.children.push(unit);
            }
          }
        });

        set({ units: listUnits });

        return listUnits.length > 0;
      },
      setPhase: (phase: Phase) => {
        // Toggle all units to true when changing phase
        const units = useStore.getState().units.map((u) => ({
          ...u,
          toggled: true,
        }));

        set({ phase, units });
      },
      toggleUnit: (unit: ListUnit) => {
        const units = [...useStore.getState().units];
        const index = units.findIndex((u) => u.id === unit.id);

        if (index !== -1) {
          units[index] = { ...units[index], toggled: !units[index].toggled };
          set({ units });
        }
      },
    }),
    {
      name: "store", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default useStore;
