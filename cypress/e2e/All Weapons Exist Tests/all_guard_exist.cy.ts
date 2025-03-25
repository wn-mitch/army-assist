/// <reference types="cypress" />

describe("Verify all Astra Militarum units and weapons exist", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#close-button").click();
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
    "Twin heavy bolter",
    "Twin autocannon",
    "Ripper gun",
    "Earthshaker cannon",
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
    "Castigator Gatling Cannon",
    "Vulcan Mega-bolter",
    "Stormsword Siege Cannon",
    "Wyvern Quad Stormshard Mortar",
    "Taurox Battle Cannon",
    "Twin Taurox Hot-Shot Volley Gun",
    "Duty and Vengeance",
    "Tremor cannon",
    "Quake cannon",
    "Hellhammer cannon",
    "Bragg's autocannon",
    "Corbec's hot-shot lascarbine",
    "Larkin's long-las",
    "Death Rider lascarbine",
    "Zealot's vindictor",
    "Rawne's lascarbine"
  ];

  const fightWeapons = [
    "Chainsword",
    "Power weapon",
    "Huge Knife",
    "Mkoll's Straight Silver Knife",
    "Straight Silver Knife",
    "Savage claws",
    "Tempestus Dagger",
    "Steed's Hooves",
    "Bullgryn Maul",
    "Battery close combat weapons",
    "Armoured hull",
    "Armoured Tracks",
    "Force weapon",
    "Trench club",
    "Frag lance",
    "Power sabre",
    "Servo-arm",
  ];

  describe("Shooting phase weapons", () => {
    shootingWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Shooting phase`, () => {
        cy.checkShootingPhase("Guard", weapon);
      });
    });
  });

  describe("Fight phase weapons", () => {
    fightWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Fight phase`, () => {
        cy.checkFightPhase("Guard", weapon);
      });
    });
  });
});