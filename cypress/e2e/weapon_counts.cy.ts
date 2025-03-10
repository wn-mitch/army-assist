/// <reference types="cypress" />

describe("Printing Modal Test", () => {
  beforeEach(() => {
    cy.pasteListWithArgument("count_test_list.txt");
  });

  it("should see the correct weapon counts in the shooting phase", () => {
    cy.get("#headlessui-radio-\\:rd\\:").click();
    cy.get(':nth-child(1) > .gap-1 > :nth-child(1) > .overflow-x-auto > .table-auto > tbody > :nth-child(1) > :nth-child(2)').contains("10")
    cy.get('tbody > :nth-child(3) > :nth-child(2)').contains("1");
    cy.get(':nth-child(2) > .gap-1 > :nth-child(1) > .overflow-x-auto > .table-auto > tbody > .border > :nth-child(2)').contains("1")
    cy.get(':nth-child(3) > .gap-1 > :nth-child(1) > .overflow-x-auto > .table-auto > tbody > :nth-child(1) > :nth-child(2)').contains("2")
  });
});
