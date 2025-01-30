import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

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
  faction: undefined,
  detachment: undefined,
  isFirstVisit: true,
  listSort: SortOptions.Name,
  cardsCollapse: true,
  showKeywords: true,
  isDarkMode: true,
  reset: () =>
    set({
      text: "",
      units: [],
      round: 1,
      faction: undefined,
      detachment: undefined,
      turn: Side.Me,
      phase: Phase.Command,
    }),
  setText: (text: string) => set({ text }),
  parseText: (text: string): boolean => {
    const lines = text.split("\n");

    const factionMatch = lines[0].trim().match(/[\w]+ - ([\w'\s]+) -/);
    const factionMatchName = lines[0].trim().match(/[\w\-\s]*[\w]+ - ([\w'\s]+) - /);

    if(!factionMatch || !factionMatchName) {
      window.alert("Name/Faction/Detachment format not recognized")
      return false;
    }
    
    const factionAbbreviation = Factions.filter(
      (f) => f.name === factionMatch[1] || f.name === factionMatchName[1]
    )[0].id;

    if (!factionAbbreviation) {
      console.error("Faction abbreviation not found in the list");
      return false;
    }

    set({ faction: factionAbbreviation });

    const listUnits: ListUnit[] = [];
    let lastParentUnit: ListUnit | null = null;

    lines.forEach((line, index) => {
      const detachmentMatch = line.match(/Detachment[\sChoice]*: ([\w\s]+)/);

      if (detachmentMatch) {
        set({ detachment: detachmentMatch[1] });
      }

      const parentMatch = line.match(
        /^([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]']+)\s\[\d+pts\]:\s?([\d()A-Za-zÀ-ÖØ-öø-ÿ\s\/,&’'-]+)?$/
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
      const updatedUnits = listUnits.map((unit) => {
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
              (item) => item.faction_id === factionAbbreviation
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
        ).map((ability) => {
          switch (ability.ability_id) {
            case "000008344":
              return {
                ...ability,
                name: `Scout ${ability.parameter}`,
                description: `At the start of the first battle round, before the first turn begins, you can move this unit up to ${ability.parameter} as if it were the Movement phase.`,
              };
            case "000008334":
              return {
                ...ability,
                name: `Firing Deck`,
                description:
                  'During deployment, if every model in a unit has this ability, then when you set it up, it can be set up anywhere on the battlefield that is more than 9" horizontally away from the enemy deployment zone and all enemy models.',
              };
            case "000008345":
              return {
                ...ability,
                name: `Infiltrators`,
                description:
                  'During deployment, if every model in a unit has this ability, then when you set it up, it can be set up anywhere on the battlefield that is more than 9" horizontally away from the enemy deployment zone and all enemy models.',
              };
            case "000008339":
              return {
                ...ability,
                name: `Deadly Demise ${ability.parameter}`,
                description:
                  "Some models have \u2018Deadly Demise x' listed in their abilities. When such a model is destroyed, roll one D6 before removing it from play (if such a model is a TRANSPORT, roll before any embarked models disembark). On a 6, each unit within 6\" of that model suffers a number of mortal wounds denoted by \u2018x' (if this is a random number, roll separately for each unit within 6\").",
              };
            case "000008340":
              return {
                ...ability,
                name: `Fights First`,
                description:
                  "Units with this ability that are eligible to fight do so in the Fights First step, provided every model in the unit has this ability.",
              };
            case "000008336":
              return {
                ...ability,
                name: "Lone Operative",
                description:
                  'Unless part of an Attached unit (see Leader), this unit can only be selected as the target of a ranged attack if the attacking model is within 12".',
              };
            case "000008342":
              return {
                ...ability,
                name: "Hover",
                description:
                  "Some AIRCRAFT models have \u2018Hover' listed in their abilities. When you are instructed to Declare Battle Formations, before doing anything else, you must first declare which models from your army with this ability will be in Hover mode. If a model is in Hover mode, then until the end of the battle, its Move characteristic is changed to 20\", it loses the AIRCRAFT keyword and it loses all associated rules for being an AIRCRAFT model. Models in Hover mode do not start the battle in Reserves, but you can choose to place them into Strategic Reserves following the normal rules if you wish",
              };
            case "000008343":
              return {
                ...ability,
                name: "Deep Strike",
                description:
                  'During the Declare Battle Formations step, if every model in a unit has this ability, you can set it up in Reserves instead of setting it up on the battlefield. If you do, in the Reinforcements step of one of your Movement phases you can set up this unit anywhere on the battlefield that is more than 9" horizontally away from all enemy models. If a unit with the Deep Strike ability arrives from Strategic Reserves, the controlling player can choose for that unit to be set up either using the rules for Strategic Reserves or using the Deep Strike ability. Unit can be set up in Reserves instead of on the battlefield.Unit can be set up in your Reinforcements step, more than 9" horizontally away from all enemy models.',
              };
            case "000008337":
              return {
                ...ability,
                name: "Stealth",
                description:
                  "If every model in a unit has this ability, then each time a ranged attack is made against it, subtract 1 from that attack's Hit roll.",
              };
            default:
              if (ability.name === "") {
                return {
                  ...ability,
                  name: `Unknown Ability ${ability.ability_id}`,
                  description:
                    "No description provided, please contact the dev for a fix",
                };
              } else {
                return ability;
              }
          }
        });

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
            const cleanedName = name.replace(/\s*\((.*?)\)\s*/g, ", $1").trim();
            return cleanedName.split(",").map((part) => part.trim());
          });

        if (datasheet.id === "000000613") {
          weapons = weapons
            ? [...weapons, "Wraithbone fists"]
            : ["Wraithbone fists"];
        }

        if (datasheet.id === "000002565") {
          weapons = weapons
            ? [...weapons, "Armoured limbs"]
            : ["Armoured limbs"];
        }
        
        if (datasheet.id === "000002565") {
          weapons = weapons
            ? [...weapons, "Psychic Shock Wave"]
            : ["Psychic Shock Wave"];
        }

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
          (enhancement: Enhancement) => weapons?.includes(enhancement.name)
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
      });

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
}));

export default useStore;
