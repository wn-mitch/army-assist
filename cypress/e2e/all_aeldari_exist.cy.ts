/// <reference types="cypress" />

describe.only('Verify all Aeldari units and weapons exist', () => {
  beforeEach(() => {
    cy.visit("/");
    cy.pasteListWithArgument("nr_aeldari_tester.txt");
    cy.get("button[type='submit']").click();
  });

  describe("Shooting phase weapons", () => {
    it("should find Shuriken Pistol in the Shooting phase", () => {
      cy.checkShootingPhase("Shuriken Pistol");
    });

    it("should find Shuriken Catapult in the Shooting phase", () => {
      cy.checkShootingPhase("Shuriken Catapult");
    });

    it("should find Scatter Laser in the Shooting phase", () => {
      cy.checkShootingPhase("Scatter Laser");
    });

    it("should find Dragon Fusion Gun in the Shooting phase", () => {
      cy.checkShootingPhase("Dragon Fusion Gun");
    });

    it("should find Firepike in the Shooting phase", () => {
      cy.checkShootingPhase("Firepike");
    });

    it("should find Deathspinner in the Shooting phase", () => {
      cy.checkShootingPhase("Deathspinner");
    });

    it("should find Aeldari Flamer in the Shooting phase", () => {
      cy.checkShootingPhase("Aeldari Flamer");
    });

    it("should find Aeldari Missile Launcher in the Shooting phase", () => {
      cy.checkShootingPhase("Aeldari Missile Launcher");
    });

    it("should find Bright Lance in the Shooting phase", () => {
      cy.checkShootingPhase("Bright Lance");
    });

    it("should find Shuriken Cannon in the Shooting phase", () => {
      cy.checkShootingPhase("Shuriken Cannon");
    });

    it("should find Twin Scatter Laser in the Shooting phase", () => {
      cy.checkShootingPhase("Twin Scatter Laser");
    });
  });

  describe("Fight phase weapons", () => {
    it("should find Witchblade in the Fight phase", () => {
      cy.checkFightPhase("Witchblade");
    });

    it("should find Witch Staff in the Fight phase", () => {
      cy.checkFightPhase("Witch Staff");
    });

    it("should find Close Combat Weapon in the Fight phase", () => {
      cy.checkFightPhase("Close Combat Weapon");
    });

    it("should find Wraithbone Fists in the Fight phase", () => {
      cy.checkFightPhase("Wraithbone Fists");
    });

    it("should find Wraithbone Hull in the Fight phase", () => {
      cy.checkFightPhase("Wraithbone Hull");
    });
  });
});