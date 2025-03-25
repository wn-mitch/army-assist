/// <reference types="cypress" />

describe("List Card Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("button#close-changelog").click();
    cy.get("#display-toggle").click();
  });

  it("should open a list", () => {
    cy.contains("2K Tau List").click();
  });

  describe("Renaming Tests", () => {
    it("should rename a list", () => {
      cy.get("#edit-list-8a776952-8b58-4fd8-99f6-5db83d484da4-button").click();
      cy.get("#list-name").clear();
      cy.get("#list-name").type("LISTCARDWORKINGVALUE");
      cy.get("#save-button").click();
      cy.contains("LISTCARDWORKINGVALUE").should("exist");
    });
  });

  describe("QR Code Tests", () => {
    it("should navigate to a shared list link", () => {
      cy.visit(
        "/BoUwdg9gzgBAtDAKgcgIYFcYFEC2AHASwCcR4YAhVKUxDMgbQCYAGVvAFygF0AoHgYhgBqITACCRHAE8YAJWjsQRYaKatmHbgMEBhCGABmBAOboiqdgX09K7dgBtSAZQIAvEAC4YT9kQIBrUgAxCCIAY1IAChZWGAAFCAIwdhh7AhwCdgBKHgAREHZUMIALHHB2LzF0AA8CNNQiGR1UABMSHidiiAB3AHoACQIW0gB5DiswKC8AGRBjcBbYBtIANwIoAgAjRwAaGABVMFQ04zAQFpgQ8JAlkhg1je2QPcPjkzOLq8sjMIsJ29W6y2jj4-EEWEIYRg-SUEBg9AAnABWTS8PQ4HCoMDDZRBBobYzFFKIlGcLheXKobpgCj2VrPaEmYpwJKKSaZGR4OlQTEwPwGXYwADqDXsoRaoN0xQaRUUynoAGYAIwaMk8ZptYLEEDbenwpGq7heHRi6gwMIQHCbCwwbogVB4fR7ILa3XDGB4dD2M38kHozHYpQwJIwPT2RaFZS2Bw3dCZeFKlioryIcyTR2B5TTCBhfwwACyEBaXoZ0ccUDjKSMUE4ex0UjCaShExguprSj2cW5vN9DM6BBA4Zg8zO5nYoT2QvtGZgFbwjqIKSgUnbOD2jGq3mKA6HuSI+hAPAA0vuICls2c4FA8Pb5QjDeTQ6bSBarTa7Q6nTAj8dUAG2qgyCwJsmQMieEBnqk+jGMO6BgMep4pCKyidA6Qb0AaybfohHrrOO9h7KhN5EEBrZ0sMeyUoucCbD0MBYhcvgEDR5GHtoFAWDGaRnPCADspJaD4fiBEg9o4HxAnkjwgBEBDASqbi6dzIX4oRblQyBxsaz7mpa1opB+Gadl6ZqEDWEAEfExmkL2hHoPOoQpOwZgkOwewAOLoA0LQEFiMB7gehHboOFz+WcMkwAiCnasKDQqcofQelZfIEAKnhPtAL66e+05fnESWmfhRnetZKUguxACShhYr4MiKgALA+CEQSkzREGABArKENzwgAbJJHjhfJMAXsYcAAI5xvY9haRlOlvvpOVgHs4GQQV5nLThvbhZF2HNaGDTtZ1JBTOlZqvnptqLRte1bStKR4kQNbHIEj3wgAHP1g2bnd351PYNH7i9Xg-WtFmyJknn2GR9J7CgdCKCUyWpeFvHfThD1PfYQOnZl82XZ+S2XPihRY0GRgkA0a67ateHmV91P3cTz1BglGMky9MDk7e4kMfEIAlMg5gzWdWULQTzpM6Tyhc5T1002Z9j0z9bPM-FvTDfoLSoLUMBMda5YVDjc0XQZX4g7TFkXlrOt68cNzsOFG4M9CEBwYsXjg-OSQwQYWLGFAHSKMc7DFBxdjlpWsD0D1D4DbJQ0+Pa9gh2pUDICsJBeGWsbxtWtZhzGFbxnOC5LiuihU-0lre629oWoT5BmDW5pYpA8GyU7ifB6HqFp3Gtrq5sTcpL8YBt1nnER7neFQHsjePSPrfWAAajchAXD43vdN7Ud9cm9Or9eQzeL4qAhrM9JEF4AByIDoL4+jQ+2RCEZYYDGNv7-mnS3QB7JdWbkPuvE+W8d4DxgLfe++4aTkG5HKG+d8H40jbHKV+oCv6NipAHIBx9N7v0-v7Xqn146ALXrg0+597Q4gQVAx+KCOwgPwTXTBv9woAJgDgjeb8P5gISpApBtIqDwIgYg6BT9UGMJ4Rgn+Ad2KFjgooC4TAPqoiameCAm5ZB-jwKgeYr16BKnvPvWSPU0bNQ0XIbRuilAnX6AomubobhyxSKDei2IYDFHsV-AAVqgFYg4kiz0sfgax0sZ5qPHJoqxeio7ImMTABUZj1FRJCTErwdjkgONYkE82Cs3EXE8ZknxfiAmTD2Fo1JZNwnsXIPaZu9AGqqJ+lXN2UdGlkjjjAJESSUgtOxCdT2hAv6+3frIsEHCQDbkbKQegH1JI2H3K0DY7ps5F04PCIxHT6bkEWYsIYzhpRQEAJgEGc0o6CIOgKA24v5DyxuuTc-Zgp+WgQyGEfiZDmDqEjQUTgQAgA5hkKAGxBSIE-h6bsqBvmHh2RAJZ+yC5T3WYiWO2zdnLIOVQE5mdQwXKuQ4r0-h7lbh3CFF5ew3krA+WfKGNlvB-IBesYFDJQUhi5FQHspVoVovhasyOGyUUkIoNy90vcsVnNxdcmCtzCUwE7kFXcZLoT2kpXyalULCL0qDICplsMwVsp5JCra5ygSwEUv89qBhSC8syFHJUCoBVyU3MajYprtT+AtRi45pyJ7hxzlWGeex8yMrqKQR0LROwQvVTADyNJQpRBZTST0xUW5EBAmcLIgUSXPIPI7J1fgXWXDdR61ORzNIIr9ZzANBZg2OA9EWCN7LDWcvcnBbNPFIgJsSsm34qakggAzcSp5cb1T5vWN4OCBhQjzHLWs21mEtmCudWOpwE6p2erFT6wulZK01iCU7IIlyWz0JftG1tcaYAdr1UlHtab+2ZqHS83NOKTXjsMGuktZbrX+t3USg9Gw6FwIYTGtt8ar3doaLegdjyFU5rcl0GsgRBwzu3QYmOWE4MKEQ1DPOQS-0tgtFNfZJ7O0GEPQBoRSgeD9D-GUIgxQqGnsmNuPACY6r9XEJIV2JAClejBtS0whNO6auUNqkN65vCYkXDAUTtblyrlgNEB5kmUgydIHJiuWQgA"
      );
      cy.contains("[3x]Broadside Battlesuits");
    });

    it("should open the list qr code share screen successfully", () => {
      cy.get("#share-list-8a776952-8b58-4fd8-99f6-5db83d484da4-button").click();
    });

    it("should open the list qr code share screen and see the error message", () => {
      cy.get('#share-list-47926d58-4daf-4201-90cf-0fc3e0326d6e-button').click()
      cy.contains(
        "This list is too long to share as a QR code! Is this a real list? If so, please let the dev know!"
      );
    });

    it("should close the list qr code share screen using the button", () => {
      cy.get("#share-list-8a776952-8b58-4fd8-99f6-5db83d484da4-button").click();
      cy.get("#close-button").click();
      cy.contains("Tap Here to Close").should("not.exist");
    });
  });

  describe("Refresh Tests", () => {
    it("should refresh a list", () => {
      cy.get(
        "#refresh-list-8a776952-8b58-4fd8-99f6-5db83d484da4-button"
      ).click();

      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Army Refreshed!");
      });
    });

    it("should refresh a list without a name", () => {
      cy.get("#edit-list-8a776952-8b58-4fd8-99f6-5db83d484da4-button").click();
      cy.get("#list-name").clear();
      cy.get("#save-button").click();
      cy.contains("undefined - undefined").should("not.exist");
      cy.contains("Unprocessed List - Refresh").should("exist");
      cy.get(
        "#refresh-list-8a776952-8b58-4fd8-99f6-5db83d484da4-button"
      ).click();
      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Army Refreshed!");
      });
      cy.contains("TAU - Auxiliary Cadre");
    });
  });

  it("should delete a list and show an alert", () => {
    cy.get("#delete-list-8a776952-8b58-4fd8-99f6-5db83d484da4-button").click();
    cy.on("window:confirm", (confirmText) => {
      expect(confirmText).to.equal(
        "Are you sure you want to delete this list?"
      );
    });
    cy.contains("1K Tau List").should("not.exist");
  });
});
