/// <reference types="cypress" />

describe("Detachment rules test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('#close-button').click()
  })

  it("should paste in the fnf tau list then ensure the detachment and army rule are visible", () => {
    cy.contains("FNF Tau").click()
    cy.get('#army-rule-button').click();
    cy.contains("No Army or Detachment Rule in Phase")
    cy.get("#Shooting-button").click();
    cy.contains("For the Greater Good - Army Rule")
    cy.contains("Bonded Heroes - Detachment Rule")
  });
  
  it("should paste in the csm list then ensure the wrong army rules are not visible", () => {
    cy.contains("CSM").click()
    cy.get('#army-rule-button').click();
    cy.contains("No Army or Detachment Rule in Phase")
    cy.contains("Oath of Moment").should("not.exist")
    cy.contains("Cabal of Sorcerors").should("not.exist")
    cy.contains("Blessings of Khorne").should("not.exist")
    cy.contains("Dark Pacts").should("not.exist")
    cy.contains("Marks of Chaos").should("not.exist")
    
    cy.get("#Movement-button").click();
    cy.contains("Dark Pacts").should("not.exist")
    cy.contains("Marks of Chaos").should("exist")

    cy.get("#Shooting-button").click();
    cy.contains("Dark Pacts").should("exist")
    cy.contains("Marks of Chaos").should("exist")
    cy.contains("Oath of Moment").should("not.exist")
    cy.contains("Cabal of Sorcerors").should("not.exist")
    cy.contains("Blessings of Khorne").should("not.exist")
    cy.contains("Nurgle's Gift (Aura)").should("not.exist")
  });

  it("should paste in the deathwatch list and see SM army rules", () => {
    cy.contains("Deathwatch Test").click()
    cy.get('#army-rule-button').click();
    cy.contains("Oath of Moment").should("exist")
  });
  
  it("should paste in the shield host list and see the detachment rules", () => {
    cy.contains("Custodes Shield Host").click()
    cy.get('#army-rule-button').click();
    cy.contains("Martial Mastery")
  });
});
