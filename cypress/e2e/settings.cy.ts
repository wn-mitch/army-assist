/// <reference types="cypress" />

describe("Settings Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#close-button").click();
  })

  describe("Basic Functions", () => {
    it("should open the settings modal", () => {
      cy.get("#settings-button").click();
      cy.contains("Settings").should("exist");
    });
    it("should close the settings modal with escape", () => {
      cy.get("#settings-button").click();
      cy.get("body").type("{esc}");
      cy.contains("Settings").should("not.exist");
    });
  });
  describe("Active Phases Tests", () => {
    it("should paste in the fnf tau list and toggle off charge phase", () => {
      cy.contains("2K Tau List").click();
      cy.get("#Charge-button").should("exist");
      cy.get("#reset-button").click();
      cy.get("#settings-button").click();
      cy.get(":nth-child(5) > .flex > .group > .appearance-none").click();
      cy.get(".mt-4 > .px-4").click();
      cy.contains("2K Tau List").click();
      cy.get("#Charge-button").should("not.exist");
    });
  });
  describe("List Sort Order Tests", () => {
    it("should paste in the fnf tau list, see Breachers at the top, then toggle the option and see Farsight at the top", () => {
      cy.contains("FNF Tau").click();
      cy.get(".columns-1 > :nth-child(1)").contains("Breacher Team");
      cy.get("#reset-button").click();
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(3) > .mt-2 > :nth-child(2) > .flex > .group > .appearance-none"
      ).click();
      cy.get(".mt-4 > .px-4").click();
      cy.contains("2K Tau List").click();
      cy.get(".columns-1 > :nth-child(1)").contains("Commander Farsight");
    });
  });
  describe("Cards Collapse Tests", () => {
    it("Sees the card collapse button, then toggles the option and sees it disappear", () => {
      cy.contains("Broadsides").click();
      cy.get(".group > :nth-child(1) > .justify-center").should(
        "have.length",
        1
      );
      cy.get("#reset-button").click();
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(4) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get(".mt-4 > .px-4").click();
      cy.contains("Broadsides").click();
      cy.get(".group > :nth-child(1) > .justify-center").should(
        "have.length",
        0
      );
    });
  });
  describe("Grouping Tests", () => {
    it("should find 3x Broadsides", () => {
      cy.contains("Broadsides").click();
      cy.contains("[3x]");
    });

    it("should find Broadside Battlesuits repeated 3x", () => {
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(5) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get(".mt-4 > .px-4").click();
      cy.contains("Broadsides").click();
      cy.get(".columns-1").children().should("have.length", 3);
    });

    it("should toggle then untoggle the option, then find Broadside Battlesuits repeated 3x", () => {
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(5) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get(
        ":nth-child(5) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get(".mt-4 > .px-4").click();
      cy.contains("Broadsides").click();
      cy.contains("[3x]");
    });
  });
  describe("Keyword Tests", () => {
    it("should show keywords by default, then remove them", () => {
      cy.contains("Ancient in Terminator Armor").click();
      cy.contains(
        "Infantry, Character, Imperium, Terminator, Ancient, Adeptus Astartes"
      );
      cy.get("#reset-button").click();
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(6) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get(".mt-4 > .px-4").click();
      cy.contains("Ancient in Terminator Armor").click();
      cy.contains(
        "Infantry, Character, Imperium, Terminator, Ancient, Adeptus Astartes"
      ).should("not.exist");
    });
  });
  describe("Filter Weapons", () => {
    it("Should show only the pasted weapons, then toggle the option off and see all weapons", () => {
      cy.contains("Ancient in Terminator Armor").click()
      cy.get("#Fight-button").click();
      cy.contains(new RegExp("Chainfist", "i")).should("not.exist");
      cy.get("#reset-button").click();
      cy.get("#settings-button").click();
      cy.get(':nth-child(7) > .relative > .flex > .group > .appearance-none').click();
      cy.get(".mt-4 > .px-4").click();
      cy.checkFightPhase("Ancient in Terminator Armor", "Chainfist");
    });
  });
  describe("Truncate core rules test", () => {
    it("should see the core rules, toggle the setting, then see them disappear", () => {
      cy.contains("2K Tau List").click();
      // Core abilities (e.g. Stealth Battlesuits' Infiltrators) surface on the
      // Pregame screen and are truncated to "See Core Rules" by default.
      cy.contains("See Core Rules").should("exist");
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(8) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get(".mt-4 > .px-4").click();
      // With truncation off, the DSL-derived ability text is shown instead.
      cy.contains("See Core Rules").should("not.exist");
      cy.contains("unit gains infiltrate").should("exist");
    });
  });
  describe("Dark Mode Tests", () => {
    it("should be in dark mode by default, toggle to light mode, and then toggle back to dark mode", () => {
      cy.visit("/");
      cy.get("html").should("have.class", "dark");
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(9) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get("html").should("not.have.class", "dark");
      cy.get(
        ":nth-child(9) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get("html").should("have.class", "dark");
    });
  });
});
