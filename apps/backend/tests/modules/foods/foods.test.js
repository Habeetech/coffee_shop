import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app.js";
import resetData from "../../../src/utils/resetData.js";
import dotenv from "dotenv";
import Food from "../../../src/modules/foods/food.model.js";
import foods from "../../../src/seeders/foodSeed.js";
dotenv.config();

describe("Foods API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(foods, Food);
  });

  test("GET /api/foods returns an array", async () => {
    const res = await request(app).get("/api/foods");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/foods/:id returns the correct food", async () => {
    const foods = await request(app).get("/api/foods");
    const target = foods.body[0];
    const targetId = target._id;
    const res = await request(app).get(`/api/foods/${targetId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(target.name);
    expect(res.body._id).toBe(targetId);
  });

  test("POST /api/foods creates a new food", async () => {
    const newFood = {
      name: "Sandwich",
      price: 4.99,
      category: "non-vegetarian",
      url: ""
    };
    const res = await request(app).post("/api/foods").send(newFood);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newFood.name);
    expect(res.body._id).toBeDefined();
  });

  test("PUT /api/foods/:id updates a food", async () => {
    const foods = await request(app).get("/api/foods");
    const targetId = foods.body[0]._id;
    const updatedData = {
      name: "Updated Food",
      price: 5.99,
      category: "vegan",
      url: ""
    };
    const res = await request(app).put(`/api/foods/${targetId}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.price).toBe(updatedData.price);
  });

  test("DELETE /api/foods/:id removes a food", async () => {
    const foods = await request(app).get("/api/foods");
    const targetId = foods.body[0]._id;
    const res = await request(app).delete(`/api/foods/${targetId}`);
    expect(res.statusCode).toBe(204);
  });

  test("GET /api/foods/:id returns 400 for malformed ID", async () => {
    const malformedId = "123-not-valid";
    const res = await request(app).get(`/api/foods/${malformedId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Invalid");
  });

  test("GET /api/foods/:id returns 404 for non-existent valid ObjectId", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/foods/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("cannot be found");
  });
});

describe("Foods API Validation", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(foods, Food);
  });

  test("POST /api/foods with an empty object", async () => {
    const res = await request(app).post("/api/foods").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveLength(3);
    expect(res.body.errors.some(e => e.field === "body.name")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/foods violates character constraints", async () => {
    const newFood = {
      name: "This name is way too long to be valid because i purposely want to make it more than fifty chaaracters",
      price: 4.55,
      category: "vegan",
      url: ""
    };
    const res = await request(app).post("/api/foods").send(newFood);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("too long"))).toBe(true);
  });

  test("POST /api/foods name with only spaces", async () => {
    const newFood = {
      name: "   ",
      price: 4.55,
      category: "vegan",
      url: ""
    };
    const res = await request(app).post("/api/foods").send(newFood);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.name" && e.message.includes("empty"))).toBe(true);
  });

  test("POST /api/foods negative price", async () => {
    const res = await request(app).post("/api/foods").send({
      name: "Sour Food",
      price: -1,
      category: "vegan",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/foods zero price", async () => {
    const res = await request(app).post("/api/foods").send({
      name: "Free Food",
      price: 0,
      category: "vegan",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price" && e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/foods string price", async () => {
    const res = await request(app).post("/api/foods").send({
      name: "String Price Food",
      price: "4.99",
      category: "vegan",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
  });

  test("POST /api/foods duplicate name", async () => {
    const food = {
      name: "Burger",
      price: 5.5,
      category: "non-vegetarian",
      url: ""
    };
    await request(app).post("/api/foods").send(food);
    const res = await request(app).post("/api/foods").send(food);
    expect(res.status).toBe(409);
    expect(res.body.message.toLowerCase()).toContain("exists");
  });

  test("POST /api/foods invalid URL format", async () => {
    const res = await request(app).post("/api/foods").send({
      name: "Food",
      price: 4.50,
      category: "vegan",
      url: "not-a-valid-url"
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.url" && e.message.includes("URL"))).toBe(true);
  });

  test("POST /api/foods valid URL", async () => {
    const res = await request(app).post("/api/foods").send({
      name: "Web Food",
      price: 4.50,
      category: "vegan",
      url: "https://example.com/food.jpg"
    });
    expect(res.status).toBe(201);
    expect(res.body.url).toBe("https://example.com/food.jpg");
  });
});