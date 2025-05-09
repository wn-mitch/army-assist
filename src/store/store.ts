import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 } from "uuid";

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
import DatasheetModel from "@/types/DatasheetModel";
import Ability from "@/types/Ability";
import StoredList from "@/types/StoredList";

import { getCurrentStateVersion } from "@/utils/VersionHelper";
import {
  applyAbilityOverrides,
  applyFactionOverrides,
  applyMissingAbilities,
  applyMissingWeapons,
  applyNameOverrides,
  applyWeaponAndEnhancementOverrides,
  arraysEqual,
} from "@/utils/StoreHelper";
import Settings from "@/types/Settings";
import { samplePreload, testingPreload } from "@/utils/PreloadedLists";

interface StoreState {
  isFirstVisit: boolean;
  storedLists: StoredList[];
  activeList: number;
  settings: Settings;
  currentSaveVersion: number;
  reset: () => void;
  addList: (text?: string) => void;
  hasActiveList: () => boolean;
  setActiveList: (uuid: string) => void;
  getActiveList: () => StoredList;
  editListName: (uuid: string, listName: string) => void;
  deleteList: (uuid: string) => void;
  refreshArmy: (uuid: string) => void;
  parseText: (text: string, name: string, listIndex?: string) => boolean;
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
  setTruncateCoreRules: (truncateCoreRules: boolean) => void;
  setListDisplaySetting: (listDisplaySetting: boolean) => void;
  getProcessedUnitList: () => ListUnit[];
  getStratagemsByPhase: (phase: Phase) => Stratagem[];
  getStratagems: () => Stratagem[];
  getArmyAbilities: () => Ability[];
  getListIndexByUUID: (uuid: string | undefined) => number;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => {
      return {
        isFirstVisit: true,
        currentSaveVersion: getCurrentStateVersion(),
        // storedLists: testingPreload,
        storedLists: samplePreload,
        activeList: -1,
        settings: {
          listSort: SortOptions.Name,
          cardsCollapse: true,
          showKeywords: true,
          isDarkMode: true,
          cardsGroup: true,
          weaponsFilter: true,
          truncateCoreRules: true,
          listDisplaySetting: true,
          activePhases: {
            [Phase.Pregame]: true,
            [Phase.Command]: true,
            [Phase.Movement]: true,
            [Phase.Shooting]: true,
            [Phase.Charge]: true,
            [Phase.Fight]: true,
            [Phase.Saves]: true,
          },
        },
        reset: () => {
          const hasUnits = get().storedLists[get().activeList].units.length > 0;
          if (!hasUnits) {
            get().storedLists.pop();
          }
          set({
            currentSaveVersion: getCurrentStateVersion(),
            activeList: -1,
          });
        },
        hasActiveList: () => get().activeList >= 0,
        setActiveList: (uuid: string) => {
          const listIndex = get().getListIndexByUUID(uuid);
          set({ activeList: listIndex });
        },
        addList: (text?: string) => {
          const newList: StoredList = {
            uuid: v4(),
            text: text || "",
            name: text ? "Imported List" : undefined,
            units: [],
            phase: Phase.Pregame,
            faction: undefined,
            detachment: undefined,
            created: Date.now().toString(),
            updated: Date.now().toString(),
          };

          const storedLists = get().storedLists;

          const newStoredLists = [...storedLists, newList];
          set({ storedLists: newStoredLists });
          get().setActiveList(newList.uuid);
        },
        getActiveList: () => {
          const activeList = get().activeList;
          const lists = get().storedLists;
          return lists[activeList];
        },
        editListName: (uuid: string, listName: string) => {
          const listIndex = get().getListIndexByUUID(uuid);
          set((state) => {
            const lists = state.storedLists;
            const updatedList = {
              ...lists[listIndex],
              name: listName,
              updated: Date.now().toString(),
            };
            const updatedStoredLists = [...lists];
            updatedStoredLists[listIndex] = updatedList;
            return { storedLists: updatedStoredLists };
          });
        },
        deleteList: (uuid: string) => {
          const listIndex = get().getListIndexByUUID(uuid);

          set((state) => {
            const updatedStoredLists = state.storedLists.filter(
              (_, index) => index !== listIndex
            );
            return { storedLists: updatedStoredLists };
          });
        },
        refreshArmy: (uuid: string) => {
          const listIndex = get().getListIndexByUUID(uuid);
          const list = get().storedLists[listIndex];
          const name = list.name ?? "";
          get().parseText(list.text, name, list.uuid);
        },
        parseText: (text: string, name: string, uuid?: string): boolean => {
          const activeList = get().activeList;
          const listIndex = get().getListIndexByUUID(uuid);

          const storedList: StoredList = {
            uuid: uuid || v4(),
            text: text,
            name: undefined,
            units: [],
            phase: Phase.Pregame,
            faction: undefined,
            detachment: undefined,
            created: get().hasActiveList()
              ? get().getActiveList().created
              : Date.now().toString(),
            updated: Date.now().toString(),
          };

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

          storedList.faction = factionAbbreviationId;

          const listUnits: ListUnit[] = [];
          let lastParentUnit: ListUnit | null = null;

          lines.forEach((line, index) => {
            const detachmentMatch = line.match(
              /Detachment[\sChoices]*: ([\w\s-]+)/
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

              storedList.detachment = name;
            }

            const parentMatch = line.match(
              /^([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]'‘’]+)\s\[\d+[\s]?pts\]:\s?([\d()A-Za-zÀ-ÖØ-öø-ÿ\s\/,&’'-]+)?$/
            );
            const childMatch = line.match(
              /(\d+)x\s([A-Za-zÀ-ÖØ-öø-ÿ\s\-’'/&()]+)([\s[\]\d\w]+)?:\s([()A-Za-zÀ-ÖØ-öø-ÿ\s,'&\d-]+)/
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
                .flatMap((name) => {
                  const cleanedName = name
                    .replace(/\s*\((.*?)\)\s*/g, ", $1")
                    .trim();
                  return cleanedName.split(",").map((part) => part.trim());
                });
              
              const updatedWeapons = weapons?.flatMap((weapon) => {
                const match = weapon.match(/(\d+)x\s+([A-Za-z\s\'-]+)/);
                if (match) {
                  const matchCount = parseInt(match[1], 10);
                  const weaponName = match[2];
                  return Array(matchCount).fill(weaponName);
                }
                return weapon;
              });

              const weaponCount = updatedWeapons?.reduce((acc, weapon) => {
                acc[weapon] =
                  parseInt(count) *
                  updatedWeapons.filter((item) => item === weapon).length;
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
                weapons: updatedWeapons,
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

                console.log(unit.name, unit, weapons)
                // Weapon Overrides
                unit.weapons = applyWeaponAndEnhancementOverrides(
                  datasheet,
                  weapons,
                  unit.count ?? {}
                );

                const updatedCount: Record<string, number> = {};

                Object.keys(unit.count ?? {}).forEach((key) => {
                  const match = key.match(/(\d+)x\s+([A-Za-z\'\s-]+)/);
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
                  (wargear) =>
                    datasheet && datasheet.id === wargear.datasheet_id
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
                    unit.weapons
                      ?.map((weapon) => weapon.toLowerCase())
                      .includes(enhancement.name.toLowerCase())
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

            storedList.units = updatedUnits;
          }
          storedList.name =
            name !== ""
              ? name
              : `${storedList.faction} - ${storedList.detachment}`;

          const index = activeList >= 0 ? activeList : listIndex;

          const updatedStoredLists = [...get().storedLists];

          if (index !== undefined) {
            updatedStoredLists[index] = { ...storedList };
          } else {
            console.error("Index is undefined. Cannot update stored lists.");
          }

          set({ storedLists: updatedStoredLists });

          return true;
        },
        setPhase: (phase: Phase) => {
          const activeList = get().activeList;

          if (get().hasActiveList()) {
            set((state) => {
              const updatedStoredLists = [...state.storedLists];
              updatedStoredLists[activeList] = {
                ...updatedStoredLists[activeList],
                phase,
                units: updatedStoredLists[activeList].units.map((u) => ({
                  ...u,
                  toggled: true,
                })),
              };
              return { storedLists: updatedStoredLists };
            });
          }
        },
        toggleUnit: (unit: ListUnit) => {
          const activeList = get().activeList;
          if (get().hasActiveList()) {
            set((state) => {
              const updatedStoredLists = [...state.storedLists];
              const units = [...updatedStoredLists[activeList].units];
              const index = units.findIndex((u) => u.id === unit.id);
              if (index !== -1) {
                units[index] = {
                  ...units[index],
                  toggled: !units[index].toggled,
                };
                updatedStoredLists[activeList] = {
                  ...updatedStoredLists[activeList],
                  units,
                };
                return { ...state, storedLists: updatedStoredLists };
              } else {
                return state;
              }
            });
          }
        },
        togglePhase: (phase: Phase) => {
          set((state) => ({
            settings: {
              ...state.settings,
              activePhases: {
                ...state.settings.activePhases,
                [phase]: !state.settings.activePhases[phase],
              },
            },
          }));
        },
        setFirstVisit: (isFirstVisit: boolean) => set({ isFirstVisit }),
        setListSort: (listSort: SortOptions) => {
          set((state) => ({
            settings: {
              ...state.settings,
              listSort,
            },
          }));
        },
        setCardsCollapse: (cardsCollapse: boolean) => {
          set((state) => ({
            settings: {
              ...state.settings,
              cardsCollapse,
            },
          }));
        },
        setShowKeywords: (showKeywords: boolean) => {
          set((state) => ({
            settings: {
              ...state.settings,
              showKeywords,
            },
          }));
        },
        setIsDarkMode: (isDarkMode: boolean) => {
          set((state) => ({
            settings: {
              ...state.settings,
              isDarkMode,
            },
          }));
        },
        setCardsGroup: (cardsGroup: boolean) => {
          set((state) => ({
            settings: {
              ...state.settings,
              cardsGroup,
            },
          }));
        },
        setWeaponsFilter: (weaponsFilter: boolean) => {
          set((state) => ({
            settings: {
              ...state.settings,
              weaponsFilter,
            },
          }));
        },
        setTruncateCoreRules: (truncateCoreRules: boolean) => {
          set((state) => ({
            settings: {
              ...state.settings,
              truncateCoreRules,
            },
          }));
        },
        setListDisplaySetting: (listDisplaySetting: boolean) => {
          set((state) => ({
            settings: {
              ...state.settings,
              listDisplaySetting,
            },
          }));
        },
        getProcessedUnitList: () => {
          const activeList = get().activeList;
          if (activeList < 0) {
            return [];
          }

          const units = get().getActiveList().units;

          const listSort = get().settings.listSort;
          const cardsGroup = get().settings.cardsGroup;

          const sortByListSort = (a: ListUnit, b: ListUnit) => {
            switch (listSort) {
              case SortOptions.Name:
                return a.name.localeCompare(b.name);
              // TODO: This must be -1, I don't know why but this doesn't get caught in testing
              case SortOptions.PasteOrder:
                return 1;
              case SortOptions.ReversePasteOrder:
                return -1;
            }
          };

          const groupedUnits = cardsGroup
            ? units.reduce((acc: ListUnit[], curr: ListUnit) => {
                const index = acc.findIndex((item) => {
                  return (
                    item.name === curr.name &&
                    arraysEqual(item.enhancements, curr.enhancements) &&
                    arraysEqual(item.weapons ?? [], curr.weapons ?? [])
                  );
                });
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

          const storedList = get().getActiveList();

          const faction = storedList.faction;
          const detachment = storedList.detachment;

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
        getStratagems: () => {
          const stratagemNames = new Set();

          const activeList = get().activeList;

          if (activeList < 0) {
            return [];
          }

          const storedList = get().getActiveList();

          const faction = storedList.faction;
          const detachment = storedList.detachment;

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
          const faction = get().storedLists[get().activeList].faction;
          const detachment = get().storedLists[get().activeList].detachment;

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
              ability.faction_id === faction &&
              ability.detachment === detachment
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
        getListIndexByUUID(uuid) {
          const index = get().storedLists.findIndex(
            (list) => list.uuid === uuid
          );
          return index;
        },
      };
    },
    {
      name: "army-storage",
      storage: createJSONStorage(() => sessionStorage),
      version: getCurrentStateVersion(),
    }
  )
);

export default useStore;
