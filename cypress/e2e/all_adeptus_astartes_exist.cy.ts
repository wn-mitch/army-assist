/// <reference types="cypress" />

describe.only('Verify all Adeptus Astartes units and weapons exist', () => {
  beforeEach(() => {
    cy.visit("/");
    cy.pasteListWithArgument("nr_aa.txt");
    cy.get("button[type='submit']").click();
  });

  describe("Shooting phase weapons", () => {
    it("should find Heavy Onslaught Gatling Cannon in the Shooting phase", () => {
      cy.checkShootingPhase("Heavy Onslaught Gatling Cannon");
    });

    it("should find Twin Ironhail Heavy Stubber in the Shooting phase", () => {
      cy.checkShootingPhase("Twin Ironhail Heavy Stubber");
    });

    it("should find Hammerstrike Missile Launcher in the Shooting phase", () => {
      cy.checkShootingPhase("Hammerstrike Missile Launcher");
    });

    it("should find Krakstorm Grenade Launcher in the Shooting phase", () => {
      cy.checkShootingPhase("Krakstorm Grenade Launcher");
    });

    it("should find Melta Destroyer in the Shooting phase", () => {
      cy.checkShootingPhase("Melta Destroyer");
    });

    it("should find Stormfury Missiles in the Shooting phase", () => {
      cy.checkShootingPhase("Stormfury Missiles");
    });

    it("should find Thunderstrike Las-talon in the Shooting phase", () => {
      cy.checkShootingPhase("Thunderstrike Las-talon");
    });

    it("should find Twin Icarus Rocket Pod in the Shooting phase", () => {
      cy.checkShootingPhase("Twin Icarus Rocket Pod");
    });

    it("should find Twin Assault Cannon in the Shooting phase", () => {
      cy.checkShootingPhase("Twin Assault Cannon");
    });

    it("should find Las-talon in the Shooting phase", () => {
      cy.checkShootingPhase("Las-talon");
    });

    it("should find Skyhammer Missile Launcher in the Shooting phase", () => {
      cy.checkShootingPhase("Skyhammer Missile Launcher");
    });

    it("should find Stormstrike Missiles in the Shooting phase", () => {
      cy.checkShootingPhase("Stormstrike Missiles");
    });

    it("should find Typhoon Missile Launcher in the Shooting phase", () => {
      cy.checkShootingPhase("Typhoon Missile Launcher");
    });

    it("should find Twin Heavy Bolter in the Shooting phase", () => {
      cy.checkShootingPhase("Twin Heavy Bolter");
    });

    it("should find Thunderhawk heavy cannon in the Shooting phase", () => {
      cy.checkShootingPhase("Thunderhawk heavy cannon");
    });

    it("should find Demolisher Cannon in the Shooting phase", () => {
      cy.checkShootingPhase("Demolisher Cannon");
    });

    it("should find Whirlwind Vengeance Launcher in the Shooting phase", () => {
      cy.checkShootingPhase("Whirlwind Vengeance Launcher");
    });

    it("should find Hammerfall Missile Launcher in the Shooting phase", () => {
      cy.checkShootingPhase("Hammerfall Missile Launcher");
    });

    it("should find Hammerfall Heavy Bolter Array in the Shooting phase", () => {
      cy.checkShootingPhase("Hammerfall Heavy Bolter Array");
    });
  });
  describe("Fight phase weapons", () => {
    it("should find Close Combat Weapon in the Fight phase", () => {
      cy.checkFightPhase("Close Combat Weapon");
    });

    it("should find Brutalis Fists in the Fight phase", () => {
      cy.checkFightPhase("Brutalis Fists");
    });

    it("should find Armoured Hull in the Fight phase", () => {
      cy.checkFightPhase("Armoured Hull");
    });

    it("should find Armoured Tracks in the Fight phase", () => {
      cy.checkFightPhase("Armoured Tracks");
    });

    it("should find Redemptor Fist in the Fight phase", () => {
      cy.checkFightPhase("Redemptor Fist");
    });

    it("should find Invictor Fist in the Fight phase", () => {
      cy.checkFightPhase("Invictor Fist");
    });

    it("should find Thunder Hammer in the Fight phase", () => {
      cy.checkFightPhase("Thunder Hammer");
    });

    it("should find Storm Shield in the Fight phase", () => {
      cy.checkFightPhase("Storm Shield");
    });

    it("should find Power Fist in the Fight phase", () => {
      cy.checkFightPhase("Power Fist");
    });

    it("should find Siege Drills in the Fight phase", () => {
      cy.checkFightPhase("Siege Drills");
    });

    it("should find Centurion Fists in the Fight phase", () => {
      cy.checkFightPhase("Centurion Fists");
    });

    it("should find Combat Knife in the Fight phase", () => {
      cy.checkFightPhase("Combat Knife");
    });

    it("should find Astartes Chainsword in the Fight phase", () => {
      cy.checkFightPhase("Astartes Chainsword");
    });

    it("should find Master-crafted Power Weapon in the Fight phase", () => {
      cy.checkFightPhase("Master-crafted Power Weapon");
    });

    it("should find Power Weapon in the Fight phase", () => {
      cy.checkFightPhase("Power Weapon");
    });

    it("should find Relic Weapon in the Fight phase", () => {
      cy.checkFightPhase("Relic Weapon");
    });

    it("should find Executioner Relic Blade in the Fight phase", () => {
      cy.checkFightPhase("Executioner Relic Blade");
    });

    it("should find Omnissian Power Axe in the Fight phase", () => {
      cy.checkFightPhase("Omnissian Power Axe");
    });

    it("should find Servo-arm in the Fight phase", () => {
      cy.checkFightPhase("Servo-arm");
    });
});
});