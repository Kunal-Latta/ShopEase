describe("ecommerce core flow", () => {
  const getVisiblePrices = () =>
    cy.get("p.text-lg.font-bold.text-green-600").then(($priceEls) => {
      const prices = [...$priceEls].map((el) =>
        Number(el.textContent?.replace("$", "").trim() ?? "0"),
      );
      return prices.filter((price) => Number.isFinite(price));
    });

  it("home loads products", () => {
    cy.intercept("GET", "**/products*").as("getProducts");
    cy.visit("/");
    cy.wait("@getProducts");
    cy.get('a[href^="/product/"]').should("have.length.greaterThan", 0);
  });

  it("product click opens detail", () => {
    cy.visit("/");
    cy.get('a[href^="/product/"]').first().click();
    cy.url().should("include", "/product/");
    cy.contains("h1", "Product Detail Page").should("be.visible");
  });

  it("add to cart and remove from cart works", () => {
    cy.visit("/");
    cy.get('a[href^="/product/"]').first().click();
    cy.contains("button", "Add to Cart").click();

    cy.contains("a", "Cart").click();
    cy.contains("h1", "Cart (1 items)").should("be.visible");
    cy.contains("button", "Remove").first().click();
    cy.contains("Your cart is empty").should("be.visible");
  });

  it("filter and sort update url and refetch", () => {
    cy.intercept("GET", "**/products*").as("getProducts");
    cy.visit("/");
    cy.wait("@getProducts");

    cy.get('input[placeholder="Min price"]').clear().type("100");
    cy.wait("@getProducts");
    cy.url().should("include", "price_min=");

    cy.get("select").first().select("Price: Low to High");
    cy.wait("@getProducts");
    cy.url().should("include", "sort=price-asc");
  });

  it("min-only and max-only price filters work", () => {
    cy.intercept("GET", "**/products*").as("getProducts");
    cy.visit("/?price_min=50");
    cy.wait("@getProducts");
    cy.url().should("include", "price_min=50");
    getVisiblePrices().then((prices) => {
      expect(prices.length).to.be.greaterThan(0);
      prices.forEach((price) => expect(price).to.be.at.least(50));
    });

    cy.visit("/?price_max=80");
    cy.wait("@getProducts");
    cy.url().should("include", "price_max=80");
    getVisiblePrices().then((prices) => {
      expect(prices.length).to.be.greaterThan(0);
      prices.forEach((price) => expect(price).to.be.at.most(80));
    });
  });
});
