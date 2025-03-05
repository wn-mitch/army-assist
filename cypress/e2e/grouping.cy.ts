/// <reference types="cypress" />

describe.only("Verify that the grouping setting is working", () => {
  it("should find 3x Broadsides", () => {
    cy.pasteListWithArgument("broadsides.txt");
    cy.contains("[3x]");
  });

  it("should find Broadside Battlesuits repeated 3x", () => {
    cy.pasteListWithArgument("broadsides.txt");
    cy.get('#settings-button').click()
    cy.get(':nth-child(5) > .relative > .flex > .group > .appearance-none').click()
    cy.get('.mt-4 > .px-4').click()
    cy.get('.columns-1').children().should("have.length", 3)
  });
});
