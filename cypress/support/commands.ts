/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("pasteListWithArgument", (filename: string) => {
  // Read the text from the file
  cy.readFile(`src/assets/lists/${filename}`).then((text) => {
    const normalizedText = text.replace(/\r\n/g, "\n");
    cy.get("#add-list-button").click();

    // Find the Pastebox textarea and paste the text into it
    cy.get("textarea#comment")
      .type(normalizedText, {
        delay: 0,
        parseSpecialCharSequences: false,
      })
      .then(() => {
        cy.get("button[type='submit']").click();
      });
  });
});

Cypress.Commands.add("checkCommandPhase", (listName:string, weapon: string) => {
  cy.contains(listName).click()
  cy.get("#Command-button").click();
  cy.contains(new RegExp(weapon, "i")).should("exist");
});

Cypress.Commands.add("checkMovementPhase", (listName:string, weapon: string) => {
  cy.contains(listName).click()
  cy.get("#Movement-button").click();
  cy.contains(new RegExp(weapon, "i")).should("exist");
});

Cypress.Commands.add("checkShootingPhase", (listName:string, weapon: string) => {
  cy.contains(listName).click()
  cy.get("#Shooting-button").click();
  cy.contains(new RegExp(weapon, "i")).should("exist");
});

Cypress.Commands.add("checkChargePhase", (listName:string, weapon: string) => {
  cy.contains(listName).click()
  cy.get("#Charge-button").click();
  cy.contains(new RegExp(weapon, "i")).should("exist");
});

Cypress.Commands.add("checkFightPhase", (listName: string,weapon: string) => {
  cy.contains(listName).click()
  cy.get("#Fight-button").click();
  cy.contains(new RegExp(weapon, "i")).should("exist");
});

Cypress.Commands.add("checkSavesPhase", (listName: string,weapon: string) => {
  cy.contains(listName).click()
  cy.get("#Saves-button").click();
  cy.contains(new RegExp(weapon, "i")).should("exist");
});