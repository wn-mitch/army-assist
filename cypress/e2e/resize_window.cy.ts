/// <reference types="cypress" />

describe("Resize window test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#close-button").click();
  });

  it("should navigate to the fnf tau list then do some window resizing at various breakpoints", () => {
    cy.contains("2K Tau List").click();
    
    cy.viewport("iphone-8", "portrait");
    cy.screenshot("tau-list-iphone-portrait");
    cy.viewport("iphone-8", "landscape");
    cy.screenshot("tau-list-iphone-portrait");
   
    cy.viewport("ipad-2", "portrait");
    cy.screenshot("tau-list-ipad-portrait");
    cy.viewport("ipad-2", "landscape");
    cy.screenshot("tau-list-ipad-landscape");
  
    cy.viewport("macbook-13", "portrait");
    cy.screenshot("tau-list-macbook-portrait");
    cy.viewport("macbook-13", "landscape");
    cy.screenshot("tau-list-mackbook-landscape");
 
    cy.viewport("macbook-16", "portrait");
    cy.screenshot("tau-list-macbook16-portrait");
    cy.viewport("macbook-16", "landscape");
    cy.screenshot("tau-list-mackbook16-landscape");
  });

  it("should navigate to the table list and do some window resizing at various breakpoints", () => {
    cy.viewport("iphone-8", "portrait");
    cy.screenshot("table-list-iphone-portrait");

    cy.viewport("iphone-8", "landscape");
    cy.screenshot("table-list-iphone-landscape");

    cy.viewport("ipad-2", "portrait");
    cy.screenshot("table-list-ipad-portrait");
    
    cy.viewport("ipad-2", "landscape");
    cy.screenshot("table-list-iphone-landscape");

    cy.viewport("macbook-13", "portrait");
    cy.screenshot("table-list-macbook-portrait");
    
    cy.viewport("macbook-13", "landscape");
    cy.screenshot("table-list-macbook-landscape");

    cy.viewport("macbook-16", "portrait");
    cy.screenshot("table-list-macbook-16-portrait");
    
    cy.viewport("macbook-16", "landscape");
    cy.screenshot("table-list-macbook-16-landscape");
  });
});
