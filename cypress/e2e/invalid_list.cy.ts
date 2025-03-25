describe("Invalid list submission to verify the presence of the error", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("button#close-changelog").click();
  });

  it("Enter the text asdf, hits enter and sees the alerts", () => {
    let alertCount = 0;

    cy.on("window:alert", (str) => {
      alertCount++;
      if (alertCount === 1) {
        expect(str).to.equal("Name/Faction/Detachment format not recognized");
      } else if (alertCount === 2) {
        expect(str).to.equal(
          "Error: Invalid List Format. Use the NR format (NewRecruit.eu). If the list format is correct, this is likely caused by a parser bug, and the dev can fix it with a copy of your list!"
        );
      } else {
        throw new Error("Unexpected alert fired");
      }
    });

    cy.get("#add-list-button").click();
    cy.get("textarea#comment").type("asdf", {
      delay: 0,
      parseSpecialCharSequences: false,
    });
    cy.get("button[type='submit']").click();
  });

  it("Enter the text asdf, hits enter, clears the alert, and the text is cleared", () => {
    cy.get("#add-list-button").click();
    cy.get("textarea#comment").type("asdf", {
      delay: 0,
      parseSpecialCharSequences: false,
    });
    cy.get("button[type='submit']").click();
    cy.get("textarea#comment").should("have.value", "");
  });

  it("Attempts to open an invalid list", () => {
    cy.contains("Invalid").click();
  });
});
