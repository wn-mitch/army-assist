/// <reference types="cypress" />
describe('Cards collapse spec', () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('#close-button').click()
    cy.contains("2K Tau List").click()
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
    cy.get("#Shooting-button").click();
    cy.get('.columns-1 > :nth-child(1)').should('not.have.class', 'opacity-50');
  })
  it('Toggles one item and clicks the same phase, then sees the item toggled', () => {
    cy.get('#toggle-Broadside\\ Battlesuits-button').click();
    cy.get('.columns-1 > :nth-child(1)').should('have.class', 'opacity-50');
    cy.get("#Movement-button").click();
    cy.get('.columns-1 > :nth-child(1)').should('not.have.class', 'opacity-50');
  })
  it('Toggles two items and changes phase, then sees the items toggle back', () => {
    cy.get('#toggle-Broadside\\ Battlesuits-button').click();
    cy.get('#toggle-Cadre\\ Fireblade-button').click();
    cy.get('.columns-1 > :nth-child(1)').should('have.class', 'opacity-50');
    cy.get('.columns-1 > :nth-child(2)').should('have.class', 'opacity-50');
    cy.get("#Fight-button").click();
    cy.get('.columns-1 > :nth-child(1)').should('not.have.class', 'opacity-50');
    cy.get('.columns-1 > :nth-child(2)').should('not.have.class', 'opacity-50');
  })
})