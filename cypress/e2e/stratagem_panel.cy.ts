/// <reference types="cypress" />

describe("Stratagems modal tests", () => {
  it("should open the stratagem flyout, close it with escape, change phase, then see new stratagems", () => {
    cy.pasteListWithArgument("nr_fnf_tau.txt");
    cy.get('#open-stratagems-button').click();
    cy.contains("COMMAND RE-ROLL")
    cy.contains("INSANE BRAVERY")
    cy.contains("FAIL-SAFE DETONATOR")
    cy.contains("EXPLOSIVE CLEARANCE").should("not.exist");
    cy.get('body').type('{esc}');

    cy.get('#headlessui-radio-\\:rc\\:').click()
    cy.get('#open-stratagems-button').click();
    cy.contains("COMMAND RE-ROLL")
    cy.contains("FIRE OVERWATCH")
  });
});
