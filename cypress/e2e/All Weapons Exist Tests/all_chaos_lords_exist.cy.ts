/// <reference types="cypress" />

describe("Ensure all weapons listed in nr_chaos_knights are listed on either the Shooting or Fight phase pages", () => {
  beforeEach(() => {
    cy.pasteListWithArgument("enhancements.txt");
  });

  const shootingWeapons = [
    "Plasma Pistol"
  ];

  const fightWeapons = [
    "Daemon hammer",
    "Prime Test Subject",
    "Surgical Precision",
    "Chance for Glory",
  ];

  describe("Shooting phase weapons", () => {
    shootingWeapons.forEach(weapon => {
      it(`should find ${weapon} in the Shooting phase`, () => {
        cy.checkShootingPhase(weapon);
      });
    });
  });

  describe("Find Enhancement Abilities", () => {
    it("Should find Helm of All Seeing in the Movement phase", () => {
      cy.get("#headlessui-radio-\\:rc\\:").click();
      cy.contains(new RegExp("Helm of All-seeing", "i")).should("exist");
    });
    it("Should find Living Carapace in the Saves phase", () => {
      cy.get("#headlessui-radio-\\:rg\\:").click();
      cy.contains(new RegExp("Living Carapace", "i")).should("exist");
    });
  })

  describe("Fight phase weapons", () => {
    fightWeapons.forEach(weapon => {
      it(`should find ${weapon} in the Fight phase`, () => {
        cy.checkFightPhase(weapon);
      });
    });
  });
});