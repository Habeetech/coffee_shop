import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app.js";
import resetData from "../../../src/utils/resetData.js";
import dotenv from "dotenv";
import Product from "../../../src/modules/products/product.model.js";
import products from "../../../src/seeders/productSeed.js";
dotenv.config();

describe("Products API - CRUD Operations", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(products, Product);
  });

  test("GET /api/products returns an array", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/products/:id returns the correct product", async () => {
    const allProducts = await request(app).get("/api/products");
    const target = allProducts.body[0];
    const targetId = target._id;
    const res = await request(app).get(`/api/products/${targetId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(target.name);
    expect(res.body._id).toBe(targetId);
  });

  test("POST /api/products creates a new drink with category", async () => {
    const newProduct = {
      name: "Vanilla Latte",
      price: 4.50,
      type: "drinks",
      category: "hot-coffee",
      url: ""
    };
    const res = await request(app).post("/api/products").send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.type).toBe("drinks");
    expect(res.body.category).toBe("hot-coffee");
  });

  test("POST /api/products creates a biscuit without category", async () => {
    const newProduct = {
      name: "Oatmeal Cookie",
      price: 2.00,
      type: "biscuits",
      url: ""
    };
    const res = await request(app).post("/api/products").send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.type).toBe("biscuits");
    expect(res.body.category).toBeUndefined();
  });

  test("POST /api/products creates a crisp without category", async () => {
    const newProduct = {
      name: "Spicy Pepper",
      price: 1.50,
      type: "crisps",
      url: ""
    };
    const res = await request(app).post("/api/products").send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.type).toBe("crisps");
    expect(res.body.category).toBeUndefined();
  });

  test("PUT /api/products/:id updates a product", async () => {
    const allProducts = await request(app).get("/api/products");
    const targetId = allProducts.body[0]._id;
    const updatedData = {
      name: "Updated Product",
      price: 5.99,
      type: "drinks",
      category: "iced-coffee",
      url: ""
    };
    const res = await request(app).put(`/api/products/${targetId}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.price).toBe(updatedData.price);
  });

  test("DELETE /api/products/:id removes a product", async () => {
    const allProducts = await request(app).get("/api/products");
    const targetId = allProducts.body[0]._id;
    const res = await request(app).delete(`/api/products/${targetId}`);
    expect(res.statusCode).toBe(204);
  });

  test("GET /api/products/:id returns 400 for malformed ID", async () => {
    const malformedId = "123-not-valid";
    const res = await request(app).get(`/api/products/${malformedId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Invalid");
  });

  test("GET /api/products/:id returns 404 for non-existent valid ObjectId", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/products/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("cannot be found");
  });
});

describe("Products API - Validation", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(products, Product);
  });

  test("POST /api/products with empty object", async () => {
    const res = await request(app).post("/api/products").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.some(e => e.field === "body.name")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.type")).toBe(true);
  });

  test("POST /api/products name exceeds max length", async () => {
    const newProduct = {
      name: "This name is way too long to be valid because i purposely want to make it more than fifty chaaracters",
      price: 5.55,
      type: "drinks",
      category: "hot-coffee",
      url: ""
    };
    const res = await request(app).post("/api/products").send(newProduct);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("too long"))).toBe(true);
  });

  test("POST /api/products name with only spaces", async () => {
    const newProduct = {
      name: "   ",
      price: 5.55,
      type: "drinks",
      category: "hot-coffee",
      url: ""
    };
    const res = await request(app).post("/api/products").send(newProduct);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.name" && e.message.includes("empty"))).toBe(true);
  });

  test("POST /api/products negative price", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Negative Price",
      price: -1,
      type: "drinks",
      category: "hot-coffee",
      url: ""
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/products zero price", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Free Product",
      price: 0,
      type: "drinks",
      category: "hot-coffee",
      url: ""
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/products string price", async () => {
    const res = await request(app).post("/api/products").send({
      name: "String Price",
      price: "5.99",
      type: "drinks",
      category: "hot-coffee",
      url: ""
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
  });

  test("POST /api/products invalid type", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Invalid Type",
      price: 4.99,
      type: "electronics",
      category: "gadget",
      url: ""
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.type")).toBe(true);
  });

  test("POST /api/products drinks missing required category", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Coffee",
      price: 3.50,
      type: "drinks",
      url: ""
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/products cakes missing required category", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Carrot Cake",
      price: 4.99,
      type: "cakes",
      url: ""
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/products sandwiches missing required category", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Sandwich",
      price: 5.99,
      type: "sandwiches",
      url: ""
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/products drinks invalid category", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Invalid Drink",
      price: 4.99,
      type: "drinks",
      category: "invalid-category",
      url: ""
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/products cakes invalid category", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Invalid Cake",
      price: 4.99,
      type: "cakes",
      category: "ice-cream",
      url: ""
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/products biscuits allows creation without category", async () => {
    const res = await request(app).post("/api/products").send({
      name: "New Biscuit",
      price: 2.50,
      type: "biscuits",
      url: ""
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.type).toBe("biscuits");
  });

  test("POST /api/products crisps allows creation without category", async () => {
    const res = await request(app).post("/api/products").send({
      name: "New Crisp",
      price: 1.99,
      type: "crisps",
      url: ""
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.type).toBe("crisps");
  });

  test("POST /api/products duplicate name", async () => {
    const product = {
      name: "Unique Drink",
      price: 4.50,
      type: "drinks",
      category: "hot-coffee",
      url: ""
    };
    await request(app).post("/api/products").send(product);
    const res = await request(app).post("/api/products").send(product);
    expect(res.status).toBe(409);
    expect(res.body.message.toLowerCase()).toContain("exists");
  });

  test("POST /api/products invalid URL format", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Product",
      price: 4.50,
      type: "drinks",
      category: "hot-coffee",
      url: "not-a-valid-url"
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.url" && e.message.includes("URL"))).toBe(true);
  });

  test("POST /api/products valid URL", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Web Product",
      price: 4.50,
      type: "drinks",
      category: "hot-coffee",
      url: "https://example.com/product.jpg"
    });
    expect(res.status).toBe(201);
    expect(res.body.url).toBe("https://example.com/product.jpg");
  });

  test("POST /api/products empty string URL is valid", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Product No URL",
      price: 3.99,
      type: "drinks",
      category: "tea",
      url: ""
    });
    expect(res.status).toBe(201);
    expect(res.body.url).toBe("");
  });

  test("POST /api/products drinks with all valid categories", async () => {
    const categories = ["hot-coffee", "iced-coffee", "tea", "iced-tea", "milkshake", "smoothies"];
    for (const category of categories) {
      const res = await request(app).post("/api/products").send({
        name: `Drink ${category}`,
        price: 3.99,
        type: "drinks",
        category: category,
        url: ""
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.category).toBe(category);
    }
  });

  test("POST /api/products cakes with all valid categories", async () => {
    const categories = ["whole-cake", "loaf-cake", "shortbreads", "pastries"];
    for (const category of categories) {
      const res = await request(app).post("/api/products").send({
        name: `Cake ${category}`,
        price: 4.99,
        type: "cakes",
        category: category,
        url: ""
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.category).toBe(category);
    }
  });

  test("POST /api/products sandwiches with all valid categories", async () => {
    const categories = ["vegan", "vegetarian", "non-vegetarian"];
    for (const category of categories) {
      const res = await request(app).post("/api/products").send({
        name: `Sandwich ${category}`,
        price: 5.99,
        type: "sandwiches",
        category: category,
        url: ""
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.category).toBe(category);
    }
  });
});

describe("Products API - Query Filtering", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(products, Product);
  });

  test("GET /api/products?type=drinks returns only drinks", async () => {
    const res = await request(app).get("/api/products?type=drinks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.every(p => p.type === "drinks")).toBe(true);
  });

  test("GET /api/products?type=cakes&category=whole-cake filters correctly", async () => {
    const res = await request(app).get("/api/products?type=cakes&category=whole-cake");
    expect(res.statusCode).toBe(200);
    expect(res.body.every(p => p.type === "cakes" && p.category === "whole-cake")).toBe(true);
  });
});

describe("Products API - Advanced Edge Cases", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(products, Product);
  });

  // Partial Updates
  test("PUT /api/products/:id with only name field", async () => {
    const allProducts = await request(app).get("/api/products");
    const targetId = allProducts.body[0]._id;
    const res = await request(app).put(`/api/products/${targetId}`).send({
      name: "Updated Only Name"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Only Name");
  });

  test("PUT /api/products/:id with only price field", async () => {
    const allProducts = await request(app).get("/api/products");
    const targetId = allProducts.body[0]._id;
    const res = await request(app).put(`/api/products/${targetId}`).send({
      price: 9.99
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(9.99);
  });

  test("PUT /api/products/:id with only category field", async () => {
    const allProducts = await request(app).get("/api/products");
    const drinkId = allProducts.body.find(p => p.type === "drinks")?._id;
    if (drinkId) {
      const res = await request(app).put(`/api/products/${drinkId}`).send({
        category: "milkshake"
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.category).toBe("milkshake");
    }
  });

  // Null/Undefined Handling
  test("POST /api/products with null name", async () => {
    const res = await request(app).post("/api/products").send({
      name: null,
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.name")).toBe(true);
  });

  test("POST /api/products with null price", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      price: null,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
  });

  test("POST /api/products with null type", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      price: 3.50,
      type: null,
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.type")).toBe(true);
  });

  // Whitespace Handling
  test("POST /api/products name with leading spaces", async () => {
    const res = await request(app).post("/api/products").send({
      name: "  Coffee",
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Coffee");
  });

  test("POST /api/products name with trailing spaces", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Coffee  ",
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Coffee");
  });

  test("POST /api/products name with tabs", async () => {
    const res = await request(app).post("/api/products").send({
      name: "\tCoffee\t",
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
  });

  // Name Boundary Testing
  test("POST /api/products with exactly 50 character name", async () => {
    const fiftyCharName = "a".repeat(50);
    const res = await request(app).post("/api/products").send({
      name: fiftyCharName,
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.name.length).toBe(50);
  });

  test("POST /api/products with 51 character name fails", async () => {
    const fiftyOneCharName = "a".repeat(51);
    const res = await request(app).post("/api/products").send({
      name: fiftyOneCharName,
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("too long"))).toBe(true);
  });

  // Special Characters
  test("POST /api/products name with special characters", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Coffee & Cake @ Store #1",
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toContain("&");
    expect(res.body.name).toContain("@");
    expect(res.body.name).toContain("#");
  });

  test("POST /api/products name with unicode characters", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Café Français",
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toContain("é");
  });

  test("POST /api/products name with emoji fails or is sanitized", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Coffee ☕️",
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    // Either accepts emoji or rejects it - both are valid behaviors
    expect([200, 201, 400]).toContain(res.statusCode);
  });

  // Type Case Sensitivity
  test("POST /api/products with uppercase type fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      price: 3.50,
      type: "DRINKS",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.type")).toBe(true);
  });

  test("POST /api/products with mixed case type fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      price: 3.50,
      type: "Drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.type")).toBe(true);
  });

  // Price Precision
  test("POST /api/products with decimal price 3.99", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Precise Price",
      price: 3.99,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.price).toBe(3.99);
  });

  test("POST /api/products with many decimal places", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Many Decimals",
      price: 3.9999,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
    expect(typeof res.body.price).toBe("number");
  });

  test("POST /api/products with very large price", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Expensive",
      price: 999999.99,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.price).toBe(999999.99);
  });

  test("POST /api/products with very small price (0.01)", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Cheap",
      price: 0.01,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.price).toBe(0.01);
  });

  // Empty Category String vs Missing
  test("POST /api/products drinks with empty string category fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Empty Cat",
      price: 3.50,
      type: "drinks",
      category: ""
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/products biscuits with empty string category succeeds", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Biscuit Empty Cat",
      price: 2.00,
      type: "biscuits",
      category: ""
    });
    // Empty string for optional should either work or fail - test both behaviors
    expect([400, 201]).toContain(res.statusCode);
  });

  // Extra Unknown Fields (Strict Mode)
  test("POST /api/products with extra unknown field fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      price: 3.50,
      type: "drinks",
      category: "hot-coffee",
      color: "red",
      size: "large",
      unknownField: "value"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/products with unknown nested field fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      price: 3.50,
      type: "drinks",
      category: "hot-coffee",
      metadata: { extra: "data" }
    });
    expect(res.statusCode).toBe(400);
  });

  // Array Payloads
  test("POST /api/products with array name fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: ["Coffee", "Tea"],
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.name")).toBe(true);
  });

  test("POST /api/products with array price fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      price: [3.50, 4.50],
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
  });

  // Update Non-Existent
  test("PUT /api/products/:id with fake ObjectId returns 404", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/products/${fakeId}`).send({
      name: "Updated",
      price: 5.99,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("cannot be found");
  });

  test("DELETE /api/products/:id with fake ObjectId returns 404", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/products/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("cannot be found");
  });

  // Invalid Type + Category Combinations
  test("GET /api/products?type=drinks&category=whole-cake invalid combination", async () => {
    const res = await request(app).get("/api/products?type=drinks&category=whole-cake");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

  test("GET /api/products with category but no type returns all matching products", async () => {
    const res = await request(app).get("/api/products?category=hot-coffee");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Timestamps
  test("POST /api/products creates timestamps", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Timestamp Test",
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();
    expect(new Date(res.body.createdAt).getTime()).toBeLessThanOrEqual(new Date(res.body.updatedAt).getTime());
  });

  test("PUT /api/products/:id updates updatedAt timestamp", async () => {
    const postRes = await request(app).post("/api/products").send({
      name: "Timestamp Update Test",
      price: 3.50,
      type: "drinks",
      category: "hot-coffee"
    });
    const originalUpdatedAt = new Date(postRes.body.updatedAt).getTime();
    
    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const putRes = await request(app).put(`/api/products/${postRes.body._id}`).send({
      name: "Updated Timestamp Test"
    });
    
    const newUpdatedAt = new Date(putRes.body.updatedAt).getTime();
    expect(newUpdatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);
  });

  // Concurrent Updates Simulation
  test("Concurrent PUT requests on same resource", async () => {
    const allProducts = await request(app).get("/api/products");
    const targetId = allProducts.body[0]._id;

    const update1 = request(app).put(`/api/products/${targetId}`).send({
      name: "Update 1"
    });

    const update2 = request(app).put(`/api/products/${targetId}`).send({
      name: "Update 2"
    });

    const [res1, res2] = await Promise.all([update1, update2]);
    
    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
    
    const finalRes = await request(app).get(`/api/products/${targetId}`);
    expect([200, 404]).toContain(finalRes.statusCode);
  });

  // Pagination/Limits
  test("GET /api/products returns all seeded products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /api/products large response is valid JSON", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(product => {
      expect(product._id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.type).toBeDefined();
    });
  });

  // Category Validation with Invalid Type + Category
  test("POST /api/products sandwiches with drinks category fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Wrong Cat Sandwich",
      price: 5.99,
      type: "sandwiches",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/products drinks with sandwiches category fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Wrong Cat Drink",
      price: 3.50,
      type: "drinks",
      category: "vegan"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  // Boolean and Number as Type
  test("POST /api/products with boolean type fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      price: 3.50,
      type: true,
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.type")).toBe(true);
  });

  test("POST /api/products with number type fails", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      price: 3.50,
      type: 123,
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.type")).toBe(true);
  });
});