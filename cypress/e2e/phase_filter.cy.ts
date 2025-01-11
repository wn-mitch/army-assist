describe('The Phase Filter should adjust the visible stats', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.pasteListWithArgument('nr_tau.txt');
    cy.get("button[type='submit']").click();
  })
  it('selects Command phase and sees the leadership characteristics', () => {
    cy.get('.rounded-l-md').click();
    cy.get(':nth-child(1) > .text-xl').should('have.text', '6+');
    cy.get(':nth-child(2) > .text-xl').should('have.text', '7+');
  })
  it('selects Movement phase and sees the movement characteristics', () => {
    cy.get('.isolate > :nth-child(2)').click();
    cy.get(':nth-child(1) > .text-xl').should('have.text', '10"');
    cy.get(':nth-child(2) > .text-xl').should('have.text', '6"');
    cy.get(':nth-child(3) > .text-xl').should('have.text', '12"');
  })
})