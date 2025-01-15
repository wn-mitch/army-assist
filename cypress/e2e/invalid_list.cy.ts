describe("Invalid list submission to verify the presence of the error", () => {
  beforeEach(() => {
    cy.visit("/");
    // Click the button with the "close-changelog" id
    cy.get("button#close-changelog").click();
    // Find the Pastebox textarea and paste the text into it
    cy.get("textarea#comment").type("asdf", {
      delay: 0,
      parseSpecialCharSequences: false,
    });
    cy.get("button[type='submit']").click();
  })
  it("Enter the text asdf, hits enter and sees the alert", () => {
    cy.on("window:alert", (str) => {
      expect(str).to.equal(
        "Error: Invalid List Format. Use the NR format (NewRecruit.eu)"
      );
    });
  });
  it("Enter the text asdf, hits enter, clears the alert, and the text is cleared", () => {
    cy.get("textarea#comment").should("have.value", "");
  });
});
