/// <reference types="cypress" />

describe("Verify all Adeptus Astartes units and weapons exist", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('#close-button').click()
  });

  const shootingWeapons = [
    "Heavy Onslaught Gatling Cannon",
    "Twin Ironhail Heavy Stubber",
    "Hammerstrike Missile Launcher",
    "Krakstorm Grenade Launcher",
    "Melta Destroyer",
    "Stormfury Missiles",
    "Thunderstrike Las-talon",
    "Twin Icarus Rocket Pod",
    "Twin Assault Cannon",
    "Las-talon",
    "Skyhammer Missile Launcher",
    "Stormstrike missile launcher",
    "Typhoon Missile Launcher",
    "Twin Heavy Bolter",
    "Thunderhawk heavy cannon",
    "Demolisher Cannon",
    "Whirlwind Vengeance Launcher",
    "Hammerfall Missile Launcher",
    "Hammerfall Heavy Bolter Array",
  ];

  const fightWeapons = [
    "Close Combat Weapon",
    "Brutalis Fists",
    "Armoured Hull",
    "Armoured Tracks",
    "Redemptor Fist",
    "Invictor Fist",
    "Thunder Hammer",
    "Power Fist",
    "Siege Drills",
    "Centurion Fists",
    "Combat Knife",
    "Astartes Chainsword",
    "Master-crafted Power Weapon",
    "Power Weapon",
    "Relic Weapon",
    "Executioner Relic Blade",
    "Omnissian Power Axe",
    "Servo-arm",
  ];

  describe("Shooting phase weapons", () => {
    shootingWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Shooting phase`, () => {
        cy.checkShootingPhase("Space Marines Test", weapon);
      });
    });
  });

  describe("Fight phase weapons", () => {
    fightWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Fight phase`, () => {
        cy.checkFightPhase("Space Marines Test", weapon);
      });
    });
  });
});
