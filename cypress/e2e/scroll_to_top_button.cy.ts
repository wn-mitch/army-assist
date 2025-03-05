/// <reference types="cypress" />

describe('Scroll to Top Button', () => {
    it('should scroll to the bottom of the screen, hit the button, then be at the top of the screen', () => {
        cy.pasteListWithArgument("nr_fnf_tau.txt");
        cy.scrollTo('bottom');
        cy.get('#scroll-to-top-button').click();
        cy.window().its('scrollY').should('equal', 0);
    });
});