import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app.js";
import resetData from "../../../src/utils/resetData.js";
import dotenv from "dotenv";
import Cake from "../../../src/modules/cakes/cake.model.js";
import cakes from "../../../src/seeders/cakeSeed.js";
dotenv.config();

describe("Cakes API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(cakes, Cake);
  });

  test("GET /api/cakes returns an array", async () => {
    const res = await request(app).get("/api/cakes");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/cakes/:id returns the correct cake", async () => {
    const cakes = await request(app).get("/api/cakes");
    const target = cakes.body[0];
    const targetId = target._id;
    const res = await request(app).get(`/api/cakes/${targetId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(target.name);
    expect(res.body._id).toBe(targetId);
  });

  test("POST /api/cakes creates a new cake", async () => {
    const newCake = {
      name: "Chocolate Cake",
      price: 5.99,
      category: "whole-cake",
      url: ""
    };
    const res = await request(app).post("/api/cakes").send(newCake);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newCake.name);
    expect(res.body._id).toBeDefined();
  });

  test("PUT /api/cakes/:id updates a cake", async () => {
    const cakes = await request(app).get("/api/cakes");
    const targetId = cakes.body[0]._id;
    const updatedData = {
      name: "Updated Cake",
      price: 6.99,
      category: "loaf-cake",
      url: ""
    };
    const res = await request(app).put(`/api/cakes/${targetId}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.price).toBe(updatedData.price);
  });

  test("DELETE /api/cakes/:id removes a cake", async () => {
    const cakes = await request(app).get("/api/cakes");
    const targetId = cakes.body[0]._id;
    const res = await request(app).delete(`/api/cakes/${targetId}`);
    expect(res.statusCode).toBe(204);
  });

  test("GET /api/cakes/:id returns 400 for malformed ID", async () => {
    const malformedId = "123-not-valid";
    const res = await request(app).get(`/api/cakes/${malformedId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Invalid");
  });

  test("GET /api/cakes/:id returns 404 for non-existent valid ObjectId", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/cakes/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("cannot be found");
  });
});

describe("Cakes API Validation", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(cakes, Cake);
  });

  test("POST /api/cakes with an empty object", async () => {
    const res = await request(app).post("/api/cakes").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveLength(3);
    expect(res.body.errors.some(e => e.field === "body.name")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.category")).toBe(true);
  });

  test("POST /api/cakes violates character constraints", async () => {
    const newCake = {
      name: "This name is way too long to be valid because i purposely want to make it more than fifty chaaracters",
      price: 5.55,
      category: "whole-cake",
      url: ""
    };
    const res = await request(app).post("/api/cakes").send(newCake);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("too long"))).toBe(true);
  });

  test("POST /api/cakes name with only spaces", async () => {
    const newCake = {
      name: "   ",
      price: 5.55,
      category: "whole-cake",
      url: ""
    };
    const res = await request(app).post("/api/cakes").send(newCake);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.name" && e.message.includes("empty"))).toBe(true);
  });

  test("POST /api/cakes negative price", async () => {
    const res = await request(app).post("/api/cakes").send({
      name: "Sour Cake",
      price: -1,
      category: "whole-cake",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/cakes zero price", async () => {
    const res = await request(app).post("/api/cakes").send({
      name: "Free Cake",
      price: 0,
      category: "whole-cake",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price" && e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/cakes string price", async () => {
    const res = await request(app).post("/api/cakes").send({
      name: "String Price Cake",
      price: "5.99",
      category: "whole-cake",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
  });

  test("POST /api/cakes duplicate name", async () => {
    const cake = {
      name: "Vanilla Cake",
      price: 4.5,
      category: "whole-cake",
      url: ""
    };
    await request(app).post("/api/cakes").send(cake);
    const res = await request(app).post("/api/cakes").send(cake);
    expect(res.status).toBe(409);
    expect(res.body.message.toLowerCase()).toContain("exists");
  });

  test("POST /api/cakes invalid URL format", async () => {
    const res = await request(app).post("/api/cakes").send({
      name: "Cake",
      price: 4.50,
      category: "whole-cake",
      url: "not-a-valid-url"
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.url" && e.message.includes("URL"))).toBe(true);
  });

  test("POST /api/cakes valid URL", async () => {
    const res = await request(app).post("/api/cakes").send({
      name: "Web Cake",
      price: 4.50,
      category: "whole-cake",
      url: "https://example.com/cake.jpg"
    });
    expect(res.status).toBe(201);
    expect(res.body.url).toBe("https://example.com/cake.jpg");
  });
});