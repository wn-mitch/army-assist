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
  
  it("should paste in the csm list then ensure the wrong army rules are not visible", () => {
    cy.pasteListWithArgument("nr_csm_detachment_rules.txt");
    cy.get('#headlessui-disclosure-button-\\:rh\\:').click();
    cy.contains("No Army or Detachment Rule in Phase")
    cy.contains("Oath of Moment").should("not.exist")
    cy.contains("Cabal of Sorcerors").should("not.exist")
    cy.contains("Blessings of Khorne").should("not.exist")
    cy.contains("Dark Pacts").should("not.exist")
    cy.contains("Marks of Chaos").should("not.exist")
    
    cy.get("#headlessui-radio-\\:rc\\:").click();
    cy.contains("Dark Pacts").should("not.exist")
    cy.contains("Marks of Chaos").should("exist")

    cy.get("#headlessui-radio-\\:rd\\:").click();
    cy.contains("Dark Pacts").should("exist")
    cy.contains("Marks of Chaos").should("exist")
    cy.contains("Oath of Moment").should("not.exist")
    cy.contains("Cabal of Sorcerors").should("not.exist")
    cy.contains("Blessings of Khorne").should("not.exist")
    cy.contains("Nurgle's Gift (Aura)").should("not.exist")
  });
});
