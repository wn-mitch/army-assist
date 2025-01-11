describe("Paste a valid army list into the Pastebox", () => {
  it("should paste text from nr_tau.txt into the Pastebox", () => {
    cy.pasteListWithArgument("nr_tau.txt");
  });

  // Add more tests for other list files if needed
  it("should paste text from nr_fnf_tau.txt into the Pastebox", () => {
    cy.pasteListWithArgument("nr_fnf_tau.txt");
  });

  it("should paste text from nr_tyranids.txt into the Pastebox", () => {
    cy.pasteListWithArgument("nr_tyranids.txt");
  });

  it("should paste text from nr_world_eaters.txt into the Pastebox", () => {
    cy.pasteListWithArgument("nr_world_eaters.txt");
  });

  it("should paste text from nr_aa.txt into the Pastebox", () => {
    cy.pasteListWithArgument("nr_aa.txt");
  });
});
