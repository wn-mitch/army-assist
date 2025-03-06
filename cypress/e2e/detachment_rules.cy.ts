/// <reference types="cypress" />

describe("Detachment rules test", () => {
  it("should paste in the fnf tau list then ensure the detachment and army rule are visible", () => {
    cy.pasteListWithArgument("nr_fnf_tau.txt");
    cy.get('#headlessui-disclosure-button-\\:rh\\:').click();
    cy.contains("No Army or Detachment Rule in Phase")
    cy.get("#headlessui-radio-\\:rd\\:").click();
    cy.contains("For the Greater Good - Army Rule")
    cy.contains("Bonded Heroes - Detachment Rule")
  });
});
