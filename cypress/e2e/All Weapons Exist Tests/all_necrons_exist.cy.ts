/// <reference types="cypress" />

describe("Ensure all weapons listed in nr_necrons are listed on either the Shooting or Fight phase pages", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#close-button").click();
  });

  const shootingWeapons = [
    "Tachyon arrow",
    "Gauss cannon",
    "Enmitic disintegrator pistols",
    "Plasmic lance",
    "Abyssal lance",
    "Relic gauss blaster",
    "Enmitic annihilator",
    "Seismic assault",
    "Gauss blaster",
    "Gauss flayer",
    "Scouring eye",
    "Synaptic disintegrator",
    "Cutting beam",
    "Exile cannon",
    "Gauss slicers",
    "Twin tesla destructor",
    "Doomsday blaster",
    "Atomiser beam",
    "Heavy death ray",
    "Doomsday cannon",
    "Particle whip",
    "Gauss flux arc",
    "Tesla sphere",
    "Voltaic storm",
    "Annihilator beam",
    "Tesseract singularity chamber",
    "Tesla cannon",
    "C'tan Powers",
    "Heat ray",
    "Transdimensional abductor",
    "Gauss annihilator",
    "Gauss exterminator",
    "Gauntlet of Fire",
    "Aeonstave",
  ];

  const fightWeapons = [
    "Warscythe",
    "Aeonstave",
    "Golden fists",
    "Scythe of the Nightbringer",
    "Spear of the Void Dragon",
    "Impaling legs",
    "Staff of the Destroyer",
    "Staff of light",
    "Staff of Tomorrow",
    "Weapons of the Final Triarch",
    "Armoured bulk",
    "Empathic Obliterator",
    "Close combat weapon",
    "Flensing claw",
    "Hyperphase harvester",
    "Resurrection orb",
    "Flayer claws",
    "Ophydian hyperphase weapons",
    "Skorpekh hyperphase weapons",
    "Rod of covenant",
    "Feeder mandibles",
    "Vicious claws",
    "Tomb Sentinel claws",
    "Tomb Stalker claws",
    "Doomstalker limbs",
    "Reanimator's claws",
    "Automaton claws",
    "Portal of exile",
    "Titanic forelimbs",
    "Stalker's forelimbs",
    "Crackling tendrils",
  ];

  describe("Shooting phase weapons", () => {
    shootingWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Shooting phase`, () => {
        cy.checkShootingPhase("Necrons", weapon);
      });
    });
  });

  describe("Fight phase weapons", () => {
    fightWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Fight phase`, () => {
        cy.checkFightPhase("Necrons", weapon);
      });
    });
  });
});
