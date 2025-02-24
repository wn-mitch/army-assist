/// <reference types="cypress" />

describe.only("Verify that the name specific overrides are working", () => {
  describe("Name Specific Unit Overrides", () => {
    it("should find Ancient in Terminator Armour", () => {
      cy.pasteListWithArgument("ancient_in_terminator_armor.txt");
      cy.contains('Ancient in Terminator Armour')
    });
    
    it("should find Wraithblade Weapons", () => {
      cy.pasteListWithArgument("wraithblade.txt");
      cy.checkFightPhase("Ghostaxe")
    });
    
    it("should find Piranhas", () => {
      cy.pasteListWithArgument("piranhas.txt");
      cy.contains('Piranhas')
    });
  });
});
