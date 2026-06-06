describe("Invalid list submission to verify the presence of the error", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.get("button#close-changelog").click();
    });

    it("Enter the text asdf, hits enter and sees a single alert", () => {
        let alertCount = 0;

        cy.on("window:alert", (str) => {
            alertCount++;
            expect(str).to.equal(
                "Could not read this list. Supported formats: ListForge (text or share link), NewRecruit (JSON file or text export), GW app, Rosterizer. If your list is one of these, this is a parser bug — the dev can fix it with a copy of your list!",
            );
        });

        cy.get("#add-list-button").click();
        cy.get("textarea#comment").type("asdf", {
            delay: 0,
            parseSpecialCharSequences: false,
        });
        cy.get("button[type='submit']")
            .click()
            .then(() => {
                expect(alertCount).to.equal(1);
            });
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
