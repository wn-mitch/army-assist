/// <reference types="cypress" />

describe("Stratagems modal tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#close-button").click();
    cy.contains("FNF Tau").click();
    cy.get('#open-stratagems-button').click();
  })
  
  it("should open the stratagem flyout, close it with escape, change phase, then see new stratagems", () => {
    cy.contains("COMMAND RE-ROLL")
    cy.contains("INSANE BRAVERY")
    cy.contains("FAIL-SAFE DETONATOR")
    cy.contains("EXPLOSIVE CLEARANCE").should("not.exist");
    cy.get('body').type('{esc}');

    cy.get('#Movement-button').click()
    cy.get('#open-stratagems-button').click();
    cy.contains("COMMAND RE-ROLL")
    cy.contains("FIRE OVERWATCH")
  });
  
  it("should click closed the stratagem flyout using the opaque section", () => {
    cy.contains("COMMAND RE-ROLL")
    cy.contains("INSANE BRAVERY")
    cy.contains("FAIL-SAFE DETONATOR")
    cy.contains("EXPLOSIVE CLEARANCE").should("not.exist");
    cy.get('.fixed.overflow-hidden > .inset-0').click()
    cy.contains("COMMAND RE-ROLL").should("not.be.visible")
  });
  
  it("should click closed the stratagem flyout using the X", () => {
    cy.wait(1000)
    cy.get("#stratagem-panel").should("exist")
    cy.get('#close-stratagem-panel-button').click();
    cy.wait(2000)
    cy.get("#stratagem-panel").should("not.exist")
  });
});
