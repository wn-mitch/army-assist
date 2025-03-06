/// <reference types="cypress" />
describe('The Phase Filter should adjust the visible stats', () => {
  beforeEach(() => {
    cy.pasteListWithArgument('broadsides.txt');
  })
  it('selects Command phase and sees the leadership characteristics', () => {
    cy.get("#headlessui-radio-\\:rb\\:").click();
    cy.contains("7+");
  })
  it('selects Movement phase and sees the movement characteristics', () => {
    cy.get("#headlessui-radio-\\:rc\\:").click();
    cy.contains("5\"");
  })
  it('selects Shooting phase and sees the ranged weapon characteristics', () => {
    cy.get("#headlessui-radio-\\:rd\\:").click();
    cy.contains("60\"");
    cy.contains("Heavy rail rifle");
    cy.contains("Devastating Wounds");
  })
  it('selects Charge phase and sees the charge tracker', () => {
    cy.get("#headlessui-radio-\\:re\\:").click();
    cy.contains("Charged?");
  })
  it('selects Fight phase and sees the melee weapon characteristics', () => {
    cy.get("#headlessui-radio-\\:rf\\:").click();
    cy.contains("Crushing bulk");
    cy.contains("5+");
  })
  it('selects Saves phase and sees the save characteristics', () => {
    cy.get("#headlessui-radio-\\:rg\\:").click();
    cy.contains("Sv");
    cy.contains("2+");
  })
})