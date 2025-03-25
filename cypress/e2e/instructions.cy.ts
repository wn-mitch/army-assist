/// <reference types="cypress" />

describe("Instructions Modal Test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("button#close-changelog").click();
    cy.get('#instructions-button').click();
  });

  it("should open the instructions modal", () => {
    cy.contains("Instructions").should("be.visible");
  });

  it("should close the instructions modal with escape", () => {
    cy.get('body').type('{esc}');
    cy.contains("Instructions").should("not.exist");
  });

  it("should open the patreon link", () => {
    cy.get("#patreon-link").click()
  });
  
  it("should open the discord link", () => {
    cy.get("#discord-link").click()
  });
  
  it("should open the linkedin link", () => {
    cy.get("#linkedin-link").click()
  });
});
