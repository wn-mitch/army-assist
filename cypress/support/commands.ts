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

Cypress.Commands.add('pasteListWithArgument', (filename: string) => {
  // Read the text from the file
  cy.readFile(`cypress/lists/${filename}`).then((text) => {
    // Normalize newlines in the text from the file
    const normalizedText = text.replace(/\r\n/g, "\n");

    // Visit the application page
    cy.visit("/");

    // Find the Pastebox textarea and paste the text into it
    cy.get("textarea#comment").type(normalizedText, {
      delay: 0,
      parseSpecialCharSequences: false,
    });

    // Optionally, you can add assertions to verify the text was pasted correctly
    cy.get("textarea#comment")
      .invoke("val")
      .then((val) => {
        // Normalize newlines in the value from the textarea
        const normalizedVal = val.replace(/\r\n/g, "\n");
        expect(normalizedVal.trim()).to.equal(normalizedText.trim());
      });
  });
});
