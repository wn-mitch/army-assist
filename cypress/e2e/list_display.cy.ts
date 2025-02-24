const testListDisplay = (fileName: string) => {
  it(`should see a list of units for the ${fileName} list`, () => {
    cy.pasteListWithArgument(fileName);
    cy.get("ul").should("exist");
    cy.get("ul li").should("have.length.at.least", 1);
  });
};

describe("Display the army list split into units", () => {
  const fileNames = [
    'nr_tau.txt',
    'nr_fnf_tau.txt',
    'nr_tyranids.txt',
    'nr_aa.txt',
    'nr_world_eaters.txt',
  ];

  fileNames.forEach((fileName) => {
    testListDisplay(fileName);
  });
});
