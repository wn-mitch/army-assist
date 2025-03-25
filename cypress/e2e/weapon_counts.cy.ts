/// <reference types="cypress" />

describe("Weapon Counts Test", () => {
  it("should see the correct weapon counts in the shooting phase", () => {
    cy.visit("/");
    cy.get("#close-button").click();
      cy.contains("Count Test List").click();
    cy.get("#Shooting-button").click();
    cy.get(':nth-child(1) > .gap-1 > :nth-child(1) > .overflow-x-auto > .table-auto > tbody > :nth-child(1) > :nth-child(3)').contains("10")
    cy.get('tbody > :nth-child(3) > :nth-child(3)').contains("1");
    cy.get(':nth-child(2) > .gap-1 > :nth-child(1) > .overflow-x-auto > .table-auto > tbody > .border > :nth-child(3)').contains("1")
    cy.get(':nth-child(3) > .gap-1 > :nth-child(1) > .overflow-x-auto > .table-auto > tbody > :nth-child(1) > :nth-child(3)').contains("2")
  });
});
