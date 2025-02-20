describe("Ensure all weapons listed in nr_fnf_tau are listed on either the Shooting or Fight phase pages", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.pasteListWithArgument("nr_fnf_tau.txt");
    cy.get("button[type='submit']").click();
  });

  const checkShootingPhase = (weapon) => {
    cy.get('#headlessui-radio-:rd:').click();
    cy.contains(weapon).should("exist");
  };

  const checkFightPhase = (weapon) => {
    cy.get('.isolate > :nth-child(5)').click();
    cy.contains(weapon).should("exist");
  };

  describe("Shooting phase weapons", () => {
    it("should find High-intensity plasma rifle in the Shooting phase", () => {
      cy.checkShootingPhase("High-intensity plasma rifle");
    });

    it("should find Fireblade pulse rifle in the Shooting phase", () => {
      cy.checkShootingPhase("Fireblade pulse rifle");
    });

    it("should find Pulse blaster in the Shooting phase", () => {
      cy.checkShootingPhase("Pulse blaster");
    });

    it("should find Pulse pistol in the Shooting phase", () => {
      cy.checkShootingPhase("Pulse pistol");
    });

    it("should find Kroot pistol in the Shooting phase", () => {
      cy.checkShootingPhase("Kroot pistol");
    });

    it("should find Kroot rifle in the Shooting phase", () => {
      cy.checkShootingPhase("Kroot rifle");
    });

    it("should find Neutron blaster in the Shooting phase", () => {
      cy.checkShootingPhase("Neutron blaster");
    });

    it("should find Neutron grenade launcher in the Shooting phase", () => {
      cy.checkShootingPhase("Neutron grenade launcher");
    });

    it("should find Neutron rail rifle in the Shooting phase", () => {
      cy.checkShootingPhase("Neutron rail rifle");
    });

    it("should find T'au flamer in the Shooting phase", () => {
      cy.checkShootingPhase("T'au flamer");
    });

    it("should find Heavy rail rifle in the Shooting phase", () => {
      cy.checkShootingPhase("Heavy rail rifle");
    });

    it("should find Burst cannon in the Shooting phase", () => {
      cy.checkShootingPhase("Burst cannon");
    });
  });

  describe("Fight phase weapons", () => {
    it("should find Dawn Blade in the Fight phase", () => {
      cy.checkFightPhase("Dawn Blade");
    });

    it("should find Close combat weapon in the Fight phase", () => {
      cy.checkFightPhase("Close combat weapon");
    });

    it("should find Stingwing claws in the Fight phase", () => {
      cy.checkFightPhase("Stingwing claws");
    });

    it("should find Crushing bulk in the Fight phase", () => {
      cy.checkFightPhase("Crushing bulk");
    });
  });
});