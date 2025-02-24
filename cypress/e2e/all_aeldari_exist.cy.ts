/// <reference types="cypress" />

describe.only('Verify all Aeldari units and weapons exist', () => {
  beforeEach(() => {
    cy.visit("/");
    cy.pasteListWithArgument("nr_aeldari_tester.txt");
    cy.get("button[type='submit']").click();
  });

  const checkShootingPhase = (weapon) => {
    cy.get('.isolate > :nth-child(3)').click();
    cy.contains(new RegExp(weapon, 'i')).should("exist");
  };

  const checkFightPhase = (weapon) => {
    cy.get('.isolate > :nth-child(5)').click();
    cy.contains(new RegExp(weapon, 'i')).should("exist");
  };

  describe("Shooting phase weapons", () => {
    it("should find Shuriken Pistol in the Shooting phase", () => {
      checkShootingPhase("Shuriken Pistol");
    });

    it("should find Shuriken Catapult in the Shooting phase", () => {
      checkShootingPhase("Shuriken Catapult");
    });

    it("should find Scatter Laser in the Shooting phase", () => {
      checkShootingPhase("Scatter Laser");
    });

    it("should find Dragon Fusion Gun in the Shooting phase", () => {
      checkShootingPhase("Dragon Fusion Gun");
    });

    it("should find Firepike in the Shooting phase", () => {
      checkShootingPhase("Firepike");
    });

    it("should find Deathspinner in the Shooting phase", () => {
      checkShootingPhase("Deathspinner");
    });

    it("should find Aeldari Flamer in the Shooting phase", () => {
      checkShootingPhase("Aeldari Flamer");
    });

    it("should find Aeldari Missile Launcher in the Shooting phase", () => {
      checkShootingPhase("Aeldari Missile Launcher");
    });

    it("should find Bright Lance in the Shooting phase", () => {
      checkShootingPhase("Bright Lance");
    });

    it("should find Shuriken Cannon in the Shooting phase", () => {
      checkShootingPhase("Shuriken Cannon");
    });

    it("should find Twin Scatter Laser in the Shooting phase", () => {
      checkShootingPhase("Twin Scatter Laser");
    });
  });

  describe("Fight phase weapons", () => {
    it("should find Witchblade in the Fight phase", () => {
      checkFightPhase("Witchblade");
    });

    it("should find Witch Staff in the Fight phase", () => {
      checkFightPhase("Witch Staff");
    });

    it("should find Close Combat Weapon in the Fight phase", () => {
      checkFightPhase("Close Combat Weapon");
    });

    it("should find Wraithbone Fists in the Fight phase", () => {
      checkFightPhase("Wraithbone Fists");
    });

    it("should find Wraithbone Hull in the Fight phase", () => {
      checkFightPhase("Wraithbone Hull");
    });
  });
});