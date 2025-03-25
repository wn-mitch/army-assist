/// <reference types="cypress" />
describe('The Phase Filter should adjust the visible stats', () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#close-button").click();
    cy.contains("2K Tau List").click();
  })
  it('selects Command phase and sees the leadership characteristics', () => {
    cy.get("#Command-button").click();
    cy.contains("7+");
  })
  it('selects Movement phase and sees the movement characteristics', () => {
    cy.get("#Movement-button").click();
    cy.contains("5\"");
  })
  it('selects Shooting phase and sees the ranged weapon characteristics', () => {
    cy.get("#Shooting-button").click();
    cy.contains("60\"");
    cy.contains("Heavy rail rifle");
    cy.contains("Devastating Wounds");
  })
  it('selects Charge phase and sees the charge tracker', () => {
    cy.get("#Charge-button").click();
    cy.contains("Charged?");
  })
  it('selects Fight phase and sees the melee weapon characteristics', () => {
    cy.get("#Fight-button").click();
    cy.contains("Crushing bulk");
    cy.contains("5+");
  })
  it('selects Saves phase and sees the save characteristics', () => {
    cy.get("#Saves-button").click();
    cy.contains("Sv");
    cy.contains("2+");
  })
})