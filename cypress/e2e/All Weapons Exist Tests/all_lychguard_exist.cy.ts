/// <reference types="cypress" />

describe("Verify all Lychguard weapons exist", () => {
  beforeEach(() => {
    cy.pasteListWithArgument("lychguard.txt");
  });

  const fightWeapons = [
    "Warscythe",
    "Hyperphase sword"
  ];

  describe("Fight phase weapons", () => {
    fightWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Fight phase`, () => {
        cy.checkFightPhase(weapon);
      });
    });
  });
});