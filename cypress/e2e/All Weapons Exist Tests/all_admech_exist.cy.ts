/// <reference types="cypress" />

describe("Ensure all weapons listed in nr_admech are listed on either the Shooting or Fight phase pages", () => {
  beforeEach(() => {
    cy.pasteListWithArgument("nr_admech.txt");
  });

  const shootingWeapons = [
    "Radium carbine",
    "Galvanic rifle",
    "Transuranic arquebus",
    "Arc rifle",
    "Heavy phosphor blaster",
    "Cognis heavy stubber",
    "Cognis lascannon",
    "Eradication beamer",
    "Twin cognis autocannon",
    "Phosphor blaster",
    "Phosphor torch",
    "Flechette blaster",
    "Mechanicus pistol",
    "Volkite blaster",
    "Heavy arc rifle",
    "Heavy grav-cannon",
    "Macrostubber",
    "Sulphur breath",
    "Phosphor serpenta",
    "Disruptor missile launcher",
    "Belleros energy cannon",
    "Incendine combustor",
    "Magnarail lance",
  ];

  const fightWeapons = [
    "Power fist",
    "Arc maul",
    "Radium Jezzail",
    "Sydonian Feet",
    "Control stave",
    "Taser goad",
    "Omnissian axe",
    "Servo-arc claw",
    "Electrostatic gauntlets",
    "Mechadendrite hive",
    "Arc scourge",
    "Cawl's Omnissian axe",
    "Close combat weapon",
    "Electroleech stave",
    "Pteraxii talons",
    "Cavalry sabre and clawed limbs",
    "Twin Kastelan fist",
    "Ironstrider feet",
    "Transonic razor and chordclaw",
    "Clawed limbs",
    "Taser lance"
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