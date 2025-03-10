import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import Datasheets from "@/assets/json/Datasheets.json";
import DatasheetModels from "@/assets/json/Datasheets_models.json";
import DatasheetAbilities from "@/assets/json/Datasheets_abilities_modified.json";
import Factions from "@/assets/json/Factions.json";
import DatasheetKeywords from "@/assets/json/Datasheets_keywords.json";
import Enhancements from "@/assets/json/Enhancements_modified.json";
import Stratagems from "@/assets/json/Stratagems_modified.json";
import DatasheetWargear from "@/assets/json/Datasheets_wargear.json";
import ArmyAbilities from "@/assets/json/Abilities_modified.json";
import DetachmentAbilities from "@/assets/json/Detachment_abilities_modified.json";

import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";
import SortOptions from "@/types/SortOptions";
import Enhancement from "@/types/Enhancement";
import { Stratagem } from "@/types/Stratagem";
import DatasheetWargearType from "@/types/DatasheetWargear";
import DatasheetModel from "@/types/DatasheetModel";

import { getCurrentStateVersion } from "@/utils/VersionHelper";
import {
  applyAbilityOverrides,
  applyFactionOverrides,
  applyMissingAbilities,
  applyMissingWeapons,
  applyNameOverrides,
  applyWeaponOverrides,
} from "@/utils/StoreHelper";
import Ability from "@/types/Ability";

interface StoreState {
  text: string;
  units: ListUnit[];
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
  weaponsFilter: boolean;

  currentSaveVersion: number;
  unmatchedWeapons: string[];
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
  setUnmatchedWeapons: (unmatchedWeapons: string[]) => void;
  getProcessedUnitList: () => ListUnit[];
  getStratagemsByPhase: (phase: Phase) => Stratagem[];
  getStratagems: () => Stratagem[];
  getWeaponDatasheets: (unit: ListUnit, phase: Phase) => DatasheetWargearType[];
  getArmyAbilities: () => Ability[];
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      text: "",
      units: [],
      phase: Phase.Command,
      faction: undefined,
      detachment: undefined,
      activePhases: {
        [Phase.Command]: true,
        [Phase.Movement]: true,
        [Phase.Shooting]: true,
        [Phase.Charge]: true,
        [Phase.Fight]: true,
        [Phase.Saves]: true,
      },
      isFirstVisit: true,
      unmatchedWeapons: [],
      currentSaveVersion: getCurrentStateVersion(),
      listSort: SortOptions.Name,
      cardsCollapse: true,
      showKeywords: true,
      isDarkMode: true,
      cardsGroup: true,
      weaponsFilter: true,
      reset: () =>
        set({
          text: "",
          units: [],
          faction: undefined,
          detachment: undefined,
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

            const weapons = details
              ?.split(/,(?![^(]*\))/)
              .filter((name) => name !== "Warlord" && name !== "")
              .map((name) => name.replace(/^\d+x?\s*/, "").trim())
              .flatMap((name) => {
                const cleanedName = name
                  .replace(/\s*\((.*?)\)\s*/g, ", $1")
                  .trim();
                return cleanedName.split(",").map((part) => part.trim());
              });

            const weaponCount = weapons?.reduce((acc, weapon) => {
              acc[weapon] = 1;
              return acc;
            }, {} as Record<string, number>);

            name = name.replace(" [Legends]", "");
            if (name) {
              lastParentUnit = {
                id: index,
                name,
                details: details,
                children: [],
                toggled: true,
                count: weaponCount,
                groupCount: 1,
                points: null,
                datasheet_id: null,
                weapons: weapons,
                weaponsDatasheets: [],
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

            const weapons = details
              ?.split(/,(?![^(]*\))/)
              .filter((name) => name !== "Warlord" && name !== "")
              .map((name) => name.replace(/^\d+x?\s*/, "").trim())
              .flatMap((name) => {
                const cleanedName = name
                  .replace(/\s*\((.*?)\)\s*/g, ", $1")
                  .trim();
                return cleanedName.split(",").map((part) => part.trim());
              });

            const weaponCount = weapons?.reduce((acc, weapon) => {
              acc[weapon] = parseInt(count);
              return acc;
            }, {} as Record<string, number>);

            const unit: ListUnit = {
              id: index,
              name,
              details: details,
              toggled: true,
              count: weaponCount,
              groupCount: 1,
              points: null,
              datasheet_id: null,
              children: [],
              weapons: weapons,
              weaponsDatasheets: [],
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

              const datasheet = uniqueFactions.includes(factionAbbreviationId)
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
                (ability: Ability) =>
                  ability.datasheet_id === datasheetModel.datasheet_id
              ).map((ability) => applyAbilityOverrides(ability));

              if (unit.children && unit.children.length > 0) {
                const details = unit.children
                  .map((unit) => ({
                    ...unit,
                    name: unit.name.replace(/^\d+x?\s*/, "").trim(),
                  }))
                  .map((child) => child.details)
                  .join(", ");
                unit.details = unit.details
                  ? [...unit.details.split(", "), details].join(", ")
                  : details;

                const count = unit.children.reduce((acc, curr) => {
                  Object.keys(curr.count ?? {}).forEach((key) => {
                    acc[key] = (acc[key] || 0) + (curr.count?.[key] || 0);
                  });
                  return acc;
                }, {} as Record<string, number>);
                unit.count = count;
                unit.children = [];
              }

              const weapons = unit.details
                ?.split(/,(?![^(]*\))/)
                .filter((name) => name !== "Warlord" && name !== "")
                .flatMap((name) => {
                  const cleanedName = name
                    .replace(/\s*\((.*?)\)\s*/g, ", $1")
                    .trim();
                  return cleanedName.split(",").map((part) => part.trim());
                });

              unit.weapons = weapons?.flatMap((weapon) => {
                const match = weapon.match(/(\d+)x\s+([A-Za-z\s-]+)/);
                if (match) {
                  const matchCount = parseInt(match[1], 10);
                  const weaponName = match[2];
                  return Array(matchCount).fill(weaponName);
                }
                return weapon;
              });

              // Weapon Overrides
              unit.weapons = applyWeaponOverrides(datasheet, unit.weapons);

              const updatedCount: Record<string, number> = {};

              Object.keys(unit.count ?? {}).forEach((key) => {
                const match = key.match(/(\d+)x\s+([A-Za-z\s-]+)/);
                if (match) {
                  const multiplier = parseInt(match[1]);
                  const weaponName = match[2];
                  updatedCount[weaponName] =
                    (updatedCount[weaponName] || 0) +
                    (unit.count?.[key] ?? 0) * multiplier;
                } else {
                  updatedCount[key] =
                    (updatedCount[key] || 0) + (unit.count?.[key] ?? 0);
                }
              });

              unit.count = updatedCount;

              unit.weapons?.forEach((weapon) => {
                if (unit.count && !unit.count[weapon]) {
                  unit.count[weapon] = 1;
                }
              });

              const weaponsDatasheets = DatasheetWargear.filter(
                (wargear) => datasheet && datasheet.id === wargear.datasheet_id
              );

              const allWeaponsDatasheets = applyMissingWeapons(
                unit,
                unit.weapons ?? [],
                weaponsDatasheets
              );

              const allAbilities = applyMissingAbilities(
                unit,
                unit.weapons ?? [],
                matchingAbilities ?? []
              );

              const matchingEnhancements = Enhancements.filter(
                (enhancement: Enhancement) =>
                  unit.weapons?.includes(enhancement.name)
              );

              const keywords = DatasheetKeywords.filter(
                (keyword) => keyword.datasheet_id === datasheet.id
              )
                .map((x) => x.keyword)
                .join(", ");

              return {
                ...unit,
                abilities: allAbilities,
                weaponsDatasheets: allWeaponsDatasheets,
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
      setUnmatchedWeapons: (unmatchedWeapons: string[]) =>
        set({ unmatchedWeapons }),
      getProcessedUnitList: () => {
        const units = get().units;
        const listSort = get().listSort;
        const cardsGroup = get().cardsGroup;

        const sortByListSort = (a: ListUnit, b: ListUnit) => {
          switch (listSort) {
            case SortOptions.Name:
              return a.name.localeCompare(b.name);
            case SortOptions.PasteOrder:
              return 1;
          }
        };

        const groupedUnits = cardsGroup
          ? units.reduce((acc: ListUnit[], curr: ListUnit) => {
              const index = acc.findIndex((item) => item.name === curr.name);
              if (index !== -1) {
                acc[index].groupCount = (acc[index].groupCount || 1) + 1;
              } else {
                acc.push({ ...curr, groupCount: 1 });
              }
              return acc;
            }, [])
          : units;

        const sortedUnits = groupedUnits.toSorted(sortByListSort);

        return sortedUnits;
      },
      getStratagemsByPhase: (phase) => {
        const stratagemNames = new Set();
        const faction = get().faction;
        const detachment = get().detachment;

        const stratagems = Stratagems.map((stratagem) => {
          const [splitDetachment, splitType] = stratagem.type.split(" - ");
          if (splitDetachment === "Core") {
            return {
              ...stratagem,
              detachment: "Core",
              type: splitType,
            };
          } else {
            return {
              ...stratagem,
              type: splitType,
            };
          }
        })
          .filter(
            (stratagem) =>
              stratagem.faction_id === faction || stratagem.faction_id === ""
          )
          .filter((stratagem) => {
            return (
              stratagem.detachment === detachment ||
              stratagem.detachment === "" ||
              stratagem.detachment === "Core"
            );
          })
          .filter((stratagem) => stratagem.phases.includes(phase))
          .filter((stratagem) => {
            if (stratagemNames.has(stratagem.name)) {
              return false;
            } else {
              stratagemNames.add(stratagem.name);
              return true;
            }
          });

        return stratagems;
      },
      getWeaponDatasheets: (unit, phase) => {
        const weaponsFilter = get().weaponsFilter;

        const availableWeaponDatasheets = DatasheetWargear.filter((wargear) =>
          phase === "Shooting"
            ? wargear.type === "Ranged"
            : wargear.type === "Melee"
        ).filter(
          (wargear) =>
            unit.datasheet && unit.datasheet.id === wargear.datasheet_id
        );

        return weaponsFilter
          ? availableWeaponDatasheets.filter((weapon) =>
              (unit.weapons ?? []).some((name) => {
                return weapon.name?.toLowerCase().includes(name.toLowerCase());
              })
            )
          : availableWeaponDatasheets;
      },
      getStratagems: () => {
        const stratagemNames = new Set();
        const faction = get().faction;
        const detachment = get().detachment;

        const stratagems = Stratagems.map((stratagem) => {
          const [splitDetachment, splitType] = stratagem.type.split(" - ");
          if (splitDetachment === "Core") {
            return {
              ...stratagem,
              detachment: "Core",
              type: splitType,
            };
          } else {
            return {
              ...stratagem,
              type: splitType,
            };
          }
        })
          .filter(
            (stratagem) =>
              stratagem.faction_id === faction || stratagem.faction_id === ""
          )
          .filter((stratagem) => {
            return (
              stratagem.detachment === detachment ||
              stratagem.detachment === "" ||
              stratagem.detachment === "Core"
            );
          })
          .filter((stratagem) => {
            if (stratagemNames.has(stratagem.name)) {
              return false;
            } else {
              stratagemNames.add(stratagem.name);
              return true;
            }
          });

        return stratagems;
      },
      getArmyAbilities: () => {
        const faction = get().faction;
        const detachment = get().detachment;

        const filteredArmyAbilities = ArmyAbilities.filter(
          (ability) => ability.faction_id === faction
        ).map((x) => ({
          ...x,
          type: "Army",
          datasheet_id: "",
          line: "",
          ability_id: "",
          model: "",
          parameter: "",
        }));

        const filteredDetachmentAbilities = DetachmentAbilities.filter(
          (ability) =>
            ability.faction_id === faction && ability.detachment === detachment
        ).map((x) => ({
          ...x,
          type: "Detachment",
          datasheet_id: "",
          line: "",
          ability_id: "",
          model: "",
          parameter: "",
        }));

        return [...filteredArmyAbilities, ...filteredDetachmentAbilities];
      },
    }),
    {
      name: "army-storage",
      storage: createJSONStorage(() => sessionStorage),
      version: getCurrentStateVersion(),
    }
  )
);

export default useStore;
