/// <reference types="cypress" />

describe("Changelog Test", () => {
  describe("Active Phases Tests", () => {
    it("should paste in the fnf tau list and toggle off charge phase", () => {
      cy.pasteListWithArgument("nr_fnf_tau.txt");
      cy.contains("Fight")
      cy.get("#settings-button").click();
      cy.get(':nth-child(5) > .flex > .group > .appearance-none').click()
      cy.get(".mt-4 > .px-4").click();
      cy.contains("Fight").should("not.exist")
    });
  });
  describe("List Sort Order Tests", () => {
    it("should paste in the fnf tau list, see Breachers at the top, then toggle the option and see Farsight at the top", () => {
      cy.pasteListWithArgument("nr_fnf_tau.txt");
      cy.get('.columns-1 > :nth-child(1)').contains("Breacher Team");
      cy.get("#settings-button").click();
      cy.get(':nth-child(3) > .mt-2 > :nth-child(2) > .flex > .group > .appearance-none').click()
      cy.get(".mt-4 > .px-4").click();
      cy.get('.columns-1 > :nth-child(1)').contains("Commander Farsight");
    });
  });
  describe("Cards Collapse Tests", () => {
    it("Sees the card collapse button, then toggles the option and sees it disappear", () => {
      cy.pasteListWithArgument("broadsides.txt");
      cy.get('.group > :nth-child(1) > .justify-center').should("have.length", 1);
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(4) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get(".mt-4 > .px-4").click();
      cy.get('.group > :nth-child(1) > .justify-center').should("have.length", 0);
    });

  });
  describe("Grouping Tests", () => {
    it("should find 3x Broadsides", () => {
      cy.pasteListWithArgument("broadsides.txt");
      cy.contains("[3x]");
    });

    it("should find Broadside Battlesuits repeated 3x", () => {
      cy.pasteListWithArgument("broadsides.txt");
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(5) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get(".mt-4 > .px-4").click();
      cy.get(".columns-1").children().should("have.length", 3);
    });
  });
  describe("Keyword Tests", () => {
    it("should show keywords by default, then remove them", () => {
      cy.pasteListWithArgument("ancient_in_terminator_armor.txt");
      cy.contains("Adeptus Astartes, Deathwing, Infantry, Imperium, Character, Terminator, Ancient");
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(6) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get(".mt-4 > .px-4").click();
      cy.contains("Adeptus Astartes, Deathwing, Infantry, Imperium, Character, Terminator, Ancient").should("not.exist");
    });
  });
  describe("Filter Weapons", () => {
    it("Should show only the pasted weapons, then toggle the option off and see all weapons", () => {
      cy.pasteListWithArgument("ancient_in_terminator_armor.txt");
      cy.get("#settings-button").click();
    });
  });
  describe("Dark Mode Tests", () => {
    it("should be in dark mode by default, toggle to light mode, and then toggle back to dark mode", () => {
      cy.visit("/");
      cy.get("html").should("have.class", "dark");
      cy.get("#close-button").click();
      cy.get("#settings-button").click();
      cy.get(
        ":nth-child(8) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get("html").should("not.have.class", "dark");
      cy.get(
        ":nth-child(8) > .relative > .flex > .group > .appearance-none"
      ).click();
      cy.get("html").should("have.class", "dark");
    });
  });
});
