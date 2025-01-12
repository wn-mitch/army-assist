import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";
import Side from "@/types/Side";
import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

import factions from "@/assets/json/Factions.json";
import Faction from "@/types/Faction";

interface StoreState {
  text: string;
  units: ListUnit[];
  round: number;
  turn: Side;
  phase: Phase;
  faction: Faction[];
  activePhases: {
    [Phase.Command]: boolean;
    [Phase.Movement]: boolean;
    [Phase.Shooting]: boolean;
    [Phase.Charge]: boolean;
    [Phase.Fight]: boolean;
    [Phase.Saves]: boolean;
  };
  isFirstVisit: boolean;
  reset: () => void;
  setText: (text: string) => void;
  parseText: (text: string) => boolean;
  setPhase: (phase: Phase) => void;
  toggleUnit: (unit: ListUnit) => void;
  togglePhase: (phase: Phase) => void;
  setFirstVisit: (isFirstVisit: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
  text: "",
  units: [],
  round: 1,
  turn: Side.Me,
  phase: Phase.Command,
  activePhases: {
    [Phase.Command]: true,
    [Phase.Movement]: true,
    [Phase.Shooting]: true,
    [Phase.Charge]: true,
    [Phase.Fight]: true,
    [Phase.Saves]: true,
  },
  faction: [],
  isFirstVisit: true,
  reset: () =>
    set({
      text: "",
      units: [],
      round: 1,
      faction: [],
      turn: Side.Me,
      phase: Phase.Command,
    }),
  setText: (text: string) => set({ text }),
  parseText: (text: string): boolean => {
    const lines = text.split("\n");

    const factionMatch = lines[0].trim().match(/[\w]+ - ([\w'\s]+) -/);

    if (!factionMatch || !factionMatch[1]) {
      console.error("Faction not found in the list");
      return false;
    }

    const factionAbbreviations = factions
      .filter((f) => f.name === factionMatch[1])
      .map((f) => f);

    if (factionAbbreviations.length === 0) {
      console.error("Faction abbreviation not found in the list");
      return false;
    }

    set({ faction: factionAbbreviations });

    const listUnits: ListUnit[] = [];
    let lastParentUnit: ListUnit | null = null;

    lines.forEach((line, index) => {
      const parentMatch = line.match(
        /^([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]]+)\s\[\d+pts\]:\s?([\d()A-Za-zÀ-ÖØ-öø-ÿ\s,’'-]+)?$/
      );
      const childMatch = line.match(
        /•\s(\d+)x\s([A-Za-zÀ-ÖØ-öø-ÿ\s\-’'/&()]+)([\s[\]\d\w]+)?:\s([()A-Za-zÀ-ÖØ-öø-ÿ\s,'&\d-]+)/
      );

      if (parentMatch) {
        // eslint-disable-next-line prefer-const
        let [, name, details] = parentMatch;
        name = name.replace(" [Legends]", "");
        if (name) {
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
        }
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
  togglePhase: (phase: Phase) => {
    set((state) => ({
      activePhases: {
        ...state.activePhases,
        [phase]: !state.activePhases[phase],
      },
    }));
  },
  setFirstVisit: (isFirstVisit: boolean) => set({ isFirstVisit }),
}));

export default useStore;
