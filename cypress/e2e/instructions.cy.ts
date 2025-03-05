/// <reference types="cypress" />


describe("Instructions Modal Test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("button#close-changelog").click();
  });

  it("should open the instructions modal", () => {
    // Click the button or link that opens the instructions modal
    cy.get('.gap-1 > .text-gray-200').click();

    // Assert that the modal is visible
    cy.contains("Instructions & Changelog").should("be.visible");
  });

  it("should close the instructions modal with escape", () => {
    // Click the button or link that opens the instructions modal
    cy.get('.gap-1 > .text-gray-200').click();

    // Assert that the modal is visible
    cy.contains("Instructions & Changelog").should("be.visible");
// Press the Escape key to close the modal
    cy.get('body').type('{esc}');

    // Assert that the modal is no longer visible
    cy.contains("Instructions & Changelog").should("not.exist");
  });
});
