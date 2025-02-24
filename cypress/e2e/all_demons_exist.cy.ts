/// <reference types="cypress" />

describe('Verify all Chaos Daemons units and weapons exist', () => {
  beforeEach(() => {
    cy.visit("/");
    cy.pasteListWithArgument("nr_demons.txt");
    cy.get("button[type='submit']").click();
  });

  describe("Shooting phase weapons", () => {
    it("should find Plague flail in the Shooting phase", () => {
      cy.checkShootingPhase("Plague flail");
    });

    it("should find Heartstring lyre in the Shooting phase", () => {
      cy.checkShootingPhase("Heartstring lyre");
    });

    it("should find Bloodlash in the Shooting phase", () => {
      cy.checkShootingPhase("Bloodlash");
    });

    it("should find Pavane of Slaanesh in the Shooting phase", () => {
      cy.checkShootingPhase("Pavane of Slaanesh");
    });
    it("should find Putrid vomit in the Shooting phase", () => {
      cy.checkShootingPhase("Putrid vomit");
    });

    it("should find Grasping tongue in the Shooting phase", () => {
      cy.checkShootingPhase("Grasping tongue");
    });

    it("should find Hellfire breath in the Shooting phase", () => {
      cy.checkShootingPhase("Hellfire breath");
    });

    it("should find Infernal cannon in the Shooting phase", () => {
      cy.checkShootingPhase("Infernal cannon");
    });

    it("should find Fires of Tzeentch in the Shooting phase", () => {
      cy.checkShootingPhase("Fires of Tzeentch");
    });

    it("should find Infernal Gateway in the Shooting phase", () => {
      cy.checkShootingPhase("Infernal Gateway");
    });

    it("should find Streams of brackish filth in the Shooting phase", () => {
      cy.checkShootingPhase("Streams of brackish filth");
    });

    it("should find Bellow of endless fury in the Shooting phase", () => {
      cy.checkShootingPhase("Bellow of endless fury");
    });

    it("should find Infernal Flames in the Shooting phase", () => {
      cy.checkShootingPhase("Infernal Flames");
    });

    it("should find Coruscating Blue flames in the Shooting phase", () => {
      cy.checkShootingPhase("Coruscating Blue flames");
    });

    it("should find Coruscating Pink flames in the Shooting phase", () => {
      cy.checkShootingPhase("Coruscating Pink flames");
    });

    it("should find Flamer mouths in the Shooting phase", () => {
      cy.checkShootingPhase("Flamer mouths");
    });

    it("should find Burning maw in the Shooting phase", () => {
      cy.checkShootingPhase("Burning maw");
    });

    it("should find Harvester cannon in the Shooting phase", () => {
      cy.checkShootingPhase("Harvester cannon");
    });

    it("should find Phlegm bombardment in the Shooting phase", () => {
      cy.checkShootingPhase("Phlegm bombardment");
    });

    it("should find Torrent of burning blood in the Shooting phase", () => {
      cy.checkShootingPhase("Torrent of burning blood");
    });
  });

  describe("Fight phase weapons", () => {
    it("should find Staff of cataclysm in the Fight phase", () => {
      cy.checkFightPhase("Staff of cataclysm");
    });

    it("should find Axe of Khorne in the Fight phase", () => {
      cy.checkFightPhase("Axe of Khorne");
    });

    it("should find The Blade of Shadows in the Fight phase", () => {
      cy.checkFightPhase("The Blade of Shadows");
    });

    it("should find Balesword and nurgling attendants in the Fight phase", () => {
      cy.checkFightPhase("Balesword and nurgling attendants");
    });

    it("should find Acidic maw in the Fight phase", () => {
      cy.checkFightPhase("Acidic maw");
    });

    it("should find Lopping shears in the Fight phase", () => {
      cy.checkFightPhase("Lopping shears");
    });

    it("should find Staff of Tomorrow in the Fight phase", () => {
      cy.checkFightPhase("Staff of Tomorrow");
    });

    it("should find Soul-rending fangs in the Fight phase", () => {
      cy.checkFightPhase("Soul-rending fangs");
    });

    it("should find Gnarlrod in the Fight phase", () => {
      cy.checkFightPhase("Gnarlrod");
    });

    it("should find Blade of decay in the Fight phase", () => {
      cy.checkFightPhase("Blade of decay");
    });

    it("should find Lash of Slaanesh in the Fight phase", () => {
      cy.checkFightPhase("Lash of Slaanesh");
    });

    it("should find Snapping claws in the Fight phase", () => {
      cy.checkFightPhase("Snapping claws");
    });

    it("should find Soulpiercer in the Fight phase", () => {
      cy.checkFightPhase("Soulpiercer");
    });

    it("should find Slaughter and Carnage in the Fight phase", () => {
      cy.checkFightPhase("Slaughter and Carnage");
    });

    it("should find The Slayer Sword in the Fight phase", () => {
      cy.checkFightPhase("The Slayer Sword");
    });

    it("should find Axe of Dominion in the Fight phase", () => {
      cy.checkFightPhase("Axe of Dominion");
    });

    it("should find Scourging whip in the Fight phase", () => {
      cy.checkFightPhase("Scourging whip");
    });

    it("should find Sharp quills in the Fight phase", () => {
      cy.checkFightPhase("Sharp quills");
    });

    it("should find The Trickster's Staff in the Fight phase", () => {
      cy.checkFightPhase("The Trickster's Staff");
    });

    it("should find Serrated claws in the Fight phase", () => {
      cy.checkFightPhase("Serrated claws");
    });

    it("should find Souleater blade in the Fight phase", () => {
      cy.checkFightPhase("Souleater blade");
    });

    it("should find Blade of blood in the Fight phase", () => {
      cy.checkFightPhase("Blade of blood");
    });

    it("should find Great axe of Khorne in the Fight phase", () => {
      cy.checkFightPhase("Great axe of Khorne");
    });

    it("should find Herald combat weapon in the Fight phase", () => {
      cy.checkFightPhase("Herald combat weapon");
    });

    it("should find Coiled tentacles in the Fight phase", () => {
      cy.checkFightPhase("Coiled tentacles");
    });

    it("should find Ravaging claws in the Fight phase", () => {
      cy.checkFightPhase("Ravaging claws");
    });

    it("should find Hellforged weapons in the Fight phase", () => {
      cy.checkFightPhase("Hellforged weapons");
    });

    it("should find Bilesword in the Fight phase", () => {
      cy.checkFightPhase("Bilesword");
    });

    it("should find Lashing tongue in the Fight phase", () => {
      cy.checkFightPhase("Lashing tongue");
    });

    it("should find Witstealer sword in the Fight phase", () => {
      cy.checkFightPhase("Witstealer sword");
    });

    it("should find Staff of Tzeentch in the Fight phase", () => {
      cy.checkFightPhase("Staff of Tzeentch");
    });

    it("should find Foul balesword in the Fight phase", () => {
      cy.checkFightPhase("Foul balesword");
    });

    it("should find Attendant's hellblades in the Fight phase", () => {
      cy.checkFightPhase("Attendant's hellblades");
    });

    it("should find Juggernaut's bladed horn in the Fight phase", () => {
      cy.checkFightPhase("Juggernaut's bladed horn");
    });

    it("should find Marotter in the Fight phase", () => {
      cy.checkFightPhase("Marotter");
    });

    it("should find Plaguesword and distended maw in the Fight phase", () => {
      cy.checkFightPhase("Plaguesword and distended maw");
    });

    it("should find Exalted Seeker tongues in the Fight phase", () => {
      cy.checkFightPhase("Exalted Seeker tongues");
    });

    it("should find Lashes of torment in the Fight phase", () => {
      cy.checkFightPhase("Lashes of torment");
    });

    it("should find Hellblade in the Fight phase", () => {
      cy.checkFightPhase("Hellblade");
    });

    it("should find Blue claws in the Fight phase", () => {
      cy.checkFightPhase("Blue claws");
    });

    it("should find Slashing claws in the Fight phase", () => {
      cy.checkFightPhase("Slashing claws");
    });

    it("should find Diseased claws and teeth in the Fight phase", () => {
      cy.checkFightPhase("Diseased claws and teeth");
    });

    it("should find Pink claws in the Fight phase", () => {
      cy.checkFightPhase("Pink claws");
    });

    it("should find Plaguesword in the Fight phase", () => {
      cy.checkFightPhase("Plaguesword");
    });

    it("should find Daemonic claws in the Fight phase", () => {
      cy.checkFightPhase("Daemonic claws");
    });

    it("should find Bladed axle in the Fight phase", () => {
      cy.checkFightPhase("Bladed axle");
    });

    it("should find Seeker tongues in the Fight phase", () => {
      cy.checkFightPhase("Seeker tongues");
    });

    it("should find Death's heads in the Fight phase", () => {
      cy.checkFightPhase("Death's heads");
    });

    it("should find Foul mouthparts in the Fight phase", () => {
      cy.checkFightPhase("Foul mouthparts");
    });

    it("should find Pox rider plaguesword in the Fight phase", () => {
      cy.checkFightPhase("Pox rider plaguesword");
    });

    it("should find Yawning maw in the Fight phase", () => {
      cy.checkFightPhase("Yawning maw");
    });

    it("should find Lashing tongues in the Fight phase", () => {
      cy.checkFightPhase("Lashing tongues");
    });

    it("should find Biting maw in the Fight phase", () => {
      cy.checkFightPhase("Biting maw");
    });

    it("should find Putrid appendages in the Fight phase", () => {
      cy.checkFightPhase("Putrid appendages");
    });

    it("should find Barbed tail and dissecting claws in the Fight phase", () => {
      cy.checkFightPhase("Barbed tail and dissecting claws");
    });

    it("should find Gore-drenched fangs in the Fight phase", () => {
      cy.checkFightPhase("Gore-drenched fangs");
    });


    it("should find Lamprey bite in the Fight phase", () => {
      cy.checkFightPhase("Lamprey bite");
    });

    it("should find Churning fangs and claws in the Fight phase", () => {
      cy.checkFightPhase("Churning fangs and claws");
    });

    it("should find Jagged claws and tusked maw in the Fight phase", () => {
      cy.checkFightPhase("Jagged claws and tusked maw");
    });

    it("should find Iron claw in the Fight phase", () => {
      cy.checkFightPhase("Iron claw");
    });

    it("should find Warpsword in the Fight phase", () => {
      cy.checkFightPhase("Warpsword");
    });
  });
});