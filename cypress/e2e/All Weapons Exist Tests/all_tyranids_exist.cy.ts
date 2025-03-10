/// <reference types="cypress" />

describe("Ensure all weapons listed in nr_tyranids_weapons are listed on either the Shooting or Fight phase pages", () => {
  beforeEach(() => {
    cy.pasteListWithArgument("nr_tyranids_weapons.txt");
  });

  const shootingWeapons = [
    "Heavy venom cannon",
    "Psychic scream",
    "Fleshborer",
    "Spore mine launcher",
    "Warp blast",
    "Psychoclastic torrent",
    "Toxinjector Harpoon",
    "Stinger salvoes",
    "Rupture cannon",
    "Grasping tongue",
  ];

  const fightWeapons = [
    "Broodlord Claws and Talons",
    "Blinding venom",
    "Lictor claws and talons",
    "Monstrous bonesword and lash whip",
    "Neurotyrant claws and lashes",
    "Hormagaunt talons",
    "Chitinous claws and teeth",
    "Piercing claws and talons",
    "Genestealer claws and talons",
    "Leaper's talons",
    "Chitin-barbed limbs",
    "Ravenous maw",
    "Shovelling claws",
    "Monstrous scything talons",
    "Talons and betentacled maw",
    "Powerful limbs",
    "Toxinjector Harpoon",
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