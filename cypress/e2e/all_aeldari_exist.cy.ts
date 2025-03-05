/// <reference types="cypress" />

describe('Verify all Aeldari units and weapons exist', () => {
  beforeEach(() => {
    cy.pasteListWithArgument("nr_aeldari_tester.txt");
  });

  const shootingWeapons = [
    "Shuriken Pistol",
    "Shuriken Catapult",
    "Scatter Laser",
    "Dragon Fusion Gun",
    "Firepike",
    "Death spinner",
    "Aeldari Flamer",
    "Aeldari Missile Launcher",
    "Bright Lance",
    "Shuriken Cannon",
    "Twin Scatter Laser"
  ];

  const fightWeapons = [
    "Witchblade",
    "Witch Staff",
    "Close Combat Weapon",
    "Wraithbone Fists",
    "Wraithbone Hull"
  ];

  describe("Shooting phase weapons", () => {
    shootingWeapons.forEach(weapon => {
      it(`should find ${weapon} in the Shooting phase`, () => {
        cy.checkShootingPhase(weapon);
      });
    });
  });

  describe("Fight phase weapons", () => {
    fightWeapons.forEach(weapon => {
      it(`should find ${weapon} in the Fight phase`, () => {
        cy.checkFightPhase(weapon);
      });
    });
  });
});