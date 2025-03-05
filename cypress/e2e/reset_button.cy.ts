/// <reference types="cypress" />
describe('Reset Button Test', () => {
    it('should paste in a list, submit it, then reset back to the pastebox', () => {
        cy.pasteListWithArgument("nr_fnf_tau.txt");

        // Open the changelog
        cy.get('#reset-button').click();
        cy.get('#comment').should('exist')
    });
});