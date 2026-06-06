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
        "/H4sIAAAAAAAAA+2QPU4DQQyF+znFk1IASiJCOrbLDygFEogNElJE4WSdXSuzM9F4Nj9UuQYtR8tJ2CVFRJMTUD6/Z/uz39l5RRfTK6rwUK4lcK2GpIxpXeli1u/1euuoH8a00G5jEMo9Xr1GDo08260WRt4tJa8CRfHODClGy0jlkxOkMciK8ejDgnHdNOHFi4uwUkq8MWOOtChKdjHBoNqJFQp7jCgLbNLCb28nkjGe181kTfDEObtMQTXuRlTmljt4c2Qld5yd1lxyoyxl8Yv5J2XMMHjKtNl1wtdKomJ2/3tjYo6Hb9ztcE6lBenx8LUJ9Y2jUGkhLse8sqsO+rvaFbYZxsG7mmDCtNkjkFgEWTZMKfOq/mMpqtLo6VYc1pa0pFPkn+cyzw93KHZyvwIAAA=="
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
      // Saving reparses the list; with no user-given name the roster's own
      // name ("Base Tau", from the list header) surfaces, never a raw
      // "undefined - undefined".
      cy.contains("undefined - undefined").should("not.exist");
      cy.contains("Base Tau").should("exist");
      cy.get(
        "#refresh-list-8a776952-8b58-4fd8-99f6-5db83d484da4-button"
      ).click();
      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Army Refreshed!");
      });
      cy.contains("Base Tau");
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
