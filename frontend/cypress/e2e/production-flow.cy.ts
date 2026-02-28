describe("Production Flow Integration", () => {
  beforeEach(() => {
    // Before each test, we start at the home page
    cy.visit("/");
  });

  it("should complete the full cycle: Material -> Product -> Composition -> Intel", () => {
    // We generate a unique ID inside the test to ensure isolation
    const timestamp = Date.now();
    const materialCode = `MAT-${timestamp}`;
    const productCode = `PROD-${timestamp}`;
    const materialName = `Test Steel ${timestamp}`;
    const productName = `Test Bicycle ${timestamp}`;

    // 1. CREATE A RAW MATERIAL
    cy.get("aside").contains("button", "Raw Materials").click({ force: true });
    cy.contains("button", "Add Material").click({ force: true });

    cy.get('input[placeholder="RM001"]').type(materialCode);
    cy.get('input[placeholder="Steel Pipe"]').type(materialName);
    cy.get('input[name="stockQuantity"]').clear().type("100");
    cy.get('button[type="submit"]').click({ force: true });

    // Wait for unlock
    cy.get('[role="dialog"]').should("not.exist");
    cy.get("body").invoke("attr", "style", "pointer-events: auto !important");
    cy.get("body").invoke("removeAttr", "data-scroll-locked");

    cy.contains(materialCode).should("be.visible");

    // 2. CREATE A PRODUCT
    cy.get("aside").contains("button", "Products").click({ force: true });
    cy.contains("button", "Add Product").click({ force: true });

    cy.get('input[placeholder="P001"]').type(productCode);
    cy.get('input[placeholder="Bicycle"]').type(productName);
    cy.get('input[name="value"]').clear().type("9999");
    cy.get('button[type="submit"]').click({ force: true });

    // Wait for unlock
    cy.get('[role="dialog"]').should("not.exist");
    cy.get("body").invoke("attr", "style", "pointer-events: auto !important");
    cy.get("body").invoke("removeAttr", "data-scroll-locked");

    cy.contains(productCode).should("be.visible");

    // 3. ASSOCIATE MATERIAL TO PRODUCT (COMPOSITION)
    cy.contains("tr", productCode).within(() => {
      cy.get('button[title="Composition"]').click({ force: true });
    });

    cy.get('[role="dialog"]')
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Select a material").click({ force: true });
      });

    // Select from portal (outside dialog)
    cy.contains(materialName).click({ force: true });

    cy.get('[role="dialog"]').within(() => {
      cy.contains("label", "Qty").parent().find("input").clear().type("2");
      cy.contains("button", "Add").click({ force: true });
      // Verify association appears in the table within the dialog
      cy.contains("tr", materialName).should("contain", "2");
      // Verify it was saved to DB by checking table persistence
      cy.contains("tr", materialName).should("be.visible");
    });

    // Close and reload to ensure DB state and Clear UI locks
    cy.get("body").type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");
    cy.get("body").invoke("attr", "style", "pointer-events: auto !important");
    cy.get("body").invoke("removeAttr", "data-scroll-locked");

    // Refresh the whole state
    cy.reload();
    cy.wait(3000);

    // 4. VERIFY PRODUCTION INTEL
    cy.get("aside")
      .contains("button", "Production Info")
      .click({ force: true });

    // Wait for content (high timeout to allow for background polling/Prisma lag)
    cy.contains(".bg-card", productName, { timeout: 40000 })
      .should("be.visible")
      .within(() => {
        cy.contains("50", { timeout: 30000 }).should("be.visible");
        cy.contains("Units producible").should("be.visible");
      });

    cy.contains("Total Potential Revenue").should("be.visible");
  });

  it("should be responsive and have a working mobile menu", () => {
    // Change viewport to iPhone XR size
    cy.viewport("iphone-xr");
    cy.visit("/");

    // Open the sheet menu
    cy.get("header").find('button[aria-haspopup="dialog"]').click();

    // Navigate using mobile menu
    cy.get('[role="dialog"]').contains("button", "Raw Materials").click();

    // Menu should close and content should update
    cy.contains("h2", "Raw Materials").should("be.visible");
  });
});
