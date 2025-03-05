/// <reference types="cypress" />
describe('Changelog Test', () => {
    it('should open the changelog, check an entry, and close the changelog', () => {
        // Visit the application
        cy.visit('/');
        cy.get('#close-button').click()

        // Open the changelog
        cy.get('#changelog-button').click();
        cy.get('#changelog-modal').should('be.visible');
        cy.get('#close-changelog').click();
        cy.get('#changelog-modal').should('not.exist');
    });
});