import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app.js";
import dotenv from "dotenv";

import Product from "../../../src/modules/products/product.model.js";
import products from "../../../src/seeders/productSeed.js";

import User from "../../../src/modules/users/user.model.js";
import testUsers from "../../../src/seeders/userSeed.js";

import resetData, { dropTestDatabase } from "../../../src/utils/resetData.js";

dotenv.config();

let adminToken;
let managerToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);

  await dropTestDatabase();
  await resetData(User, testUsers);
  await resetData(Product, products);

  const adminLogin = await request(app).post("/api/auth/login").send({
    usernameOrEmail: "adminuser",
    password: "password123"
  });
  adminToken = adminLogin.body.token;


  const managerLogin = await request(app).post("/api/auth/login").send({
    usernameOrEmail: "manageruser",
    password: "password123"
  });
  managerToken = managerLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe("Products API CRUD Operations", () => {
  beforeEach(async () => {
    await resetData(Product, products);
  });

  test("GET /api/products returns an array", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/products/:id returns correct product", async () => {
    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const target = all.body[0];

    const res = await request(app)
      .get(`/api/products/${target._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(target._id);
    expect(res.body.name).toBe(target.name);
  });

  test("POST /api/products creates a drink with category", async () => {
    const newProduct = {
      name: "Vanilla Latte",
      price: 4.5,
      type: "drinks",
      category: "hot-coffee",
      url: ""
    };

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send(newProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Vanilla Latte");
    expect(res.body.type).toBe("drinks");
    expect(res.body.category).toBe("hot-coffee");
  });

  test("POST /api/products creates a biscuit without category", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Oatmeal Cookie",
        price: 2.0,
        type: "biscuits",
        url: ""
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.type).toBe("biscuits");
    expect(res.body.category).toBeUndefined();
  });

  test("PUT /api/products/:id updates a product", async () => {
    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const id = all.body[0]._id;

    const res = await request(app)
      .put(`/api/products/${id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated Product",
        price: 5.99,
        type: "drinks",
        category: "iced-coffee",
        url: ""
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Product");
  });

  test("DELETE /api/products/:id removes a product", async () => {
    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const id = all.body[0]._id;

    const res = await request(app)
      .delete(`/api/products/${id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });
});

describe("Products API  Validation", () => {
  beforeEach(async () => {
    await resetData(Product, products);
  });

  test("POST /api/products with empty object fails", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.name")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.type")).toBe(true);
  });

  test("POST /api/products name exceeds max length", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "a".repeat(60),
        price: 5.55,
        type: "drinks",
        category: "hot-coffee",
        url: ""
      });

    expect(res.statusCode).toBe(400);
  });

  test("POST /api/products negative price fails", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Negative Price",
        price: -1,
        type: "drinks",
        category: "hot-coffee",
        url: ""
      });

    expect(res.statusCode).toBe(400);
  });

  test("POST /api/products invalid type fails", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Invalid Type",
        price: 4.99,
        type: "electronics",
        category: "gadget",
        url: ""
      });

    expect(res.statusCode).toBe(400);
  });

  test("POST /api/products drinks missing category fails", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Coffee",
        price: 3.5,
        type: "drinks",
        url: ""
      });

    expect(res.statusCode).toBe(400);
  });

  test("POST /api/products biscuits without category succeeds", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "New Biscuit",
        price: 2.5,
        type: "biscuits",
        url: ""
      });

    expect(res.statusCode).toBe(201);
  });

  test("POST /api/products duplicate name fails", async () => {
    const product = {
      name: "Unique Drink",
      price: 4.5,
      type: "drinks",
      category: "hot-coffee",
      url: ""
    };

    await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send(product);

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send(product);

    expect(res.statusCode).toBe(409);
  });
});


describe("Products API  Query Filtering", () => {
  beforeEach(async () => {
    await resetData(Product, products);
  });

  test("GET /api/products?type=drinks returns only drinks", async () => {
    const res = await request(app).get("/api/products?type=drinks");

    expect(res.statusCode).toBe(200);
    expect(res.body.every(p => p.type === "drinks")).toBe(true);
  });

  test("GET /api/products?type=cakes&category=whole-cake filters correctly", async () => {
    const res = await request(app).get("/api/products?type=cakes&category=whole-cake");

    expect(res.statusCode).toBe(200);
    expect(res.body.every(p => p.type === "cakes" && p.category === "whole-cake")).toBe(true);
  });
});


describe("Products API  Advanced Edge Cases", () => {
  beforeEach(async () => {
    await resetData(Product, products);
  });

  test("PUT /api/products/:id with only name field", async () => {
    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const id = all.body[0]._id;

    const res = await request(app)
      .put(`/api/products/${id}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({ name: "Updated Only Name" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Only Name");
  });

  test("POST /api/products with null name fails", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: null,
        price: 3.5,
        type: "drinks",
        category: "hot-coffee"
      });

    expect(res.statusCode).toBe(400);
  });

  test("POST /api/products name with leading spaces is trimmed", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "  Coffee",
        price: 3.5,
        type: "drinks",
        category: "hot-coffee"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Coffee");
  });

  test("POST /api/products with exactly 50 character name succeeds", async () => {
    const name = "a".repeat(50);

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name,
        price: 3.5,
        type: "drinks",
        category: "hot-coffee"
      });

    expect(res.statusCode).toBe(201);
  });

  test("POST /api/products with 51 character name fails", async () => {
    const name = "a".repeat(51);

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name,
        price: 3.5,
        type: "drinks",
        category: "hot-coffee"
      });

    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/products/:id with fake ObjectId returns 404", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/products/${fakeId}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Updated",
        price: 5.99,
        type: "drinks",
        category: "hot-coffee"
      });

    expect(res.statusCode).toBe(404);
  });

  test("DELETE /api/products/:id with fake ObjectId returns 404", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/products/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});
describe("Products API  Authorization", () => {
  beforeEach(async () => {
    await resetData(Product, products);
  });

  test("POST /api/products without token → 401", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      price: 3.5,
      type: "drinks",
      category: "hot-coffee"
    });
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/products with invalid token → 401", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", "Bearer invalidtoken")
      .send({
        name: "Test",
        price: 3.5,
        type: "drinks",
        category: "hot-coffee"
      });
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/products as normal user → 403", async () => {
    const login = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "user_test",
      password: "password123"
    });

    const userToken = login.body.token;

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Forbidden",
        price: 3.5,
        type: "drinks",
        category: "hot-coffee"
      });

    expect(res.statusCode).toBe(403);
  });

  test("PUT /api/products/:id as normal user → 403", async () => {
    const login = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "user_test",
      password: "password123"
    });

    const userToken = login.body.token;

    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const id = all.body[0]._id;

    const res = await request(app)
      .put(`/api/products/${id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Nope" });

    expect(res.statusCode).toBe(403);
  });

  test("DELETE /api/products/:id as normal user → 403", async () => {
    const login = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "user_test",
      password: "password123"
    });

    const userToken = login.body.token;

    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const id = all.body[0]._id;

    const res = await request(app)
      .delete(`/api/products/${id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});
describe("Products API PUT Strict Mode", () => {
  beforeEach(async () => {
    await resetData(Product, products);
    await Product.syncIndexes();
  });

  test("PUT /api/products/:id with unknown field → 400", async () => {
    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const id = all.body[0]._id;

    const res = await request(app)
      .put(`/api/products/${id}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Valid Name",
        unknownField: "value"
      });

    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/products/:id with nested unknown field → 400", async () => {
    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const id = all.body[0]._id;

    const res = await request(app)
      .put(`/api/products/${id}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Valid",
        metadata: { extra: "data" }
      });

    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/products/:id with empty body → 400", async () => {
    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const id = all.body[0]._id;

    const res = await request(app)
      .put(`/api/products/${id}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({});

    expect(res.statusCode).toBe(200);
  });

  test("PUT /api/products/:id with invalid partial field → 400", async () => {
    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const id = all.body[0]._id;

    const res = await request(app)
      .put(`/api/products/${id}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        price: "not-a-number"
      });

    expect(res.statusCode).toBe(400);
  });
});
describe("Products API  Duplicate Update Handling", () => {
  beforeEach(async () => {
    await resetData(Product, products);
  });

  test("PUT /api/products/:id updating name to existing product name → 409", async () => {
    const all = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${adminToken}`);

    const first = all.body[0];
    const second = all.body[1];

    const res = await request(app)
      .put(`/api/products/${second._id}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: first.name
      });

    expect(res.statusCode).toBe(409);
  });
});
describe("Products API URL Edge Cases", () => {
  beforeEach(async () => {
    await resetData(Product, products);
  });

  test("POST /api/products invalid URL → 400", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Bad URL",
        price: 3.5,
        type: "drinks",
        category: "hot-coffee",
        url: "not-a-url"
      });

    expect(res.statusCode).toBe(400);
  });

  test("POST /api/products URL with spaces → 400", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Bad URL",
        price: 3.5,
        type: "drinks",
        category: "hot-coffee",
        url: "https://example .com/image.jpg"
      });

    expect(res.statusCode).toBe(400);
  });

  test("POST /api/products URL with query params → 201", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Query URL",
        price: 3.5,
        type: "drinks",
        category: "hot-coffee",
        url: "https://example.com/image.jpg?size=large"
      });

    expect(res.statusCode).toBe(201);
  });

  test("POST /api/products empty string URL → 201", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Empty URL",
        price: 3.5,
        type: "drinks",
        category: "hot-coffee",
        url: ""
      });

    expect(res.statusCode).toBe(201);
  });
});
describe("Products API  Category Matrix", () => {
  beforeEach(async () => {
    await resetData(Product, products);
  });

  const drinkCategories = [
    "hot-coffee",
    "iced-coffee",
    "tea",
    "iced-tea",
    "milkshake",
    "smoothies"
  ];

  const cakeCategories = [
    "whole-cake",
    "loaf-cake",
    "shortbreads",
    "pastries"
  ];

  const sandwichCategories = [
    "vegan",
    "vegetarian",
    "non-vegetarian"
  ];

  test("Valid drink categories succeed", async () => {
    for (const category of drinkCategories) {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          name: `Drink ${category}`,
          price: 3.5,
          type: "drinks",
          category,
          url: ""
        });

      expect(res.statusCode).toBe(201);
    }
  });

  test("Invalid drink category fails", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Invalid Drink",
        price: 3.5,
        type: "drinks",
        category: "invalid",
        url: ""
      });

    expect(res.statusCode).toBe(400);
  });

  test("Valid cake categories succeed", async () => {
    for (const category of cakeCategories) {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          name: `Cake ${category}`,
          price: 4.5,
          type: "cakes",
          category,
          url: ""
        });

      expect(res.statusCode).toBe(201);
    }
  });

  test("Invalid cake category fails", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Invalid Cake",
        price: 4.5,
        type: "cakes",
        category: "invalid",
        url: ""
      });

    expect(res.statusCode).toBe(400);
  });

  test("Valid sandwich categories succeed", async () => {
    for (const category of sandwichCategories) {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          name: `Sandwich ${category}`,
          price: 5.0,
          type: "sandwiches",
          category,
          url: ""
        });

      expect(res.statusCode).toBe(201);
    }
  });

  test("Invalid sandwich category fails", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        name: "Invalid Sandwich",
        price: 5.0,
        type: "sandwiches",
        category: "invalid",
        url: ""
      });

    expect(res.statusCode).toBe(400);
  });
});
