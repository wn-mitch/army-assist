/// <reference types="cypress" />

describe('Verify all Aeldari units and weapons exist', () => {
  beforeEach(() => {
    cy.pasteListWithArgument("nr_aeldari.txt");
  });

  const shootingWeapons = [
    "Shuriken Pistol",
    "Shuriken Catapult",
    "Scatter Laser",
    "Dragon Fusion Gun",
    "Firepike",
    "Death spinner",
    "Voidstorm missile launcher",
    "Cloudburst missile launcher",
    "Shuriken Cannon",
    "Starcannon",
    "Reaper Launcher",
    "Long rifle",
    "D-cannon",
    "Shadow weaver",
    "Vibro Cannon",
    "Wraithcannon",
    "Pulse Laser",
    "Prism Cannon",
    "Heavy D-Scythe",
    "Doomweaver",
    "Voidweaver Haywire Cannon",
    "Splinter Cannon",
    "Twin Splinter Rifle",
    "Brood Twain",
    "Fury of the Tempest",
    "Destructor",
    "Star Bolas",
    "Searsong",
    "Silent Death",
  ];

  const fightWeapons = [
    "Witchblade",
    "Witch Staff",
    "Close Combat Weapon",
    "Wraithbone Fists",
    "Wraithbone Hull",
    "Bloody Twins",
    "Sword of Asur",
    "Wailing Doom",
    "Shining Blade",
    "Staff of Ulthamar",
    "Fire Axe",
    "Blade of Destruction",
    "Spider's Fangs",
    "Weaverender",
    "Maugetar",
    "Solitaire Weapons",
    "Star Glaive",
    "Jester's Blade",
    "Miststave",
    "Harlequin's Special Weapon",
    "Power sword",
    "Banshee Blade",
    "Scorpion chainsword",
    "Harlequin's Blade",
    "Ghostswords",
    "Titanic Ghostglaive",
    "Ghostspear",
    "Laser Lance",
    "Bladevanes"
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