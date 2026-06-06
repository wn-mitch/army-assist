/// <reference types="cypress" />

describe("Stratagems modal tests", () => {
  beforeEach(() => {
    // Start from the seeded default state every time. The persisted zustand
    // store otherwise carries over the active list's phase (and an open panel)
    // from a prior test/spec, which races with the phase switch below.
    cy.clearLocalStorage();
    cy.visit("/");
    cy.get("#close-button").click();
    cy.contains("FNF Tau").click();
    // Lists open on the Pregame screen, which has no stratagems — enter the
    // Command phase before opening the panel. Assert the phase is selected
    // before opening so the Command-phase stratagems are computed first.
    cy.get("#Command-button").click();
    cy.get('#open-stratagems-button').click();
    // Ensure the panel has fully opened and its Command-phase stratagems have
    // painted before each test body runs, so tests never race the panel's
    // open transition / initial population. Gate on the panel being visible
    // (not merely present mid-transition) and a Command stratagem being
    // visible inside it.
    cy.get("#stratagem-panel").should("be.visible");
    cy.contains("COMMAND RE-ROLL").should("be.visible");
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
