/// <reference types="cypress" />

describe("Verify all Chaos Daemons units and weapons exist", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#close-button").click();
  });

  const shootingWeapons = [
    "Death's heads",
    "Plague flail",
    "Heartstring lyre",
    "Bloodlash",
    "Pavane of Slaanesh",
    "Putrid vomit",
    "Grasping tongue",
    "Hellfire breath",
    "Infernal cannon",
    "Fire of Tzeentch - pink fire",
    "Fire of Tzeentch - blue fire",
    "Infernal Gateway",
    "Streams of brackish filth",
    "Bellow of endless fury",
    "Infernal Flames",
    "Coruscating Blue flames",
    "Coruscating Pink flames",
    "Burning roar",
    "Harvester cannon",
    "Torrent of burning blood",
    "Lash of Slaanesh",
    "Lashes of torment",
  ];

  const fightWeapons = [
    "Flamer mouths",
    "Axe of Khorne",
    "The Blade of Shadows",
    "Balesword and nurgling attendants",
    "Acidic maw",
    "Lopping shears",
    "Staff of Tomorrow",
    "Soul-rending fangs",
    "Gnarlrod",
    "Blade of decay",
    "Snapping claws",
    "Soulpiercer",
    "Slaughter and Carnage",
    "The Slayer Sword",
    "Axe of Dominion",
    "Scourging whip",
    "Sharp quills",
    "The Trickster's Staff",
    "Serrated claws",
    "Souleater blade",
    "Blade of blood",
    "Great axe of Khorne",
    "Herald combat weapon",
    "Coiled tentacles",
    "Ravaging claws",
    "Hellforged weapons",
    "Bilesword",
    "Lashing tongue",
    "Witstealer sword",
    "Staff of Tzeentch",
    "Foul balesword",
    "Attendants' hellblades",
    "Juggernaut's bladed horn",
    "Marotter",
    "Plaguesword and distended maw",
    "Exalted Seeker tongues",
    "Hellblade",
    "Blue claws",
    "Slashing claws",
    "Diseased claws and teeth",
    "Pink claws",
    "Plaguesword",
    "Daemonic claws",
    "Bladed axle",
    "Seeker tongues",
    "Foul mouthparts",
    "Pox rider plaguesword",
    "Yawning maw",
    "Biting maw",
    "Putrid appendages",
    "Barbed tail and dissecting claws",
    "Gore-drenched fangs",
    "Lamprey bite",
    "Churning fangs and claws",
    "Jagged claws and tusked maw",
    "Iron claw",
    "Warpsword",
  ];

    describe("Shooting phase weapons", () => {
    shootingWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Shooting phase`, () => {
        cy.checkShootingPhase("Demons", weapon);
      });
    });
  });

  describe("Fight phase weapons", () => {
    fightWeapons.forEach((weapon) => {
      it(`should find ${weapon} in the Fight phase`, () => {
        cy.checkFightPhase("Demons", weapon);
      });
    });
  });
});
