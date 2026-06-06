/// <reference types="cypress" />

/**
 * Permanent regression guard for the destructive 11e save migration.
 *
 * Seeds localStorage with a pre-28 persisted blob in the OLD dual-model shape
 * (legacy `storedLists` with ListUnit-based units carrying notes/toggles) and a
 * stale state version. On load, the store's `migrate` must rebuild the saves as
 * native StoredRosters by re-importing each list's raw text and carrying the
 * per-unit app state (notes) across by unit-name match. A regression here would
 * silently drop users' saved lists or their notes — so this stays green.
 */

// A small valid NewRecruit-simple (ListForge text) list lifted from
// PreloadedLists.ts (the Lychguard text). Two "Lychguard" units.
const LychguardText = `Xenos - Necrons - Lychguard - [170 pts]

# ++ Army Roster ++ [170 pts]
## Configuration
Battle Size
Detachment Choice
Show/Hide Options: Legends are visible, Unaligned Forces are visible, Unaligned Fortifications are visible

## Infantry [170 pts]
Lychguard [85 pts]:
• 5x Lychguard: Warscythe
Lychguard [85 pts]:
• 5x Lychguard: Hyperphase sword and dispersion shield`;

const legacyPersisted = {
  state: {
    isFirstVisit: false,
    activeList: -1,
    currentSaveVersion: 27,
    settings: {
      listSort: "Name",
      cardsCollapse: true,
      showKeywords: true,
      isDarkMode: true,
      cardsGroup: true,
      weaponsFilter: true,
      truncateCoreRules: true,
      listDisplaySetting: true,
      editForceMode: false,
      activePhases: {
        Pregame: true,
        Command: true,
        Movement: true,
        Shooting: true,
        Charge: true,
        Fight: true,
        Saves: true,
      },
    },
    storedLists: [
      {
        uuid: "test-migration-uuid",
        text: LychguardText,
        textFormat: "listforge",
        name: "Migration Test List",
        units: [
          {
            id: 0,
            name: "Lychguard",
            toggled: true,
            count: {},
            groupCount: 1,
            points: null,
            datasheet_id: null,
            children: [],
            weapons: [],
            weaponsDatasheets: [],
            abilities: [],
            enhancements: [],
            datasheet: null,
            datasheetModel: null,
            keywords: "",
            notes: [
              {
                title: "my note",
                content: "remember this",
                phases: ["Command"],
              },
            ],
          },
        ],
        phase: "Pregame",
        faction: "NEC",
        detachment: null,
        created: "1",
        updated: "1",
      },
    ],
  },
  version: 27,
};

describe("Saved-list migration (pre-28 → native roster model)", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "army-storage",
          JSON.stringify(legacyPersisted),
        );
      },
    });
  });

  it("migrates the legacy list, renders its unit, and preserves the note", () => {
    // The migrated list appears on the dashboard by its original name.
    cy.contains("Migration Test List").should("exist");

    // Open it; the re-imported roster renders the Lychguard unit.
    cy.contains("Migration Test List").click();
    cy.contains("Lychguard").should("exist");

    // The carried note survives the migration. It is tagged to the Command
    // phase, so navigate there to surface it.
    cy.get("#Command-button").click();
    cy.contains("my note").should("exist");
    cy.contains("remember this").should("exist");
  });
});
