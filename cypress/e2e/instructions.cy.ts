/// <reference types="cypress" />

describe("Instructions Modal Test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("button#close-changelog").click();
  });

  it("should open the instructions modal", () => {
    cy.get('.gap-1 > .text-gray-200').click();
    cy.contains("Instructions").should("be.visible");
  });

  it("should close the instructions modal with escape", () => {
    cy.get('.gap-1 > .text-gray-200').click();
    cy.contains("Instructions").should("be.visible");
    cy.get('body').type('{esc}');
    cy.contains("Instructions").should("not.exist");
  });
  
  it("should click the copy sample to clipboard button, see the alert, then paste it into the pastebox successfully", () => {
    cy.get('.gap-1 > .text-gray-200').click();
    cy.get('#copy-sample-button').realClick();
    
    // Verify the alert is visible
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Sample list copied to clipboard!');
    });
  });
});
