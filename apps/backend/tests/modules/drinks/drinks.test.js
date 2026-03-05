import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app.js";
import resetDrinks from "../../../src/utils/resetDrinks.js";
import dotenv from "dotenv";
dotenv.config();

describe("Drinks API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetDrinks();
  });

  test("GET /api/drinks returns an array", async () => {
    const res = await request(app).get("/api/drinks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/drinks/:id returns the correct drink", async () => {
    const drinks = await request(app).get("/api/drinks");
    const target = drinks.body[0];
    const targetId = target._id;
    const res = await request(app).get(`/api/drinks/${targetId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(target.name);
    expect(res.body._id).toBe(targetId);
  });

  test("POST /api/drinks creates a new drink", async () => {
    const newDrink = {
      name: "Red Summer Berries",
      url: "",
      price: 4.65,
      category: "smoothies"
    };
    const res = await request(app).post("/api/drinks").send(newDrink);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newDrink.name);
    expect(res.body._id).toBeDefined();
  });

  test("PUT /api/drinks/:id updates a drink", async () => {
    const drinks = await request(app).get("/api/drinks");
    const targetId = drinks.body[0]._id;
    const updatedData = {
      name: "Updated Drink",
      price: 4.99,
      category: "tea",
      url: ""
    };
    const res = await request(app).put(`/api/drinks/${targetId}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.price).toBe(updatedData.price);
  });

  test("DELETE /api/drinks/:id removes a drink", async () => {
    const drinks = await request(app).get("/api/drinks");
    const targetId = drinks.body[0]._id;
    const res = await request(app).delete(`/api/drinks/${targetId}`);
    expect(res.statusCode).toBe(204);
  });

  test("GET /api/drinks/:id returns 400 for malformed ID", async () => {
    const malformedId = "123-not-valid";
    const res = await request(app).get(`/api/drinks/${malformedId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Invalid");
  });

  test("GET /api/drinks/:id returns 404 for non-existent valid ObjectId", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/drinks/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("cannot be found");
  });
});

describe("Drinks Api Validation", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetDrinks();
  });

  test("POST /api/drinks with an empty object", async () => {
    const res = await request(app).post("/api/drinks").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveLength(3);
    expect(res.body.errors.some(e => e.field === "body.name")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/drinks violates character constraints", async () => {
    const newDrink = {
      name: "This name is way too long to be valid",
      price: 4.55,
      category: "tea",
      url: ""
    };
    const res = await request(app).post("/api/drinks").send(newDrink);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("too long"))).toBe(true);
  });

  test("POST /api/drinks name with only spaces", async () => {
    const newDrink = {
      name: "   ",
      price: 4.55,
      category: "tea",
      url: ""
    };
    const res = await request(app).post("/api/drinks").send(newDrink);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.name" && e.message.includes("empty"))).toBe(true);
  });

  test("POST /api/drinks name boundary (exactly 20 chars)", async () => {
    const newDrink = {
      name: "Hot Coffee Espresso!",
      price: 3.50,
      category: "hot-coffee",
      url: ""
    };
    const res = await request(app).post("/api/drinks").send(newDrink);
    expect(res.statusCode).toBe(201);
  });

  test("POST /api/drinks invalid category", async () => {
    const newDrink = {
      name: "Matcha",
      price: 4.99,
      category: "soda",
      url: ""
    };
    const res = await request(app).post("/api/drinks").send(newDrink);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/drinks invalid category (null)", async () => {
    const newDrink = {
      name: "Latte",
      price: 3.99,
      category: null,
      url: ""
    };
    const res = await request(app).post("/api/drinks").send(newDrink);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/drinks invalid category (number)", async () => {
    const newDrink = {
      name: "Espresso",
      price: 2.50,
      category: 123,
      url: ""
    };
    const res = await request(app).post("/api/drinks").send(newDrink);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/drinks invalid category (empty string)", async () => {
    const newDrink = {
      name: "Cappuccino",
      price: 4.00,
      category: "",
      url: ""
    };
    const res = await request(app).post("/api/drinks").send(newDrink);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("GET /api/drinks/123 Malformed ID (Zod Catch)", async () => {
    const res = await request(app).get("/api/drinks/123");
    expect(res.statusCode).toBe(400);
    expect(res.body.message.includes("Invalid")).toBe(true);
  });

  test("POST /api/drinks negative price", async () => {
    const res = await request(app).post("/api/drinks").send({
      name: "Sour Coffee",
      price: -1,
      category: "hot-coffee",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/drinks zero price", async () => {
    const res = await request(app).post("/api/drinks").send({
      name: "Free Drink",
      price: 0,
      category: "tea",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price" && e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/drinks string price", async () => {
    const res = await request(app).post("/api/drinks").send({
      name: "String Price Drink",
      price: "4.99",
      category: "milkshake",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
  });

  test("POST /api/drinks duplicate name", async () => {
    const drink = {
      name: "Mocha",
      price: 3.5,
      category: "hot-coffee",
      url: ""
    };
    await request(app).post("/api/drinks").send(drink);
    const res = await request(app).post("/api/drinks").send(drink);
    expect(res.status).toBe(409);
    expect(res.body.message.toLowerCase()).toContain("exists");
  });

  test("POST /api/drinks invalid URL format", async () => {
    const res = await request(app).post("/api/drinks").send({
      name: "Drink",
      price: 3.50,
      category: "hot-coffee",
      url: "not-a-valid-url"
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.url" && e.message.includes("URL"))).toBe(true);
  });

  test("POST /api/drinks valid URL", async () => {
    const res = await request(app).post("/api/drinks").send({
      name: "Web Drink",
      price: 3.50,
      category: "hot-coffee",
      url: "https://example.com/drink.jpg"
    });
    expect(res.status).toBe(201);
    expect(res.body.url).toBe("https://example.com/drink.jpg");
  });
});