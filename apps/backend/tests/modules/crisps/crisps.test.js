import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app.js";
import resetData from "../../../src/utils/resetData.js";
import dotenv from "dotenv";
import Crisp from "../../../src/modules/crisps/crisp.model.js";
import  { crisps } from "../../../src/seeders/buscuitsAndCrispsSeed.js";
dotenv.config();

describe("Crisps API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(crisps, Crisp);
  });

  test("GET /api/crisps returns an array", async () => {
    const res = await request(app).get("/api/crisps");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/crisps/:id returns the correct crisp", async () => {
    const crisps = await request(app).get("/api/crisps");
    const target = crisps.body[0];
    const targetId = target._id;
    const res = await request(app).get(`/api/crisps/${targetId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(target.name);
    expect(res.body._id).toBe(targetId);
  });

  test("POST /api/crisps creates a new crisp", async () => {
    const newCrisp = {
      name: "Salt and Vinegar",
      price: 1.99,
      url: ""
    };
    const res = await request(app).post("/api/crisps").send(newCrisp);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newCrisp.name);
    expect(res.body._id).toBeDefined();
  });

  test("PUT /api/crisps/:id updates a crisp", async () => {
    const crisps = await request(app).get("/api/crisps");
    const targetId = crisps.body[0]._id;
    const updatedData = {
      name: "Updated Crisp",
      price: 2.99,
      url: ""
    };
    const res = await request(app).put(`/api/crisps/${targetId}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.price).toBe(updatedData.price);
  });

  test("DELETE /api/crisps/:id removes a crisp", async () => {
    const crisps = await request(app).get("/api/crisps");
    const targetId = crisps.body[0]._id;
    const res = await request(app).delete(`/api/crisps/${targetId}`);
    expect(res.statusCode).toBe(204);
  });

  test("GET /api/crisps/:id returns 400 for malformed ID", async () => {
    const malformedId = "123-not-valid";
    const res = await request(app).get(`/api/crisps/${malformedId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Invalid");
  });

  test("GET /api/crisps/:id returns 404 for non-existent valid ObjectId", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/crisps/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("cannot be found");
  });
});

describe("Crisps API Validation", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(crisps, Crisp);
  });

  test("POST /api/crisps with an empty object", async () => {
    const res = await request(app).post("/api/crisps").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveLength(2);
    expect(res.body.errors.some(e => e.field === "body.name")).toBe(true);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
  });

  test("POST /api/crisps violates character constraints", async () => {
    const newCrisp = {
      name: "This name is way too long to be valid because i purposely want to make it more than fifty chaaracters",
      price: 1.55,
      url: ""
    };
    const res = await request(app).post("/api/crisps").send(newCrisp);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("too long"))).toBe(true);
  });

  test("POST /api/crisps name with only spaces", async () => {
    const newCrisp = {
      name: "   ",
      price: 1.55,
      url: ""
    };
    const res = await request(app).post("/api/crisps").send(newCrisp);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.name" && e.message.includes("empty"))).toBe(true);
  });

  test("POST /api/crisps negative price", async () => {
    const res = await request(app).post("/api/crisps").send({
      name: "Sour Crisp",
      price: -1,
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/crisps zero price", async () => {
    const res = await request(app).post("/api/crisps").send({
      name: "Free Crisp",
      price: 0,
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price" && e.message.includes("greater than zero"))).toBe(true);
  });

  test("POST /api/crisps string price", async () => {
    const res = await request(app).post("/api/crisps").send({
      name: "String Price Crisp",
      price: "1.99",
      url: ""
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.price")).toBe(true);
  });

  test("POST /api/crisps duplicate name", async () => {
    const crisp = {
      name: "Cheese and Onion",
      price: 1.2,
      url: ""
    };
    await request(app).post("/api/crisps").send(crisp);
    const res = await request(app).post("/api/crisps").send(crisp);
    expect(res.status).toBe(409);
    expect(res.body.message.toLowerCase()).toContain("exists");
  });

  test("POST /api/crisps invalid URL format", async () => {
    const res = await request(app).post("/api/crisps").send({
      name: "Crisp",
      price: 1.50,
      url: "not-a-valid-url"
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.url" && e.message.includes("URL"))).toBe(true);
  });

  test("POST /api/crisps valid URL", async () => {
    const res = await request(app).post("/api/crisps").send({
      name: "Web Crisp",
      price: 1.50,
      url: "https://example.com/crisp.jpg"
    });
    expect(res.status).toBe(201);
    expect(res.body.url).toBe("https://example.com/crisp.jpg");
  });
});