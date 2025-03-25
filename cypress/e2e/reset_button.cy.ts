/// <reference types="cypress" />
describe('Reset Button Test', () => {
    beforeEach(() => {
        cy.visit("/");
        cy.get("#close-button").click();
    })

    it('should select a list, submit it, then reset back to the pastebox', () => {
        cy.contains("2K Tau List").click();
        cy.get('#reset-button').click();
        cy.get('#stored-lists-display').should('be.visible')
    });
    
    it('should click add a list, then reset back to the pastebox and see the list disappear', () => {
        cy.get("#add-list-button").click();
        cy.get('#reset-button').click();
        cy.get('#stored-lists-display').should('be.visible')
    });
});