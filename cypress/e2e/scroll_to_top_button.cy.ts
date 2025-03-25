/// <reference types="cypress" />

describe("Scroll to Top Button", () => {
  it("should scroll to the bottom of the screen, hit the button, then be at the top of the screen", () => {
    cy.visit("/");
    cy.get("#close-button").click();
    cy.contains("2K Tau List").click();
    cy.scrollTo("bottom");
    cy.get("#scroll-to-top-button").click();
    cy.window().its("scrollY").should("equal", 0);
  });
});
