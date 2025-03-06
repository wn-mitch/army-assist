/// <reference types="cypress" />

describe("Changelog Test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("button#close-changelog").click();
  });
  it("should open the changelog, check an entry, and close the changelog", () => {
    cy.get("#changelog-button").click();
    cy.get("#changelog-modal").should("be.visible");
    cy.get("#close-changelog").click();
    cy.get("#changelog-modal").should("not.exist");
  });

  it("should close the changelog modal with escape", () => {
    cy.get("#changelog-button").click();
    cy.get("#changelog-modal").should("be.visible");
    cy.get("body").type("{esc}");
    cy.get("#changelog-modal").should("not.exist");
  });
});
