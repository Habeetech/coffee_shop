import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app.js";
import resetData from "../../../src/utils/resetData.js";
import dotenv from "dotenv";
import Buscuit from "../../../src/modules/buscuits/buscuit.model.js";
import { buscuits } from "../../../src/seeders/buscuitsAndCrispsSeed.js";
dotenv.config();

describe("Buscuits API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(buscuits, Buscuit);
  });

  test("GET /api/buscuits returns an array", async () => {
    const res = await request(app).get("/api/buscuits");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/buscuits/:id returns the correct buscuit", async () => {
    const buscuits = await request(app).get("/api/buscuits");
    const target = buscuits.body[0];
    const targetId = target._id;
    const res = await request(app).get(`/api/buscuits/${targetId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(target.name);
    expect(res.body._id).toBe(targetId);
  });

  test("POST /api/buscuits creates a new buscuit", async () => {
    const newBuscuit = {
      name: "Chocolate Biscuit",
      price: 2.99,
      url: ""
    };
    const res = await request(app).post("/api/buscuits").send(newBuscuit);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newBuscuit.name);
    expect(res.body._id).toBeDefined();
  });

  test("PUT /api/buscuits/:id updates a buscuit", async () => {
    const buscuits = await request(app).get("/api/buscuits");
    const targetId = buscuits.body[0]._id;
    const updatedData = {
      name: "Updated Biscuit",
      price: 3.99,
      url: ""
    };
    const res = await request(app).put(`/api/buscuits/${targetId}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.price).toBe(updatedData.price);
  });

  test("DELETE /api/buscuits/:id removes a buscuit", async () => {
    const buscuits = await request(app).get("/api/buscuits");
    const targetId = buscuits.body[0]._id;
    const res = await request(app).delete(`/api/buscuits/${targetId}`);
    expect(res.statusCode).toBe(204);
  });

  test("GET /api/buscuits/:id returns 400 for malformed ID", async () => {
    const malformedId = "123-not-valid";
    const res = await request(app).get(`/api/buscuits/${malformedId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Invalid");
  });

  test("GET /api/buscuits/:id returns 404 for non-existent valid ObjectId", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/buscuits/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("cannot be found");
  });
});

describe("Buscuits API Validation", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(buscuits, Buscuit);
  });

  test("POST /api/buscuits with an empty object", async () => {
    const res = await request(app).post("/api/buscuits").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveLength(2);
    expect(res.body.errors.some(e => e.field === "body.name")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
  });

  test("POST /api/buscuits violates character constraints", async () => {
    const newBuscuit = {
      name: "This name is way too long to be valid because i purposely want to make it more than fifty chaaracters",
      price: 2.55,
      url: ""
    };
    const res = await request(app).post("/api/buscuits").send(newBuscuit);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("too long"))).toBe(true);
  });

  test("POST /api/buscuits name with only spaces", async () => {
    const newBuscuit = {
      name: "   ",
      price: 2.55,
      url: ""
    };
    const res = await request(app).post("/api/buscuits").send(newBuscuit);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.name" && e.message.includes("empty"))).toBe(true);
  });

  test("POST /api/buscuits negative price", async () => {
    const res = await request(app).post("/api/buscuits").send({
      name: "Sour Biscuit",
      price: -1,
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/buscuits zero price", async () => {
    const res = await request(app).post("/api/buscuits").send({
      name: "Free Biscuit",
      price: 0,
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price" && e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/buscuits string price", async () => {
    const res = await request(app).post("/api/buscuits").send({
      name: "String Price Biscuit",
      price: "2.99",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
  });

  test("POST /api/buscuits duplicate name", async () => {
    const buscuit = {
      name: "Chocolate Chip",
      price: 1.5,
      url: ""
    };
    await request(app).post("/api/buscuits").send(buscuit);
    const res = await request(app).post("/api/buscuits").send(buscuit);
    expect(res.status).toBe(409);
    expect(res.body.message.toLowerCase()).toContain("exists");
  });

  test("POST /api/buscuits invalid URL format", async () => {
    const res = await request(app).post("/api/buscuits").send({
      name: "Biscuit",
      price: 1.50,
      url: "not-a-valid-url"
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.url" && e.message.includes("URL"))).toBe(true);
  });

  test("POST /api/buscuits valid URL", async () => {
    const res = await request(app).post("/api/buscuits").send({
      name: "Web Biscuit",
      price: 1.50,
      url: "https://example.com/biscuit.jpg"
    });
    expect(res.status).toBe(201);
    expect(res.body.url).toBe("https://example.com/biscuit.jpg");
  });
});