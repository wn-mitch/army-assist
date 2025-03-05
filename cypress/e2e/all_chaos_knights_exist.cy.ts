/// <reference types="cypress" />

describe("Ensure all weapons listed in nr_chaos_knights are listed on either the Shooting or Fight phase pages", () => {
  beforeEach(() => {
    cy.pasteListWithArgument("nr_chaos_knights.txt");
  });

  const shootingWeapons = [
    "Acheron flame cannon",
    "Atrapos lascutter",
    "Graviton singularity cannon",
    "Castigator bolt cannon",
    "Lightning cannon",
    "Phased plasma-fusil",
    "Graviton crusher",
    "Volkite chierovile",
    "Desecrator laser destructor",
    "Diabolus heavy stubber",
    "Volkite combustor",
    "Brimstone volcano lance",
    "Ectoplasma decimator",
    "Gheiststrike missile launcher",
    "Twin desecrator cannon",
    "War Dog autocannon",
    "Avenger chaincannon",
    "Daemonbreath spear",
    "Graviton pulsar",
    "Volkite veuglaire",
    "Asterius volkite culverin",
    "Karacnos mortar battery",
    "Twin conversion beam cannon",
    "Twin magna lascannon",
    "Acastus ironstorm missile pod",
    "Acastus autocannon"
  ];

  const fightWeapons = [
    "Reaper chainfist",
    "Tempest warblade",
    "Cerastus shock lance",
    "Reaper chainsword",
    "Electroscourge",
    "Warpstrike claw",
    "Titanic feet",
    "Slaughterclaw",
    "Reaper chaintalon",
    "Armoured feet"
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