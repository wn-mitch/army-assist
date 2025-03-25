/// <reference types="cypress" />

describe("Ensure all weapons listed in enhancements are listed on either the Shooting or Fight phase pages", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#close-button").click();
  });

  const shootingWeapons = ["Plasma Pistol"];

  const fightWeapons = [
    "Daemon hammer",
    "Prime Test Subject",
    "Surgical Precision",
    "Chance for Glory",
  ];

  describe("Shooting phase weapons", () => {
    shootingWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Shooting phase`, () => {
        cy.checkShootingPhase("Enhancements", weapon);
      });
    });
  });

  describe("Find Enhancement Abilities", () => {
    it("Should find Helm of All Seeing in the Movement phase", () => {
      cy.checkMovementPhase("Enhancements", "Helm of All-seeing");
    });
    it("Should find Living Carapace in the Saves phase", () => {
      cy.checkSavesPhase("Enhancements", "Living Carapace");
    });
  });

  describe("Fight phase weapons", () => {
    fightWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Fight phase`, () => {
        cy.checkFightPhase("Enhancements", weapon);
      });
    });
  });
});
