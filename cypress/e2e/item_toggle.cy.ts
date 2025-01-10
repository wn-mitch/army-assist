describe('template spec', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.pasteListWithArgument('nr_tau.txt');
    cy.get("button[type='submit']").click();
  })
  it('Toggles one item', () => {
    cy.get('.columns-2 > :nth-child(1)').click();
    cy.get('.columns-2 > :nth-child(1)').should('have.class', 'opacity-50');
  })
  it('Untoggles one item', () => {
    cy.get('.columns-2 > :nth-child(1)').click();
    cy.get('.columns-2 > :nth-child(1)').click();
    cy.get('.columns-2 > :nth-child(1)').should('not.have.class', 'opacity-50');
  })
  it('Toggles one item and changes phase, then sees the item toggle back', () => {
    cy.get('.columns-2 > :nth-child(1)').click();
    cy.get('.isolate > :nth-child(2)').click();
    cy.get('.columns-2 > :nth-child(1)').should('not.have.class', 'opacity-50');
  })
  it('Toggles one item and clicks the same phase, then sees the item toggles back', () => {
    cy.get('.columns-2 > :nth-child(1)').click();
    cy.get('.rounded-l-md').click();
    cy.get('.columns-2 > :nth-child(1)').should('not.have.class', 'opacity-50');
  })
  it('Toggles two items and changes phase, then sees the items toggle back', () => {
    cy.get('.columns-2 > :nth-child(1)').click();
    cy.get('.columns-2 > :nth-child(2)').click();
    cy.get('.isolate > :nth-child(2)').click();
    cy.get('.columns-2 > :nth-child(1)').should('not.have.class', 'opacity-50');
  })
})