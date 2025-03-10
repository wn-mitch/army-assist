/// <reference types="cypress" />

describe("Ensure all weapons listed in nr_tau are listed on either the Shooting or Fight phase pages", () => {
  beforeEach(() => {
    cy.pasteListWithArgument("nr_tau.txt");
  });

  const shootingWeapons = [
    "Fireblade pulse rifle",
    "High-intensity plasma rifle",
    "Cyclic ion blaster",
    "Plasma rifle",
    "Weapon support system",
    "Kroot long gun",
    "Kroot pistol",
    "Dart-bow and tri-blade",
    "Pulse pistol",
    "Pulse rifle",
    "Support turret",
    "Kroot rifle",
    "T'au-tech rifle",
    "Farstalker firearm",
    "Londaxi tribalest",
    "Battlesuit support system",
    "Burst cannon",
    "Neutron blaster",
    "Kroot pistol and hunting javelins",
    "Heavy rail rifle",
    "Seeker missile",
    "Twin plasma rifle",
    "Missile pod",
    "Twin pulse carbine",
    "Fusion blaster",
    "Fusion collider",
    "Twin fusion blaster",
    "Railgun",
    "Smart missile system",
  ];

  const fightWeapons = [
    "Close combat weapon",
    "Krootox fists",
    "Kalamandra's bite",
    "Stingwing claws",
    "Crushing bulk",
    "Armoured hull",
    "Dawn Blade",
    "Ripping fangs",
    "Ritual blade",
    "Battlesuit fists",
    "Shaper's blade",
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