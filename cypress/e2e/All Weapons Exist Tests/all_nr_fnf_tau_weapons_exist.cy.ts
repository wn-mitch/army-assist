/// <reference types="cypress" />
describe("Ensure all weapons listed in nr_fnf_tau are listed on either the Shooting or Fight phase pages", () => {
  beforeEach(() => {
    cy.pasteListWithArgument("nr_fnf_tau.txt");
  });

  const shootingWeapons = [
    "High-intensity plasma rifle",
    "Fireblade pulse rifle",
    "Pulse blaster",
    "Pulse pistol",
    "Kroot pistol",
    "Kroot rifle",
    "Neutron blaster",
    "Neutron grenade launcher",
    "Neutron rail rifle",
    "T'au flamer",
    "Heavy rail rifle",
    "Burst cannon"
  ];

  const fightWeapons = [
    "Dawn Blade",
    "Close combat weapon",
    "Stingwing claws",
    "Crushing bulk"
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