/// <reference types="cypress" />

describe("Verify all Legends of Votann units and weapons exist", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#close-button").click();
  });

  const shootingWeapons = [
    "Volkanite disintegrator",
    "Graviton rifle",
    "Autoch-pattern bolt pistol",
    "Las-beam cutter",
    "Autoch-pattern combi-bolter",
    "Autoch-pattern bolter",
    "Bolt cannon",
    "Exo-armour grenade launcher",
    "EtaCarn plasma gun",
    "Bolt shotgun",
    "Bolt revolver",
    "Magna-coil autocannon",
    "Cyclic ion cannon",
    "Twin bolt cannon",
    "HYLas beam cannon",
    "L7 missile launcher",
    "Sagitaur missile launcher",
    "MATR autocannon",
    "Ancestral Wrath",
    "Pan spectral scanner",
  ];

  const fightWeapons = [
    "Blade of the Ancestors",
    "Plasma torch",
    "Graviton hammer",
    "Close combat weapon",
    "Manipulator arms",
    "Mass hammer",
    "Ancestral ward stave",
    "Rampart crest",
    "Forgewrought plasma axe",
    "Heavy plasma axe",
    "Concussion gauntlet",
    "Plasma knife",
  ];

  describe("Shooting phase weapons", () => {
    shootingWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Shooting phase`, () => {
        cy.checkShootingPhase("Votann", weapon);
      });
    });
  });

  describe("Fight phase weapons", () => {
    fightWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Fight phase`, () => {
        cy.checkFightPhase("Votann", weapon);
      });
    });
  });
});
