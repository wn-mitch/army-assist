/// <reference types="cypress" />
describe('Dark Mode Test', () => {
    it('should be in dark mode by default, toggle to light mode, and then toggle back to dark mode', () => {
        cy.visit('/');
        cy.get('html').should('have.class', 'dark');
        cy.get('#close-button').click()
        cy.get('#settings-button').click()
        cy.get(':nth-child(8) > .relative > .flex > .group > .appearance-none').click()
        cy.get('html').should('not.have.class', 'dark');
        cy.get(':nth-child(8) > .relative > .flex > .group > .appearance-none').click()
        cy.get('html').should('have.class', 'dark');
    });
});