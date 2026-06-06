/// <reference types="cypress" />

// Army/detachment rule names assert against the 40kdc 11e dataset. Faction
// rules currently carry no phase mappings, so they show in every game phase
// (and never on the UI-only Pregame/Saves screens).
//
// Upstream TODOs this spec works around:
// - retaliation-cadre/kauyon detachment rules unlinked (no "Bonded Heroes")
// - adeptus-custodes faction rule ability (martial-katah) not yet authored
// - NR-simple "Detachments:" (plural) config key unparsed, so the shield
//   host list resolves faction but not detachment
describe("Detachment rules test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('#close-button').click()
  })

  it("should paste in the fnf tau list then ensure the army rule is visible", () => {
    cy.contains("FNF Tau").click()
    cy.get('#army-rule-button').click();
    cy.contains("No Army or Detachment Rule in Phase")
    cy.get("#Shooting-button").click();
    cy.contains("For the Greater Good - Army Rule")
  });

  it("should paste in the csm list then ensure the wrong army rules are not visible", () => {
    cy.contains("CSM").click()
    cy.get('#army-rule-button').click();
    cy.contains("No Army or Detachment Rule in Phase")
    cy.contains("Oath of Moment").should("not.exist")
    cy.contains("For the Greater Good").should("not.exist")
    cy.contains("Dark Pacts").should("not.exist")

    cy.get("#Shooting-button").click();
    cy.contains("Dark Pacts").should("exist")
    cy.contains("Oath of Moment").should("not.exist")
    cy.contains("For the Greater Good").should("not.exist")
  });

  it("should paste in the deathwatch list and see SM army rules", () => {
    cy.contains("Deathwatch Test").click()
    cy.get('#army-rule-button').click();
    cy.get("#Shooting-button").click();
    cy.contains("Oath of Moment").should("exist")
  });

  it("should paste in the shield host list and resolve the faction name", () => {
    cy.contains("Custodes Shield Host").click()
    // The faction name resolves from the dataset onto the rule banner.
    cy.get('#army-rule-button').contains("Adeptus Custodes")
  });
});
