import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import Datasheets from "@/assets/json/Datasheets.json";
import DatasheetModels from "@/assets/json/Datasheets_models.json";
import DatasheetAbilities from "@/assets/json/Datasheets_abilities_modified.json";
import Factions from "@/assets/json/Factions.json";
import DatasheetKeywords from "@/assets/json/Datasheets_keywords.json";
import Enhancements from "@/assets/json/Enhancements_modified.json";

import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";
import Side from "@/types/Side";
import SortOptions from "@/types/SortOptions";
import Enhancement from "@/types/Enhancement";
import DatasheetModel from "@/types/DatasheetModel";
import { getCurrentStateVersion } from "@/utils/VersionHelper";
import {
  applyAbilityOverrides,
  applyFactionOverrides,
  applyNameOverrides,
  applyWeaponOverrides,
} from "@/utils/StoreHelper";
import ResetButton from "@/components/ResetButton";

interface StoreState {
  text: string;
  units: ListUnit[];
  round: number;
  turn: Side;
  phase: Phase;
  faction: string | undefined;
  detachment: string | undefined;
  activePhases: {
    [Phase.Command]: boolean;
    [Phase.Movement]: boolean;
    [Phase.Shooting]: boolean;
    [Phase.Charge]: boolean;
    [Phase.Fight]: boolean;
    [Phase.Saves]: boolean;
  };
  isFirstVisit: boolean;
  listSort: SortOptions;
  cardsCollapse: boolean;
  showKeywords: boolean;
  isDarkMode: boolean;
  cardsGroup: boolean;
  currentSaveVersion: number;
  weaponsFilter: boolean;
  reset: () => void;
  setText: (text: string) => void;
  parseText: (text: string) => boolean;
  setPhase: (phase: Phase) => void;
  toggleUnit: (unit: ListUnit) => void;
  togglePhase: (phase: Phase) => void;
  setFirstVisit: (isFirstVisit: boolean) => void;
  setListSort: (listSort: SortOptions) => void;
  setCardsCollapse: (cardsCollapse: boolean) => void;
  setShowKeywords: (showKeywords: boolean) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setCardsGroup: (cardsGroup: boolean) => void;
  setWeaponsFilter: (weaponsFilter: boolean) => void;
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
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
      faction: undefined,
      detachment: undefined,
      isFirstVisit: true,
      listSort: SortOptions.Name,
      cardsCollapse: true,
      showKeywords: true,
      isDarkMode: true,
      cardsGroup: true,
      currentSaveVersion: getCurrentStateVersion(),
      weaponsFilter: true,
      reset: () =>
        set({
          text: "",
          units: [],
          round: 1,
          faction: undefined,
          detachment: undefined,
          turn: Side.Me,
          phase: Phase.Command,
          currentSaveVersion: getCurrentStateVersion(),
        }),
      setText: (text: string) => set({ text }),
      parseText: (text: string): boolean => {
        const lines = text.split("\n");

        const factionMatch = lines[0].trim().match(/[\w]+ - ([\w'\s]+) -/);
        const factionMatchName = lines[0]
          .trim()
          .match(/[\w\-\s]*[\w]+ - ([\w'\s]+) - /);

        if (!factionMatch || !factionMatchName) {
          window.alert("Name/Faction/Detachment format not recognized");
          return false;
        }

        const factions = applyFactionOverrides(Factions);
        const factionAbbreviation = factions.filter(
          (f) => f.name === factionMatch[1] || f.name === factionMatchName[1]
        )[0];

        if (!factionAbbreviation) {
          console.error("Faction abbreviation not found in the list");
          return false;
        }

        const factionAbbreviationId = factionAbbreviation.id;

        set({ faction: factionAbbreviationId });

        const listUnits: ListUnit[] = [];
        let lastParentUnit: ListUnit | null = null;

        lines.forEach((line, index) => {
          const detachmentMatch = line.match(
            /Detachment[\sChoice]*: ([\w\s-]+)/
          );

          if (detachmentMatch) {
            // Name overrides
            let name = detachmentMatch[1];

            switch (name) {
              case "Pact-bound Zealots":
                name = "Pactbound Zealots";
                break;
              default:
                break;
            }

            set({ detachment: name });
          }

          const parentMatch = line.match(
            /^([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]'‘’]+)\s\[\d+[\s]?pts\]:\s?([\d()A-Za-zÀ-ÖØ-öø-ÿ\s\/,&’'-]+)?$/
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
                count: 1,
                points: null,
                datasheet_id: null,
                weapons: [],
                abilities: [],
                enhancements: [],
                datasheet: null,
                datasheetModel: null,
                keywords: "",
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
              datasheet_id: null,
              children: [],
              weapons: [],
              abilities: [],
              enhancements: [],
              datasheet: null,
              datasheetModel: null,
              keywords: "",
            };

            if (lastParentUnit && lastParentUnit.children) {
              lastParentUnit.children.push(unit);
            }
          }
        });

        if (listUnits.length > 0) {
          console.log(listUnits);
          const updatedUnits = listUnits
            .map((unit) => {
              unit = applyNameOverrides(unit);

              const datasheetsMatchingName = Datasheets.filter(
                (item) => item.name.toLowerCase() === unit.name.toLowerCase()
              );

              // Create an array of all unique factions in the datasheets
              const uniqueFactions = Array.from(
                new Set(datasheetsMatchingName.map((item) => item.faction_id))
              );

              // @ts-expect-error - Line 145 has a check that should prevent this from being null
              const datasheet = uniqueFactions.includes()
                ? datasheetsMatchingName.filter(
                    (item) => item.faction_id === factionAbbreviationId
                  )[0]
                : datasheetsMatchingName[0];

              if (!datasheet) {
                window.alert(`Datasheet not found for unit ${unit.name}`);
                return null;
              }
              const datasheetModel = DatasheetModels.find(
                (datasheetModel: DatasheetModel) =>
                  datasheetModel.datasheet_id === datasheet.id
              );

              if (!datasheetModel) {
                window.alert(`Datasheet model not found for unit ${unit.name}`);
                return null;
              }

              const matchingAbilities = DatasheetAbilities.filter(
                // @ts-expect-error - Phases are strings, and the engine can't read that
                (ability: Ability) =>
                  ability.datasheet_id === datasheetModel.datasheet_id
              ).map((ability) => applyAbilityOverrides(ability));

              if (unit.children && unit.children.length > 0) {
                const details = unit.children
                  .map((child) => child.details)
                  .join(", ");
                unit.details = unit.details
                  ? [...unit.details.split(", "), details].join(", ")
                  : details;
                unit.children = [];
              }

              let weapons = unit.details
                ?.split(/,(?![^(]*\))/)
                .filter((name) => name !== "Warlord" && name !== "")
                .map((name) => name.replace(/^\d+x?\s*/, "").trim())
                .flatMap((name) => {
                  const cleanedName = name
                    .replace(/\s*\((.*?)\)\s*/g, ", $1")
                    .trim();
                  return cleanedName.split(",").map((part) => part.trim());
                });

              // Weapon Overrides
              weapons = applyWeaponOverrides(datasheet, weapons);

              weapons = weapons?.flatMap((weapon) => {
                const match = weapon.match(/(\d+)x\s+([A-Za-z\s-]+)/);
                if (match) {
                  const count = parseInt(match[1], 10);
                  const weaponName = match[2];
                  return Array(count).fill(weaponName);
                }
                return weapon;
              });

              const matchingEnhancements = Enhancements.filter(
                (enhancement: Enhancement) =>
                  weapons?.includes(enhancement.name)
              );

              const keywords = DatasheetKeywords.filter(
                (keyword) => keyword.datasheet_id === datasheet.id
              )
                .map((x) => x.keyword)
                .join(", ");

              return {
                ...unit,
                abilities: matchingAbilities,
                weapons: weapons,
                datasheet: datasheet,
                datasheetModel: datasheetModel,
                keywords: keywords,
                enhancements: matchingEnhancements,
              };
            })
            .filter((x) => x != null) as ListUnit[];

          if (!updatedUnits) {
            return false;
          }

          set({ units: updatedUnits as ListUnit[] });
        }

        return true;
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
      setListSort: (listSort: SortOptions) => set({ listSort }),
      setCardsCollapse: (cardsCollapse: boolean) => set({ cardsCollapse }),
      setShowKeywords: (showKeywords: boolean) => set({ showKeywords }),
      setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
      setCardsGroup: (cardsGroup: boolean) => set({ cardsGroup }),
      setWeaponsFilter: (weaponsFilter: boolean) => set({ weaponsFilter }),
    }),
    {
      name: "army-storage",
      storage: createJSONStorage(() => sessionStorage),
      version: getCurrentStateVersion(),
    }
  )
);

export default useStore;
