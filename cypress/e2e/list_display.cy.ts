/// <reference types="cypress" />
const testListDisplay = (fileName: string) => {
  it(`should see a list of units for the ${fileName} list`, () => {
    cy.pasteListWithArgument(fileName);
    cy.get("ul").should("exist");
    cy.get("ul li").should("have.length.at.least", 1);
  });
};

describe("Display the army list split into units", () => {
  const fileNames = [
    'nr_aa.txt',
    'nr_admech.txt',
    'nr_aeldari.txt',
    'nr_chaos_knights.txt',
    'nr_csm.txt',
    'nr_cults.txt',
    'nr_custodes.txt',
    'nr_dark_angels.txt',
    'nr_death_guard.txt',
    'nr_guard.txt',
    'nr_guard_2.txt',
    'nr_knights.txt',
    'nr_necrons.txt',
    'nr_orks.txt',
    'nr_sisters.txt',
    'nr_tau.txt',
    'nr_fnf_tau.txt',
    'nr_tsons.txt',
    'nr_tyranids.txt',
    'nr_ultramarines.txt',
    'nr_votann.txt',
    'nr_world_eaters.txt',
    'nr_ynnari.txt',
  ];

  fileNames.forEach((fileName) => {
    testListDisplay(fileName);
  });
});
