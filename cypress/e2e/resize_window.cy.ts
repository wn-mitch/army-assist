/// <reference types="cypress" />

describe("Resize window test", () => {
  it("should paste in the fnf tau list then do some window resizing at various breakpoints", () => {
    cy.pasteListWithArgument("nr_fnf_tau.txt");
    cy.viewport("iphone-8", "portrait");
    cy.get('#collapsed-phases').should("exist")
    cy.viewport("ipad-2", "portrait");
    cy.get('#collapsed-phases').should("exist")
    cy.viewport("macbook-13", "portrait");
    cy.get('#collapsed-phases').should("not.exist")
    cy.viewport("macbook-16", "portrait");
    cy.get('#collapsed-phases').should("not.exist")
  });
});
