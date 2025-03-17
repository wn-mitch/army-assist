/// <reference types="cypress" />
describe('Cards collapse spec', () => {
  beforeEach(() => {
    cy.pasteListWithArgument('nr_tau.txt');
  })
  it('Toggles one item', () => {
    cy.get('#toggle-Broadside\\ Battlesuits-button').click();
    cy.get('.columns-1 > :nth-child(1)').should('have.class', 'opacity-50');
  })
  it('Untoggles one item', () => {
    cy.get('#toggle-Broadside\\ Battlesuits-button').click();
    cy.get('.columns-1 > :nth-child(1)').should('have.class', 'opacity-50');
    cy.get('#toggle-Broadside\\ Battlesuits-button').click();
    cy.get('.columns-1 > :nth-child(1)').should('not.have.class', 'opacity-50');
  })
  it('Toggles one item and changes phase, then sees the item toggle back', () => {
    cy.get('#toggle-Broadside\\ Battlesuits-button').click();
    cy.get('.columns-1 > :nth-child(1)').should('have.class', 'opacity-50');
    cy.get("#headlessui-radio-\\:rd\\:").click();
    cy.get('.columns-1 > :nth-child(1)').should('not.have.class', 'opacity-50');
  })
  it('Toggles one item and clicks the same phase, then sees the item remain toggled', () => {
    cy.get('#toggle-Broadside\\ Battlesuits-button').click();
    cy.get('.columns-1 > :nth-child(1)').should('have.class', 'opacity-50');
    cy.get("#headlessui-radio-\\:rb\\:").click();
    cy.get('.columns-1 > :nth-child(1)').should('have.class', 'opacity-50');
  })
  it('Toggles two items and changes phase, then sees the items toggle back', () => {
    cy.get('#toggle-Broadside\\ Battlesuits-button').click();
    cy.get('#toggle-Cadre\\ Fireblade-button').click();
    cy.get('.columns-1 > :nth-child(1)').should('have.class', 'opacity-50');
    cy.get('.columns-1 > :nth-child(2)').should('have.class', 'opacity-50');
    cy.get("#headlessui-radio-\\:rd\\:").click();
    cy.get('.columns-1 > :nth-child(1)').should('not.have.class', 'opacity-50');
    cy.get('.columns-1 > :nth-child(2)').should('not.have.class', 'opacity-50');
  })
})