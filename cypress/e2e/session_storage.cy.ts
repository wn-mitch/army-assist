/// <reference types="cypress" />

describe('Session Storage Test', () => {
    it('should check the session storage for a JSON value', () => {
        // Visit the page you want to test
        cy.pasteListWithArgument("nr_fnf_tau.txt");
        
        // Check the session storage for the JSON value
        cy.window().then((window) => {
            const storedValue = window.sessionStorage.getItem('army-storage');
            expect(() => JSON.parse(storedValue)).not.to.throw();
            const parsedValue = JSON.parse(storedValue);
            expect(parsedValue).to.be.an('object');
        });
    });
});