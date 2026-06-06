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
import LeaderAttachments from "@/assets/json/Datasheets_leader.json";

import ListUnit from "@/types/ListUnit";
import Phase from "@/types/Phase";
import SortOptions from "@/types/SortOptions";
import Enhancement from "@/types/Enhancement";
import { Stratagem } from "@/types/Stratagem";
import DatasheetModel from "@/types/DatasheetModel";
import Ability from "@/types/Ability";
import StoredList from "@/types/StoredList";
import LeaderAttachment from "@/types/LeaderAttachment";

import { getCurrentStateVersion } from "@/utils/VersionHelper";
import { arraysEqual } from "@/utils/StoreHelper";
import Settings from "@/types/Settings";
import { samplePreload, testingPreload } from "@/utils/PreloadedLists";
import StoredRoster, { UnitOverlay } from "@/types/StoredRoster";
import type { Stratagem as GameStratagem, AbilityView } from "@/data/dataset";
import {
    buildStoredRoster,
    rosterUnitRows,
    stratagemsForPhase,
    armyAbilities,
    type RosterUnitRow,
} from "@/data/rosterSelectors";

// Normalize American → British spelling and common variants for matching
const SPELLING_NORMALIZATIONS: [RegExp, string][] = [
    [/armor/gi, "armour"],
    [/honor/gi, "honour"],
    [/favor/gi, "favour"],
    [/berserker/gi, "berzerker"],
];

const normalizeSpelling = (name: string): string => {
    let normalized = name;
    for (const [pattern, replacement] of SPELLING_NORMALIZATIONS) {
        normalized = normalized.replace(pattern, replacement);
    }
    return normalized;
};

// Faction-specific unit name aliases for ListForge → canonical datasheet names
const FACTION_UNIT_ALIASES: Record<string, Record<string, string>> = {
    WE: {
        "daemon prince": "Daemon Prince of Khorne",
        "daemon prince with wings": "Daemon Prince of Khorne with Wings",
        "rhino": "Chaos Rhino",
    },
};
import Note from "@/types/Note";

interface StoreState {
    isFirstVisit: boolean;
    storedLists: StoredList[];
    /**
     * Native roster model (40kdc Roster + app overlay), index-aligned with
     * storedLists. Transitional dual-write while UI surfaces migrate off
     * ListUnit; becomes the only model once the legacy path is deleted.
     */
    storedRosters: (StoredRoster | undefined)[];
    activeList: number;
    settings: Settings;
    currentSaveVersion: number;
    reset: () => void;
    addList: (text?: string) => void;
    hasActiveList: () => boolean;
    setActiveList: (uuid: string) => void;
    getActiveList: () => StoredList;
    editListName: (uuid: string, listName: string) => void;
    editList: (uuid: string, listName: string, listText: string) => void;
    deleteList: (uuid: string) => void;
    refreshArmy: (uuid: string) => void;
    parseText: (
        text: string,
        name: string,
        listIndex?: string,
    ) => boolean;
    parseNRJson: (
        text: string,
        name: string,
        uuid?: string,
    ) => boolean;
    parseTextListforge: (
        text: string,
        name: string,
        listIndex?: string,
    ) => boolean;
    processUnitsWithDatasheets: (
        storedList: StoredList,
        listUnits: ListUnit[],
        factionAbbreviationId: string,
        name: string,
        uuid?: string,
    ) => boolean;
    setPhase: (phase: Phase) => void;
    toggleUnit: (unit: ListUnit) => void;
    addNewNote: (unit: ListUnit, note: Note) => void;
    editNote: (unit: ListUnit, noteIndex: number, updatedNote: Note) => void;
    deleteNote: (unit: ListUnit, noteIndex: number) => void;
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
    toggleEditForceMode: (editForceMode: boolean) => void;
    getProcessedUnitList: () => ListUnit[];
    getStratagemsByPhase: (phase: Phase) => Stratagem[];
    getStratagems: () => Stratagem[];
    getArmyAbilities: () => Ability[];
    /** Mirror the latest parse into the native roster model (dual-write). */
    syncRosterAt: (text: string, name: string, uuid?: string) => void;
    getActiveRoster: () => StoredRoster | null;
    getRosterUnits: () => RosterUnitRow[];
    getRosterStratagemsByPhase: (phase: Phase) => GameStratagem[];
    getRosterArmyAbilities: () => AbilityView[];
    toggleRosterUnit: (unitIndex: number) => void;
    addRosterNote: (unitIndex: number, note: Note) => void;
    editRosterNote: (
        unitIndex: number,
        noteIndex: number,
        updatedNote: Note,
    ) => void;
    deleteRosterNote: (unitIndex: number, noteIndex: number) => void;
    getListIndexByUUID: (uuid: string | undefined) => number;
    attachUnitToLeader: (
        listIndex: number,
        leaderId: string,
        unitId: string,
    ) => void;
    detachUnitFromLeader: (listIndex: number, unitId: string) => void;
    getAttachableUnits: (leaderDatasheetId: string) => string[];
    getLeadersForUnit: (unitDatasheetId: string) => string[];
}

const useStore = create<StoreState>()(
    persist(
        (set, get) => {
            /** Apply an updater to one unit's overlay on the active roster. */
            const updateRosterOverlay = (
                unitIndex: number,
                update: (overlay: UnitOverlay) => UnitOverlay,
            ): void => {
                const activeList = get().activeList;
                if (activeList < 0) return;
                const stored = get().storedRosters[activeList];
                if (!stored || unitIndex < 0) return;
                const unitState = [...stored.unitState];
                const current = unitState[unitIndex] ?? {
                    toggled: true,
                    notes: [],
                };
                unitState[unitIndex] = update(current);
                const updated = [...get().storedRosters];
                updated[activeList] = {
                    ...stored,
                    unitState,
                    updated: Date.now().toString(),
                };
                set({ storedRosters: updated });
            };

            return {
                isFirstVisit: true,
                currentSaveVersion: getCurrentStateVersion(),
                // storedLists: testingPreload,
                storedLists: samplePreload,
                storedRosters: samplePreload.map((list) => ({
                    ...buildStoredRoster(list.text, list.name ?? ""),
                    uuid: list.uuid,
                })),
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
                    editForceMode: false,
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
                    const hasUnits =
                        get().storedLists[get().activeList].units.length > 0;
                    if (!hasUnits) {
                        get().storedLists.pop();
                        get().storedRosters.pop();
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
                        textFormat: "listforge",
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
                    const newStoredRosters = [...get().storedRosters];
                    newStoredRosters[newStoredLists.length - 1] = {
                        ...buildStoredRoster(text || "", ""),
                        uuid: newList.uuid,
                    };
                    set({
                        storedLists: newStoredLists,
                        storedRosters: newStoredRosters,
                    });
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
                        const updatedStoredRosters = [...state.storedRosters];
                        const roster = updatedStoredRosters[listIndex];
                        if (roster) {
                            updatedStoredRosters[listIndex] = {
                                ...roster,
                                name: listName,
                                updated: Date.now().toString(),
                            };
                        }
                        return {
                            storedLists: updatedStoredLists,
                            storedRosters: updatedStoredRosters,
                        };
                    });
                },
                editList: (
                    uuid: string,
                    listName: string,
                    listText: string,
                ) => {
                    const listIndex = get().getListIndexByUUID(uuid);
                    set((state) => {
                        const lists = state.storedLists;
                        const updatedList = {
                            ...lists[listIndex],
                            name: listName,
                            text: listText,
                            updated: Date.now().toString(),
                        };
                        const updatedStoredLists = [...lists];
                        updatedStoredLists[listIndex] = updatedList;
                        return { storedLists: updatedStoredLists };
                    });

                    // Reparse the list with the new text
                    get().parseText(listText, listName, uuid);
                },
                deleteList: (uuid: string) => {
                    const listIndex = get().getListIndexByUUID(uuid);

                    set((state) => {
                        const updatedStoredLists = state.storedLists.filter(
                            (_, index) => index !== listIndex,
                        );
                        const updatedStoredRosters = state.storedRosters.filter(
                            (_, index) => index !== listIndex,
                        );
                        return {
                            storedLists: updatedStoredLists,
                            storedRosters: updatedStoredRosters,
                        };
                    });
                },
                refreshArmy: (uuid: string) => {
                    const listIndex = get().getListIndexByUUID(uuid);
                    const list = get().storedLists[listIndex];
                    const name = list.name ?? "";
                    get().parseText(list.text, name, list.uuid);
                },
                parseText: (
                    text: string,
                    name: string,
                    uuid?: string,
                ): boolean => {
                    let parsed = false;
                    let routed = false;
                    try {
                        const json = JSON.parse(text);
                        if (json.roster) {
                            parsed = get().parseNRJson(text, name, uuid);
                            routed = true;
                        }
                    } catch {
                        // Not JSON, fall through to listforge parser
                    }
                    if (!routed) {
                        parsed = get().parseTextListforge(text, name, uuid);
                    }
                    // Dual-write (transitional): mirror every successful parse
                    // into the native 40kdc roster model at the same index.
                    if (parsed) {
                        get().syncRosterAt(text, name, uuid);
                    }
                    return parsed;
                },
                syncRosterAt: (
                    text: string,
                    name: string,
                    uuid?: string,
                ) => {
                    const activeList = get().activeList;
                    const listIndex = get().getListIndexByUUID(uuid);
                    const index = activeList >= 0 ? activeList : listIndex;
                    if (index < 0 || index >= get().storedLists.length) {
                        return;
                    }
                    const previous = get().storedRosters[index];
                    const legacyUuid = get().storedLists[index]?.uuid;
                    const stored = buildStoredRoster(text, name, previous);
                    const updated = [...get().storedRosters];
                    updated[index] = {
                        ...stored,
                        uuid: legacyUuid ?? stored.uuid,
                    };
                    set({ storedRosters: updated });
                },
                getActiveRoster: () => {
                    const index = get().activeList;
                    if (index < 0) return null;
                    return get().storedRosters[index] ?? null;
                },
                getRosterUnits: () => {
                    const stored = get().getActiveRoster();
                    return stored ? rosterUnitRows(stored) : [];
                },
                getRosterStratagemsByPhase: (phase: Phase) => {
                    const stored = get().getActiveRoster();
                    return stored
                        ? stratagemsForPhase(stored.roster, phase)
                        : [];
                },
                getRosterArmyAbilities: () => {
                    const stored = get().getActiveRoster();
                    return stored ? armyAbilities(stored.roster) : [];
                },
                toggleRosterUnit: (unitIndex: number) => {
                    updateRosterOverlay(unitIndex, (overlay) => ({
                        ...overlay,
                        toggled: !overlay.toggled,
                    }));
                },
                addRosterNote: (unitIndex: number, note: Note) => {
                    updateRosterOverlay(unitIndex, (overlay) => ({
                        ...overlay,
                        notes: [...overlay.notes, note],
                    }));
                },
                editRosterNote: (
                    unitIndex: number,
                    noteIndex: number,
                    updatedNote: Note,
                ) => {
                    updateRosterOverlay(unitIndex, (overlay) => ({
                        ...overlay,
                        notes: overlay.notes.map((n, i) =>
                            i === noteIndex ? updatedNote : n,
                        ),
                    }));
                },
                deleteRosterNote: (unitIndex: number, noteIndex: number) => {
                    updateRosterOverlay(unitIndex, (overlay) => ({
                        ...overlay,
                        notes: overlay.notes.filter(
                            (_, i) => i !== noteIndex,
                        ),
                    }));
                },
                parseNRJson: (
                    text: string,
                    name: string,
                    uuid?: string,
                ): boolean => {
                    const activeList = get().activeList;
                    const listIndex = get().getListIndexByUUID(uuid);

                    const storedList: StoredList = {
                        uuid: uuid || v4(),
                        text: text,
                        textFormat: "nrjson",
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

                    let roster;
                    try {
                        roster = JSON.parse(text).roster;
                    } catch {
                        return false;
                    }

                    if (!roster || !roster.forces || roster.forces.length === 0) {
                        return false;
                    }

                    const force = roster.forces[0];

                    // Extract faction from catalogueName (e.g. "Chaos - Chaos Knights")
                    const catalogueName: string = force.catalogueName || "";
                    const catalogueSegments = catalogueName.split(" - ").map((s: string) => s.trim());
                    const factionMatch = Factions.find((f) =>
                        catalogueSegments.some((seg: string) => f.name === seg),
                    );

                    if (!factionMatch) {
                        console.error("Faction not found for catalogueName:", catalogueName);
                        return false;
                    }

                    const factionId = factionMatch.id;
                    storedList.faction = factionId;

                    // Extract detachment
                    const detachmentSelection = (force.selections || []).find(
                        (s: { name: string }) =>
                            s.name === "Detachment" ||
                            s.name === "Detachment Choice",
                    );
                    if (detachmentSelection?.selections?.length > 0) {
                        storedList.detachment = detachmentSelection.selections[0].name;
                    }

                    // Extract roster name
                    const rosterName = roster.name || name;

                    // Extract units: selections where type is "model" or "unit"
                    // and primary category is not "Configuration"
                    interface NRSelection {
                        name: string;
                        type: string;
                        costs?: { name: string; value: number }[];
                        selections?: NRSelection[];
                        categories?: { name: string; primary: boolean }[];
                    }

                    const isConfiguration = (sel: NRSelection): boolean => {
                        return (sel.categories || []).some(
                            (c: { name: string; primary: boolean }) => c.primary && c.name === "Configuration",
                        );
                    };

                    const selections: NRSelection[] = force.selections || [];
                    const unitSelections = selections.filter(
                        (s) => (s.type === "model" || s.type === "unit") && !isConfiguration(s),
                    );

                    const listUnits: ListUnit[] = unitSelections.map(
                        (sel: NRSelection, index: number) => {
                            // Get points
                            const ptsCost = (sel.costs || []).find(
                                (c: { name: string; value: number }) => c.name === "pts",
                            );
                            const points = ptsCost ? ptsCost.value : null;

                            // Get wargear from sub-selections
                            const subSelections = sel.selections || [];
                            const wargearNames = subSelections
                                .map((sub: NRSelection) => sub.name);
                            const details = wargearNames.join(", ");

                            // For "unit" type, extract child models
                            const children: ListUnit[] = [];
                            if (sel.type === "unit") {
                                const childModels = subSelections.filter(
                                    (sub: NRSelection) => sub.type === "model",
                                );
                                childModels.forEach((child: NRSelection, childIndex: number) => {
                                    const childWargear = (child.selections || [])
                                        .map((sub: NRSelection) => sub.name)
                                        .join(", ");
                                    children.push({
                                        id: index * 1000 + childIndex,
                                        name: child.name,
                                        details: childWargear,
                                        children: [],
                                        toggled: true,
                                        count: {},
                                        groupCount: 1,
                                        points: null,
                                        datasheet_id: null,
                                        weapons: [],
                                        weaponsDatasheets: [],
                                        abilities: [],
                                        enhancements: [],
                                        datasheet: null,
                                        datasheetModel: null,
                                        keywords: "",
                                        notes: [],
                                    });
                                });
                            }

                            return {
                                id: index,
                                name: sel.name,
                                details: details,
                                children: children,
                                toggled: true,
                                count: {},
                                groupCount: 1,
                                points: points,
                                datasheet_id: null,
                                weapons: [],
                                weaponsDatasheets: [],
                                abilities: [],
                                enhancements: [],
                                datasheet: null,
                                datasheetModel: null,
                                keywords: "",
                                notes: [],
                            };
                        },
                    );

                    return get().processUnitsWithDatasheets(
                        storedList,
                        listUnits,
                        factionId,
                        rosterName,
                        uuid,
                    );
                },
                parseTextListforge: (
                    text: string,
                    name: string,
                    uuid?: string,
                ): boolean => {
                    const activeList = get().activeList;
                    const listIndex = get().getListIndexByUUID(uuid);

                    const storedList: StoredList = {
                        uuid: uuid || v4(),
                        text: text,
                        textFormat: "listforge",
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
                    const factionMatch = lines[0]
                        .trim()
                        .match(/^.+? - ([\w''\s\-]+) -/);
                    const factionMatchName = lines[0]
                        .trim()
                        .match(/^.+? - ([\w''\s\-]+) - /);

                    if (!factionMatch || !factionMatchName) {
                        window.alert(
                            "Name/Faction/Detachment format not recognized. Note: using ' - ' (space-dash-space) in your ListForge list name will break parsing.",
                        );
                        return false;
                    }

                    const factionAbbreviation = Factions.filter(
                        (f) =>
                            f.name === factionMatch[1] ||
                            f.name === factionMatchName[1],
                    )[0];

                    if (!factionAbbreviation) {
                        console.error(
                            "Faction abbreviation not found in the list",
                        );
                        return false;
                    }

                    const factionAbbreviationId = factionAbbreviation.id;
                    storedList.faction = factionAbbreviationId;

                    const detachmentMatch = lines[0]
                        .trim()
                        .match(/^.+? - [\w''\s\-]+ - ([\w''\s\-]+?)(?:\s*[\(\[])/);

                    if (detachmentMatch) {
                        storedList.detachment = detachmentMatch[1].trim();
                    } else {
                        for (const line of lines) {
                            const detLine = line
                                .trim()
                                .match(/^Detachment(?:\s+Choice)?:\s*(.+)$/);
                            if (detLine) {
                                storedList.detachment = detLine[1].trim();
                                break;
                            }
                        }
                    }

                    const listUnits: ListUnit[] = [];
                    let lastParentUnit: ListUnit | null = null;

                    lines.forEach((line, index) => {
                        const parentMatch = line.match(
                            /^([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]'''\/]+)\s\([\d]+ pts\)$/,
                        );

                        const singleIndentBulletMatch = line.match(
                            /^\s{2}•\s([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]'''\/\d,&\:]+)$/,
                        );

                        const doubleIndentBulletMatch = line.match(
                            /^\s{4}•\s([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]'''\/\d,&\:]+)$/,
                        );

                        const tripleIndentBulletMatch = line.match(
                            /^\s{6}•\s([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]'''\/\d,&\:]+)$/,
                        );

                        if (parentMatch) {
                            const [, name] = parentMatch;

                            if (name) {
                                lastParentUnit = {
                                    id: index,
                                    name,
                                    details: "",
                                    children: [],
                                    toggled: true,
                                    count: {},
                                    groupCount: 1,
                                    points: null,
                                    datasheet_id: null,
                                    weapons: [],
                                    weaponsDatasheets: [],
                                    abilities: [],
                                    enhancements: [],
                                    datasheet: null,
                                    datasheetModel: null,
                                    keywords: "",
                                    notes: [],
                                };

                                listUnits.push(lastParentUnit);
                            }
                        } else if (singleIndentBulletMatch) {
                            const [, name] = singleIndentBulletMatch;

                            const isEnhancement = name.startsWith("E: ");

                            const processedName = isEnhancement
                                ? name.substring(3)
                                : name;

                            if (isEnhancement && lastParentUnit) {
                                lastParentUnit.details += processedName;
                                return;
                            }

                            const [, , count, itemName] =
                                processedName.match(
                                    /((\d+)x\s+)?([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]'''\/,&\:]+)/,
                                ) || [];

                            const unit: ListUnit = {
                                id: index,
                                name: itemName,
                                toggled: true,
                                count: { [itemName]: parseInt(count, 10) || 1 },
                                groupCount: 1,
                                points: null,
                                datasheet_id: null,
                                children: [],
                                weaponsDatasheets: [],
                                abilities: [],
                                enhancements: [],
                                datasheet: null,
                                datasheetModel: null,
                                keywords: "",
                                notes: [],
                                details: undefined,
                                weapons: undefined,
                            };

                            if (lastParentUnit && lastParentUnit.children) {
                                lastParentUnit.children.push(unit);
                            }
                        } else if (doubleIndentBulletMatch) {
                            const [, name] = doubleIndentBulletMatch;
                            const [, , count, itemName] =
                                name.match(
                                    /((\d+)x\s+)?([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]'''\/,&]+)/,
                                ) || [];

                            const unit: ListUnit = {
                                id: index,
                                name: itemName,
                                toggled: true,
                                count: { [itemName]: parseInt(count, 10) || 1 },
                                groupCount: 1,
                                points: null,
                                datasheet_id: null,
                                children: [],
                                weaponsDatasheets: [],
                                abilities: [],
                                enhancements: [],
                                datasheet: null,
                                datasheetModel: null,
                                keywords: "",
                                notes: [],
                                details: undefined,
                                weapons: undefined,
                            };

                            if (lastParentUnit && lastParentUnit.children) {
                                lastParentUnit.children.push(unit);
                            }
                        } else if (tripleIndentBulletMatch) {
                            const [, name] = tripleIndentBulletMatch;

                            const [, , count, itemName] =
                                name.match(
                                    /((\d+)x\s+)?([A-Za-zÀ-ÖØ-öø-ÿ\s\-\[\]'''\/,&]+)/,
                                ) || [];

                            const unit: ListUnit = {
                                id: index,
                                name: itemName,
                                toggled: true,
                                count: { [itemName]: parseInt(count, 10) || 1 },
                                groupCount: 1,
                                points: null,
                                datasheet_id: null,
                                children: [],
                                weaponsDatasheets: [],
                                abilities: [],
                                enhancements: [],
                                datasheet: null,
                                datasheetModel: null,
                                keywords: "",
                                notes: [],
                                details: undefined,
                                weapons: undefined,
                            };

                            if (lastParentUnit && lastParentUnit.children) {
                                lastParentUnit.children.push(unit);
                            }
                        }
                    });

                    storedList.name =
                        name !== "" ? name : "ListForge Imported List";

                    const index = activeList >= 0 ? activeList : listIndex;
                    const updatedStoredLists = [...get().storedLists];

                    if (index !== undefined) {
                        updatedStoredLists[index] = { ...storedList };
                    } else {
                        console.error(
                            "Index is undefined. Cannot update stored lists.",
                        );
                    }

                    set({ storedLists: updatedStoredLists });
                    // Use the shared unit processing method
                    return get().processUnitsWithDatasheets(
                        storedList,
                        listUnits,
                        factionAbbreviationId,
                        name,
                        uuid,
                    );
                },
                processUnitsWithDatasheets: (
                    storedList: StoredList,
                    listUnits: ListUnit[],
                    factionAbbreviationId: string,
                    name: string,
                    uuid?: string,
                ): boolean => {
                    // Faction name prefixes used by ListForge/BSData that differ
                    // from canonical GW datasheet names
                    const FACTION_NAME_PREFIXES: Record<string, string[]> = {
                        WE: ["World Eater", "World Eaters"],
                        DG: ["Death Guard"],
                        TS: ["Thousand Sons", "Thousand Son"],
                        EC: [
                            "Emperor's Children",
                            "Emperors Children",
                        ],
                        CSM: [
                            "Chaos Space Marine",
                            "Chaos Space Marines",
                        ],
                    };

                    const findDatasheet = (unitName: string) => {
                        const lowerName = normalizeSpelling(unitName.toLowerCase());
                        let matches = Datasheets.filter(
                            (item) =>
                                normalizeSpelling(item.name.toLowerCase()) === lowerName,
                        );

                        if (matches.length > 0) {
                            const factionMatch = matches.find(
                                (item) =>
                                    item.faction_id ===
                                    factionAbbreviationId,
                            );
                            const cdMatch = matches.find(
                                (item) => item.faction_id === "CD",
                            );
                            return factionMatch || cdMatch || matches[0];
                        }

                        // Fallback: strip faction prefix and retry
                        const prefixes =
                            FACTION_NAME_PREFIXES[
                                factionAbbreviationId
                            ] || [];
                        for (const prefix of prefixes) {
                            if (
                                lowerName.startsWith(
                                    prefix.toLowerCase() + " ",
                                )
                            ) {
                                const stripped = unitName
                                    .substring(prefix.length + 1)
                                    .trim();
                                matches = Datasheets.filter(
                                    (item) =>
                                        normalizeSpelling(item.name.toLowerCase()) ===
                                        normalizeSpelling(stripped.toLowerCase()),
                                );
                                if (matches.length > 0) {
                                    const factionMatch = matches.find(
                                        (item) =>
                                            item.faction_id ===
                                            factionAbbreviationId,
                                    );
                                    const cdMatch = matches.find(
                                        (item) =>
                                            item.faction_id === "CD",
                                    );
                                    return (
                                        factionMatch ||
                                        cdMatch ||
                                        matches[0]
                                    );
                                }
                            }
                        }

                        // Fallback: check faction-specific unit aliases
                        const aliases = FACTION_UNIT_ALIASES[factionAbbreviationId];
                        if (aliases) {
                            // Try both the raw lowered name and any prefix-stripped version
                            const candidates = [lowerName];
                            for (const prefix of prefixes) {
                                if (lowerName.startsWith(prefix.toLowerCase() + " ")) {
                                    candidates.push(
                                        lowerName.substring(prefix.length + 1).trim(),
                                    );
                                }
                            }
                            for (const candidate of candidates) {
                                const aliasTarget = aliases[normalizeSpelling(candidate)];
                                if (aliasTarget) {
                                    matches = Datasheets.filter(
                                        (item) =>
                                            item.name.toLowerCase() ===
                                            aliasTarget.toLowerCase(),
                                    );
                                    if (matches.length > 0) {
                                        const factionMatch = matches.find(
                                            (item) =>
                                                item.faction_id ===
                                                factionAbbreviationId,
                                        );
                                        const cdMatch = matches.find(
                                            (item) => item.faction_id === "CD",
                                        );
                                        return factionMatch || cdMatch || matches[0];
                                    }
                                }
                            }
                        }

                        return undefined;
                    };

                    if (listUnits.length > 0) {
                        const updatedUnits = listUnits
                            .map((unit) => {
                                const datasheet = findDatasheet(
                                    unit.name,
                                );

                                if (!datasheet) {
                                    window.alert(
                                        `Datasheet not found for unit ${unit.name}`,
                                    );
                                    return null;
                                }
                                const datasheetModel = DatasheetModels.find(
                                    (datasheetModel: DatasheetModel) =>
                                        datasheetModel.datasheet_id ===
                                        datasheet.id,
                                );

                                if (!datasheetModel) {
                                    return null;
                                }

                                const matchingAbilities =
                                    DatasheetAbilities.filter(
                                        (ability: Ability) =>
                                            ability.datasheet_id ===
                                            datasheetModel.datasheet_id,
                                    );

                                if (unit.children && unit.children.length > 0) {
                                    const details = unit.children
                                        .map((unit) => ({
                                            ...unit,
                                            name: unit.name
                                                .replace(/^\d+x?\s*/, "")
                                                .trim(),
                                        }))
                                        .map((child) => child.details)
                                        .join(", ");
                                    unit.details = unit.details
                                        ? [
                                              ...unit.details.split(", "),
                                              details,
                                          ].join(", ")
                                        : details;

                                    const count = unit.children.reduce(
                                        (acc, curr) => {
                                            Object.keys(
                                                curr.count ?? {},
                                            ).forEach((key) => {
                                                acc[key] =
                                                    (acc[key] || 0) +
                                                    (curr.count?.[key] || 0);
                                            });
                                            return acc;
                                        },
                                        {} as Record<string, number>,
                                    );
                                    unit.count = count;
                                    unit.children = [];
                                }

                                const weapons = unit.details
                                    ?.split(/,(?![^(]*\))/)
                                    .filter(
                                        (name) =>
                                            name !== "Warlord" && name !== "",
                                    )
                                    .flatMap((name) => {
                                        const cleanedName = name
                                            .replace(/\s*\((.*?)\)\s*/g, ", $1")
                                            .trim();
                                        return cleanedName
                                            .split(",")
                                            .map((part) => part.trim());
                                    });

                                unit.weapons = weapons;

                                const updatedCount: Record<string, number> = {};

                                Object.keys(unit.count ?? {}).forEach((key) => {
                                    const match = key.match(
                                        /(\d+)x\s+([A-Za-z\'\s-]+)/,
                                    );
                                    if (match) {
                                        const multiplier = parseInt(match[1]);
                                        const weaponName = match[2];
                                        updatedCount[weaponName] =
                                            (updatedCount[weaponName] || 0) +
                                            (unit.count?.[key] ?? 0) *
                                                multiplier;
                                    } else {
                                        updatedCount[key] =
                                            (updatedCount[key] || 0) +
                                            (unit.count?.[key] ?? 0);
                                    }
                                });

                                unit.count = updatedCount;

                                unit.weapons?.forEach((weapon) => {
                                    if (unit.count && !unit.count[weapon]) {
                                        unit.count[weapon] = 1;
                                    }
                                });

                                const weaponsDatasheets =
                                    DatasheetWargear.filter(
                                        (wargear) =>
                                            datasheet &&
                                            datasheet.id ===
                                                wargear.datasheet_id,
                                    );

                                const matchingEnhancements =
                                    Enhancements.filter(
                                        (enhancement: Enhancement) =>
                                            unit.weapons
                                                ?.map((weapon) =>
                                                    weapon.toLowerCase(),
                                                )
                                                .includes(
                                                    enhancement.name.toLowerCase(),
                                                ),
                                    );
                                const keywords = DatasheetKeywords.filter(
                                    (keyword) =>
                                        keyword.datasheet_id === datasheet.id,
                                )
                                    .map((x) => x.keyword)
                                    .filter((x) => x !== "")
                                    .join(", ");

                                return {
                                    ...unit,
                                    abilities: matchingAbilities,
                                    weaponsDatasheets: weaponsDatasheets,
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

                    const activeList = get().activeList;
                    const listIndex = get().getListIndexByUUID(uuid);
                    const index = activeList >= 0 ? activeList : listIndex;

                    const updatedStoredLists = [...get().storedLists];

                    if (index !== undefined) {
                        updatedStoredLists[index] = { ...storedList };
                    } else {
                        console.error(
                            "Index is undefined. Cannot update stored lists.",
                        );
                        return false;
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
                                units: updatedStoredLists[activeList].units.map(
                                    (u) => ({
                                        ...u,
                                        toggled: true,
                                    }),
                                ),
                            };
                            const updatedStoredRosters = [
                                ...state.storedRosters,
                            ];
                            const roster = updatedStoredRosters[activeList];
                            if (roster) {
                                updatedStoredRosters[activeList] = {
                                    ...roster,
                                    phase,
                                    unitState: roster.unitState.map((u) => ({
                                        ...u,
                                        toggled: true,
                                    })),
                                };
                            }
                            return {
                                storedLists: updatedStoredLists,
                                storedRosters: updatedStoredRosters,
                            };
                        });
                    }
                },
                toggleUnit: (unit: ListUnit) => {
                    const activeList = get().activeList;
                    if (get().hasActiveList()) {
                        set((state) => {
                            const updatedStoredLists = [...state.storedLists];
                            const units = [
                                ...updatedStoredLists[activeList].units,
                            ];
                            const index = units.findIndex(
                                (u) => u.id === unit.id,
                            );
                            if (index !== -1) {
                                units[index] = {
                                    ...units[index],
                                    toggled: !units[index].toggled,
                                };
                                updatedStoredLists[activeList] = {
                                    ...updatedStoredLists[activeList],
                                    units,
                                };
                                return {
                                    ...state,
                                    storedLists: updatedStoredLists,
                                };
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
                addNewNote: (unit: ListUnit, note: Note) => {
                    const activeList = get().activeList;
                    if (get().hasActiveList()) {
                        set((state) => {
                            const updatedStoredLists = [...state.storedLists];
                            const units = [
                                ...updatedStoredLists[activeList].units,
                            ];
                            const index = units.findIndex(
                                (u) => u.id === unit.id,
                            );
                            if (index !== -1) {
                                const updatedUnit = {
                                    ...units[index],
                                    notes: [
                                        ...(units[index].notes || []),
                                        note,
                                    ],
                                };
                                units[index] = updatedUnit;
                                updatedStoredLists[activeList] = {
                                    ...updatedStoredLists[activeList],
                                    units,
                                };
                                return {
                                    ...state,
                                    storedLists: updatedStoredLists,
                                };
                            } else {
                                return state;
                            }
                        });
                    }
                },
                editNote: (
                    unit: ListUnit,
                    noteIndex: number,
                    updatedNote: Note,
                ) => {
                    const activeList = get().activeList;
                    if (get().hasActiveList()) {
                        set((state) => {
                            const updatedStoredLists = [...state.storedLists];
                            const units = [
                                ...updatedStoredLists[activeList].units,
                            ];
                            const index = units.findIndex(
                                (u) => u.id === unit.id,
                            );
                            if (index !== -1) {
                                const unitNotes = [
                                    ...(units[index].notes || []),
                                ];
                                unitNotes[noteIndex] = updatedNote;
                                const updatedUnit = {
                                    ...units[index],
                                    notes: unitNotes,
                                };
                                units[index] = updatedUnit;
                                updatedStoredLists[activeList] = {
                                    ...updatedStoredLists[activeList],
                                    units,
                                };
                                return {
                                    ...state,
                                    storedLists: updatedStoredLists,
                                };
                            } else {
                                return state;
                            }
                        });
                    }
                },
                deleteNote: (unit: ListUnit, noteIndex: number) => {
                    const activeList = get().activeList;
                    if (get().hasActiveList()) {
                        set((state) => {
                            const updatedStoredLists = [...state.storedLists];
                            const units = [
                                ...updatedStoredLists[activeList].units,
                            ];
                            const index = units.findIndex(
                                (u) => u.id === unit.id,
                            );
                            if (index !== -1) {
                                const unitNotes = [
                                    ...(units[index].notes || []),
                                ];
                                unitNotes.splice(noteIndex, 1);
                                const updatedUnit = {
                                    ...units[index],
                                    notes: unitNotes,
                                };
                                units[index] = updatedUnit;
                                updatedStoredLists[activeList] = {
                                    ...updatedStoredLists[activeList],
                                    units,
                                };
                                return {
                                    ...state,
                                    storedLists: updatedStoredLists,
                                };
                            } else {
                                return state;
                            }
                        });
                    }
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
                                      arraysEqual(
                                          item.enhancements,
                                          curr.enhancements,
                                      ) &&
                                      arraysEqual(
                                          item.weapons ?? [],
                                          curr.weapons ?? [],
                                      ) &&
                                      arraysEqual(
                                          item.notes ?? [],
                                          curr.notes ?? [],
                                      ) &&
                                      item.attached_to_leader_id ===
                                          curr.attached_to_leader_id
                                  );
                              });
                              if (index !== -1) {
                                  acc[index].groupCount =
                                      (acc[index].groupCount || 1) + 1;
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
                        const splitType =
                            stratagem.type.split(" - ")[1] ?? stratagem.type;
                        return {
                            ...stratagem,
                            type: splitType,
                        };
                    })
                        .filter(
                            (stratagem) =>
                                stratagem.faction_id === faction ||
                                stratagem.detachment === "Core Rules",
                        )
                        .filter((stratagem) => {
                            return (
                                normalizeSpelling(stratagem.detachment) === normalizeSpelling(detachment ?? "") ||
                                stratagem.detachment === "Core Rules"
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
                        const splitType =
                            stratagem.type.split(" - ")[1] ?? stratagem.type;
                        return {
                            ...stratagem,
                            type: splitType,
                        };
                    })
                        .filter(
                            (stratagem) =>
                                stratagem.faction_id === faction ||
                                stratagem.detachment === "Core Rules",
                        )
                        .filter((stratagem) => {
                            return (
                                normalizeSpelling(stratagem.detachment) === normalizeSpelling(detachment ?? "") ||
                                stratagem.detachment === "Core Rules"
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
                    const detachment =
                        get().storedLists[get().activeList].detachment;

                    const filteredArmyAbilities = ArmyAbilities.filter(
                        (ability) => ability.faction_id === faction,
                    ).map((x) => ({
                        ...x,
                        type: "Army",
                        datasheet_id: "",
                        line: "",
                        ability_id: "",
                        model: "",
                        parameter: "",
                    }));

                    if (!detachment) {
                        return [...filteredArmyAbilities];
                    }

                    const filteredDetachmentAbilities =
                        DetachmentAbilities.filter(
                            (ability) =>
                                ability.faction_id === faction &&
                                normalizeSpelling(ability.detachment) === normalizeSpelling(detachment),
                        ).map((x) => ({
                            ...x,
                            type: "Detachment",
                            datasheet_id: "",
                            line: "",
                            ability_id: "",
                            model: "",
                            parameter: "",
                        }));

                    return [
                        ...filteredArmyAbilities,
                        ...filteredDetachmentAbilities,
                    ];
                },
                getListIndexByUUID(uuid) {
                    const index = get().storedLists.findIndex(
                        (list) => list.uuid === uuid,
                    );
                    return index;
                },
                // Method to attach a unit to a leader
                attachUnitToLeader: (listIndex, leaderId, unitId) => {
                    set((state) => {
                        if (listIndex === -1) return state;

                        const list = state.storedLists[listIndex];
                        const updatedUnits = list.units.map((unit) => {
                            // Update the leader unit
                            if (unit.id.toString() === leaderId) {
                                return {
                                    ...unit,
                                    attached_units: [
                                        ...(unit.attached_units || []),
                                        unitId,
                                    ],
                                };
                            }
                            // Update the unit being attached
                            if (unit.id.toString() === unitId) {
                                // If already attached to another leader, detach first
                                if (
                                    unit.attached_to_leader_id &&
                                    unit.attached_to_leader_id !== leaderId
                                ) {
                                    const previousLeader = list.units.find(
                                        (u) =>
                                            u.id.toString() ===
                                            unit.attached_to_leader_id,
                                    );
                                    if (
                                        previousLeader &&
                                        previousLeader.attached_units
                                    ) {
                                        const filteredUnits =
                                            previousLeader.attached_units.filter(
                                                (id) => id !== unitId,
                                            );
                                        previousLeader.attached_units =
                                            filteredUnits;
                                    }
                                }

                                return {
                                    ...unit,
                                    attached_to_leader_id: leaderId,
                                };
                            }
                            return unit;
                        });

                        const updatedList = {
                            ...list,
                            units: updatedUnits,
                            updated: new Date().toISOString(),
                        };

                        const updatedLists = [...state.storedLists];
                        updatedLists[listIndex] = updatedList;

                        return {
                            ...state,
                            storedLists: updatedLists,
                        };
                    });
                },

                // Method to detach a unit from its leader
                detachUnitFromLeader: (listIndex, unitId) => {
                    set((state) => {
                        if (listIndex === -1) return state;

                        const list = state.storedLists[listIndex];
                        const unitToDetach = list.units.find(
                            (unit) => unit.id.toString() === unitId,
                        );
                        if (
                            !unitToDetach ||
                            !unitToDetach.attached_to_leader_id
                        )
                            return state;

                        const leaderId = unitToDetach.attached_to_leader_id;

                        const updatedUnits = list.units.map((unit) => {
                            // Update the leader unit
                            if (unit.id.toString() === leaderId) {
                                return {
                                    ...unit,
                                    attached_units: (
                                        unit.attached_units || []
                                    ).filter((id) => id !== unitId),
                                };
                            }
                            // Update the unit being detached
                            if (unit.id.toString() === unitId) {
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                const { attached_to_leader_id, ...rest } = unit;
                                return rest;
                            }
                            return unit;
                        });

                        const updatedList = {
                            ...list,
                            units: updatedUnits,
                            updated: new Date().toISOString(),
                        };

                        const updatedLists = [...state.storedLists];
                        updatedLists[listIndex] = updatedList;

                        return {
                            ...state,
                            storedLists: updatedLists,
                        };
                    });
                },
                getAttachableUnits: (unitDatasheetId) => {
                    return LeaderAttachments.filter(
                        (attachment: LeaderAttachment) =>
                            attachment.leader_id === unitDatasheetId,
                    ).map(
                        (attachment: LeaderAttachment) =>
                            attachment.attached_id,
                    );
                },
                getLeadersForUnit: (leaderDatasheetId) => {
                    return LeaderAttachments.filter(
                        (attachment: LeaderAttachment) =>
                            attachment.attached_id === leaderDatasheetId,
                    ).map(
                        (attachment: LeaderAttachment) => attachment.leader_id,
                    );
                },
                toggleEditForceMode: (editForceMode: boolean) => {
                    set((state) => ({
                        settings: {
                            ...state.settings,
                            editForceMode,
                        },
                    }));
                },
            };
        },
        {
            name: "army-storage",
            storage: createJSONStorage(() => localStorage),
            version: getCurrentStateVersion(),
        },
    ),
);

export default useStore;
