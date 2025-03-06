/// <reference types="cypress" />

describe("Verify all Astra Militarum units and weapons exist", () => {
  beforeEach(() => {
    cy.pasteListWithArgument("nr_guard.txt");
  });

  const shootingWeapons = [
    "Lasgun",
    "Autocannon",
    "Heavy bolter",
    "Lascannon",
    "Battle cannon",
    "Demolisher cannon",
    "Punisher gatling cannon",
    "Executioner plasma cannon",
    "Vanquisher battle cannon",
    "Eradicator nova cannon",
    "Exterminator autocannon",
    "Heavy stubber",
    "Multi-laser",
    "Heavy flamer",
    "Sentry flamer",
    "Deathstrike missile",
    "Hellstrike missile",
    "Twin lascannon",
    "Twin heavy bolter",
    "Twin autocannon",
    "Twin heavy flamer",
    "Ripper gun",
    "Earthshaker cannon",
    "Medusa siege cannon",
    "Laser destroyer",
    "Sniper rifle",
    "Hot-shot lasgun",
    "Hot-shot laspistol",
    "Hot-shot lascarbine",
    "Inferno cannon",
    "Hydra autocannon",
    "Avenger bolt cannon",
    "Magma cannon",
    "Volcano cannon",
    "Storm Eagle Rockets",
    "Assault cannon",
    "Praetor launcher",
    "Castigator Gatling Cannon",
    "Vulcan Mega-bolter",
    "Stormsword Siege Cannon",
    "Valdor neutron laser",
    "Wyvern Quad Stormshard Mortar",
    "Taurox Battle Cannon",
    "Twin Taurox Hot-Shot Volley Gun",
    "Twin Autocannon",
    "Thunderbolt nose autocannons",
    "Vulture hellstrike rack",
    "Duty and Vengeance",
    "Multiple rocket pod"
  ];

  const fightWeapons = [
    "Chainsword",
    "Power weapon",
    "Huge Knife",
    "Mkoll's Straight Silver Knife",
    "Straight Silver Knife",
    "Savage claws",
    "Power Weapon",
    "Tempestus Dagger",
    "Death Rider hunting lance",
    "Steed's Hooves",
    "Bullgryn Maul",
    "Savage claws",
    "Battery close combat weapons",
    "Armoured hull",
    "Armoured Tracks"
  ];

  describe("Shooting phase weapons", () => {
    shootingWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Shooting phase`, () => {
        cy.checkShootingPhase(weapon);
      });
    });
  });

  describe("Fight phase weapons", () => {
    fightWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Fight phase`, () => {
        cy.checkFightPhase(weapon);
      });
    });
  });
});