import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app.js";
import resetDrinks from "../../../src/utils/resetDrinks.js";
import dotenv from "dotenv";
dotenv.config()

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

    const res = await request(app)
      .post("/api/drinks")
      .send(newDrink);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newDrink.name);
    expect(res.body._id).toBeDefined();
  });

  test("PUT /api/drinks/:id updates a drink", async () => {
    const drinks = await request(app).get("/api/drinks");
    const targetId = drinks.body[0]._id;
    const updatedData = {
      name: "Updated Drink",
      price: 4.99
    };

    const res = await request(app)
      .put(`/api/drinks/${targetId}`)
      .send(updatedData);

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
    expect(res.body.message).toContain("Invalid _id");
  });

  test("GET /api/drinks/:id returns 404 for non-existent valid ObjectId", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/drinks/${nonExistentId}`);
    
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("cannot be found");
  });
});