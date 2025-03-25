/// <reference types="cypress" />

describe.only("Verify that the name specific overrides are working", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('#close-button').click()
  })

  describe("Name Specific Unit Overrides", () => {
    it("should find Ancient in Terminator Armour", () => {
      cy.contains("Ancient in Terminator Armor").click()
      cy.contains('Ancient in Terminator Armour')
    });
    
    it("should find Wraithblade Weapons", () => {
      cy.checkFightPhase("Wraithblade", "Ghostaxe")
    });
    
    it("should find Piranhas", () => {
      cy.contains("Piranhas").click()
      cy.contains('Piranhas')
    });
  });
});
