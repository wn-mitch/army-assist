import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 } from "uuid";

import Phase from "@/types/Phase";
import SortOptions from "@/types/SortOptions";
import Note from "@/types/Note";

import { getCurrentStateVersion } from "@/utils/VersionHelper";
import Settings from "@/types/Settings";
import { testingPreload } from "@/utils/PreloadedLists";
import StoredRoster, { UnitOverlay } from "@/types/StoredRoster";
import type { Stratagem as GameStratagem, AbilityView } from "@/data/dataset";
import {
    buildStoredRoster,
    rosterUnitRows,
    stratagemsForPhase,
    armyAbilities,
    unitName,
    type RosterUnitRow,
} from "@/data/rosterSelectors";

interface StoreState {
    isFirstVisit: boolean;
    /**
     * Native roster model (40kdc Roster + app overlay). The only saved-list
     * model — the legacy ListUnit/StoredList path was removed.
     */
    storedRosters: StoredRoster[];
    activeList: number;
    settings: Settings;
    currentSaveVersion: number;
    reset: () => void;
    addList: (text?: string) => void;
    hasActiveList: () => boolean;
    setActiveList: (uuid: string) => void;
    editListName: (uuid: string, listName: string) => void;
    editList: (uuid: string, listName: string, listText: string) => void;
    deleteList: (uuid: string) => void;
    refreshArmy: (uuid: string) => void;
    /**
     * Import (or reparse) pasted text into the native roster model at the
     * active/uuid index. Returns false when the import produced no roster so
     * the caller can alert; the failed StoredRoster is still stored so the raw
     * text is preserved for a later retry.
     */
    parseText: (text: string, name: string, uuid?: string) => boolean;
    setPhase: (phase: Phase) => void;
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
    /** User-attach a unit to a leader by their roster indices. */
    attachRosterUnit: (unitIndex: number, leaderIndex: number) => void;
    /** User-detach a unit from any leader (explicit detach). */
    detachRosterUnit: (unitIndex: number) => void;
    getListIndexByUUID: (uuid: string | undefined) => number;
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
                storedRosters: testingPreload.map((list) => ({
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
                    // Drop a throwaway list created via "add list" that the
                    // user never populated. Only pop when the active list is the
                    // last entry and has neither parsed roster units nor any raw
                    // text to reparse, so preloaded/saved lists are never
                    // discarded.
                    const activeIndex = get().activeList;
                    const rosters = get().storedRosters;
                    if (
                        activeIndex >= 0 &&
                        activeIndex === rosters.length - 1
                    ) {
                        const roster = rosters[activeIndex];
                        const rosterUnitCount =
                            roster?.roster?.units?.length ?? 0;
                        const hasRawText = !!roster?.rawText?.trim();
                        const isEmptyThrowaway =
                            rosterUnitCount === 0 && !hasRawText;
                        if (isEmptyThrowaway) {
                            get().storedRosters.pop();
                        }
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
                    const stored: StoredRoster = {
                        ...buildStoredRoster(
                            text || "",
                            text ? "Imported List" : "",
                        ),
                        uuid: v4(),
                    };
                    const newStoredRosters = [...get().storedRosters, stored];
                    set({ storedRosters: newStoredRosters });
                    get().setActiveList(stored.uuid);
                },
                editListName: (uuid: string, listName: string) => {
                    const listIndex = get().getListIndexByUUID(uuid);
                    set((state) => {
                        const updatedStoredRosters = [...state.storedRosters];
                        const roster = updatedStoredRosters[listIndex];
                        if (roster) {
                            updatedStoredRosters[listIndex] = {
                                ...roster,
                                name: listName,
                                updated: Date.now().toString(),
                            };
                        }
                        return { storedRosters: updatedStoredRosters };
                    });
                },
                editList: (
                    uuid: string,
                    listName: string,
                    listText: string,
                ) => {
                    // Reparse the list from the new text, carrying the new name.
                    get().parseText(listText, listName, uuid);
                },
                deleteList: (uuid: string) => {
                    const listIndex = get().getListIndexByUUID(uuid);
                    set((state) => ({
                        storedRosters: state.storedRosters.filter(
                            (_, index) => index !== listIndex,
                        ),
                    }));
                },
                refreshArmy: (uuid: string) => {
                    const listIndex = get().getListIndexByUUID(uuid);
                    const stored = get().storedRosters[listIndex];
                    if (!stored) return;
                    get().parseText(stored.rawText, stored.name ?? "", uuid);
                },
                parseText: (
                    text: string,
                    name: string,
                    uuid?: string,
                ): boolean => {
                    const activeList = get().activeList;
                    const listIndex = get().getListIndexByUUID(uuid);
                    const index = activeList >= 0 ? activeList : listIndex;
                    if (index < 0 || index >= get().storedRosters.length) {
                        return false;
                    }
                    const previous = get().storedRosters[index];
                    const stored = buildStoredRoster(text, name, previous);
                    const updated = [...get().storedRosters];
                    updated[index] = {
                        ...stored,
                        uuid: previous?.uuid ?? stored.uuid,
                    };
                    set({ storedRosters: updated });
                    return stored.roster !== null;
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
                        notes: overlay.notes.filter((_, i) => i !== noteIndex),
                    }));
                },
                attachRosterUnit: (
                    unitIndex: number,
                    leaderIndex: number,
                ) => {
                    updateRosterOverlay(unitIndex, (overlay) => ({
                        ...overlay,
                        attachedToLeaderIndex: leaderIndex,
                    }));
                },
                detachRosterUnit: (unitIndex: number) => {
                    updateRosterOverlay(unitIndex, (overlay) => ({
                        ...overlay,
                        attachedToLeaderIndex: null,
                    }));
                },
                setPhase: (phase: Phase) => {
                    const activeList = get().activeList;
                    if (get().hasActiveList()) {
                        set((state) => {
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
                            return { storedRosters: updatedStoredRosters };
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
                        settings: { ...state.settings, listSort },
                    }));
                },
                setCardsCollapse: (cardsCollapse: boolean) => {
                    set((state) => ({
                        settings: { ...state.settings, cardsCollapse },
                    }));
                },
                setShowKeywords: (showKeywords: boolean) => {
                    set((state) => ({
                        settings: { ...state.settings, showKeywords },
                    }));
                },
                setIsDarkMode: (isDarkMode: boolean) => {
                    set((state) => ({
                        settings: { ...state.settings, isDarkMode },
                    }));
                },
                setCardsGroup: (cardsGroup: boolean) => {
                    set((state) => ({
                        settings: { ...state.settings, cardsGroup },
                    }));
                },
                setWeaponsFilter: (weaponsFilter: boolean) => {
                    set((state) => ({
                        settings: { ...state.settings, weaponsFilter },
                    }));
                },
                setTruncateCoreRules: (truncateCoreRules: boolean) => {
                    set((state) => ({
                        settings: { ...state.settings, truncateCoreRules },
                    }));
                },
                setListDisplaySetting: (listDisplaySetting: boolean) => {
                    set((state) => ({
                        settings: { ...state.settings, listDisplaySetting },
                    }));
                },
                getListIndexByUUID(uuid) {
                    return get().storedRosters.findIndex(
                        (list) => list.uuid === uuid,
                    );
                },
                toggleEditForceMode: (editForceMode: boolean) => {
                    set((state) => ({
                        settings: { ...state.settings, editForceMode },
                    }));
                },
            };
        },
        {
            name: "army-storage",
            storage: createJSONStorage(() => localStorage),
            version: getCurrentStateVersion(),
            migrate: migrateState,
        },
    ),
);

/* ---------------------------------------------------------------------------
 * Persisted-state migration.
 *
 * Versions < 28 carried a legacy dual model: `storedLists` (ListUnit-based,
 * the deleted path) and possibly-sparse `storedRosters`. The native model is
 * now the only one. We rebuild every saved list as a StoredRoster by
 * re-importing its original raw text — the most robust path across a data-layer
 * swap — and carry forward per-unit app state (notes, toggles) by matching unit
 * names. The migration NEVER throws: a per-list failure degrades to a
 * roster: null entry that preserves the raw text for a later retry, so a single
 * bad list can't wipe the user's storage.
 * ------------------------------------------------------------------------- */

interface LegacyNote {
    title?: string;
    content?: string;
    phases?: string[];
}

interface LegacyUnit {
    name?: string;
    toggled?: boolean;
    notes?: LegacyNote[];
}

interface LegacyList {
    uuid?: string;
    text?: string;
    name?: string;
    phase?: string;
    created?: string;
    updated?: string;
    units?: LegacyUnit[];
}

interface PersistedLegacyState {
    storedLists?: LegacyList[];
    storedRosters?: (StoredRoster | undefined)[];
    [key: string]: unknown;
}

/**
 * Carry per-unit app state from legacy units onto a freshly built roster's
 * overlays. For each legacy unit carrying notes/toggle state, find the first
 * not-yet-claimed roster unit whose resolved name OR raw import name matches
 * (case-insensitively) and write its overlay. Existing overlay state on the
 * built roster wins when present (an in-flight reparse already carried it).
 */
function carryLegacyUnitState(
    stored: StoredRoster,
    legacyUnits: LegacyUnit[],
): UnitOverlay[] {
    const roster = stored.roster;
    if (!roster) return stored.unitState;

    const rows = rosterUnitRows(stored);
    const overlays = roster.units.map((_, i) => {
        const existing = stored.unitState[i];
        return existing
            ? { ...existing, notes: [...(existing.notes ?? [])] }
            : { toggled: true, notes: [] as Note[] };
    });

    // Per-unit lower-cased match keys: resolved view name + raw import name.
    const matchKeys: string[][] = rows.map((row) => {
        const keys = new Set<string>();
        keys.add(unitName(row).toLowerCase());
        if (row.rosterUnit.ref.raw_name) {
            keys.add(row.rosterUnit.ref.raw_name.toLowerCase());
        }
        return [...keys];
    });

    const claimed = new Set<number>();
    for (const legacy of legacyUnits) {
        const legacyName = legacy?.name?.toLowerCase();
        if (!legacyName) continue;
        const hasState =
            (legacy.notes && legacy.notes.length > 0) ||
            legacy.toggled !== undefined;
        if (!hasState) continue;

        const matchIndex = roster.units.findIndex((_, i) => {
            if (claimed.has(i)) return false;
            return matchKeys[i].includes(legacyName);
        });
        if (matchIndex === -1) continue;
        claimed.add(matchIndex);

        const carried: Note[] = (legacy.notes ?? []).map((n) => ({
            title: n.title ?? "",
            content: n.content ?? "",
            phases: (n.phases ?? []) as Note["phases"],
        }));
        overlays[matchIndex] = {
            ...overlays[matchIndex],
            toggled:
                legacy.toggled !== undefined
                    ? legacy.toggled
                    : overlays[matchIndex].toggled,
            // Existing carried overlay notes (from a reparse) win; otherwise
            // adopt the legacy unit's notes.
            notes:
                overlays[matchIndex].notes.length > 0
                    ? overlays[matchIndex].notes
                    : carried,
        };
    }
    return overlays;
}

function toPhase(value: unknown): Phase {
    if (
        typeof value === "string" &&
        (Object.values(Phase) as string[]).includes(value)
    ) {
        return value as Phase;
    }
    return Phase.Pregame;
}

function migrateState(
    persisted: unknown,
    version: number,
): PersistedLegacyState {
    const state = (persisted ?? {}) as PersistedLegacyState;
    if (version >= 28) {
        // Already native; just drop any stray legacy key.
        const { storedLists: _legacy, ...rest } = state;
        void _legacy;
        return rest;
    }

    const legacyLists = Array.isArray(state.storedLists)
        ? state.storedLists
        : [];
    const existingRosters = Array.isArray(state.storedRosters)
        ? state.storedRosters
        : [];

    // The number of saved lists is the max of either legacy array — both should
    // be index-aligned, but tolerate sparseness from the dual-write era.
    const count = Math.max(legacyLists.length, existingRosters.length);
    const rebuilt: StoredRoster[] = [];

    for (let i = 0; i < count; i++) {
        const legacy = legacyLists[i];
        const existing = existingRosters[i];
        const rawText = legacy?.text ?? existing?.rawText ?? "";
        try {
            // Regenerate from text (data may be stale 10e). Carry the existing
            // roster overlay so a reparse keeps in-app state; that overlay then
            // wins over legacy-unit carry inside carryLegacyUnitState.
            const built = buildStoredRoster(
                rawText,
                legacy?.name ?? existing?.name ?? "",
                existing ?? undefined,
            );
            const unitState = legacy?.units
                ? carryLegacyUnitState(built, legacy.units)
                : built.unitState;
            rebuilt.push({
                ...built,
                uuid: legacy?.uuid ?? existing?.uuid ?? built.uuid,
                phase: legacy?.phase
                    ? toPhase(legacy.phase)
                    : (existing?.phase ?? built.phase),
                created:
                    legacy?.created ?? existing?.created ?? built.created,
                unitState,
            });
        } catch (err) {
            rebuilt.push({
                uuid: legacy?.uuid ?? existing?.uuid ?? v4(),
                rawText,
                roster: null,
                importFailure: {
                    reason: "migration-failed",
                    message: String(err),
                },
                name: legacy?.name ?? existing?.name,
                phase: toPhase(legacy?.phase ?? existing?.phase),
                unitState: [],
                created:
                    legacy?.created ??
                    existing?.created ??
                    Date.now().toString(),
                updated: Date.now().toString(),
            });
        }
    }

    const { storedLists: _legacy, ...rest } = state;
    void _legacy;
    return { ...rest, storedRosters: rebuilt };
}

export default useStore;
