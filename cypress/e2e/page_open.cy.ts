/// <reference types="cypress" />
describe('Does the site even open?', () => {
  it('visits the home page', () => {
    cy.visit('/');
  })
})