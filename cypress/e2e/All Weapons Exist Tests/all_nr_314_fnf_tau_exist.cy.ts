/// <reference types="cypress" />

describe("Ensure all weapons listed in nr_314_fnf_tau are listed on either the Shooting or Fight phase pages", () => {
  beforeEach(() => {
    cy.pasteListWithArgument("nr_314_fnf_tau.txt");
  });

  const shootingWeapons = [
    "Fireblade pulse rifle",
    "High-intensity plasma rifle",
    "Pulse blaster",
    "Pulse pistol",
    "Support turret",
    "Kroot pistol",
    "Kroot rifle",
    "Pulse carbine",
    "Burst cannon",
    "Repeater cannon",
    "Missile pod",
    "High-yield missile pods",
    "Weapon support system",
    "Twin smart missile system",
    "T'au flamer",
    "Fusion blaster",
    "Fusion collider",
    "Twin T'au flamer",
    "Accelerator burst cannon",
    "Smart missile system"
  ];

  const fightWeapons = [
    "Close combat weapon",
    "Dawn Blade",
    "Battlesuit fists",
    "Krootox fists",
    "Crushing bulk",
    "Ghostkeel fists"
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