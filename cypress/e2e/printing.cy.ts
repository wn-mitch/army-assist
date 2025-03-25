/// <reference types="cypress" />

describe("Printing Modal Test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#close-button").click();
    cy.contains("2K Tau List").click();
  });

  it("should open the printing modal", () => {
    cy.get('#print-button').click();
    cy.contains("Print Pages").should("be.visible");
  });

  it("should close the print pages modal with escape", () => {
    cy.get('#print-button').click();
    cy.contains("Print Pages").should("be.visible");
    cy.get('body').type('{esc}');
    cy.contains("Print Pages").should("not.exist");
  });
  
  it("should open the tau list then toggle all options without crashing", () => {
    cy.get('#print-button').click();
    cy.get('#Units-setting').click()
    cy.get('#Stratagems-setting').click()
    cy.get('#truncate-core-rules-setting').click()
    cy.get('#filter-core-stratagems-setting').click()
    cy.get('#Compact\\ -\\ Stratagems\\ are\\ displayed\\ at\\ the\\ end\\ with\\ their\\ phases\\ included\\ as\\ part\\ of\\ the\\ block-setting').click()
    cy.get('#Split\\ -\\ Stratagems\\ are\\ with\\ their\\ phased\\ units-setting').click()
  });
});
