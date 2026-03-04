import request from "supertest";
import app from "../../../src/app.js";
import { resetDrinks } from "../../../src/modules/drinks/drink.service.js";

describe("Drinks API", () => {
  beforeEach(() => resetDrinks())
  
  test("GET /api/drinks returns an array", async () => {
    const res = await request(app).get("/api/drinks");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/drinks/3 returns the correct drink", async () => {
    const res = await request(app).get("/api/drinks/3");

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(3);
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
    expect(res.body.price).toBe(newDrink.price);
    expect(res.body.id).toBeDefined();
  });

  test("PUT /api/drinks/:id updates a drink", async () => {
    const updatedData = {
      name: "Updated Drink",
      price: 4.99
    };

    const res = await request(app)
      .put("/api/drinks/1")
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.price).toBe(updatedData.price);
  });

  test("DELETE /api/drinks/:id removes a drink", async () => {
    const res = await request(app).delete("/api/drinks/2");

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });

  test("GET /api/drinks/:id returns 404 for non-existent drink", async () => {
  const nonExistentId = 999;
  const res = await request(app).get(`/api/drinks/${nonExistentId}`);
  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toBe(`No drink exist with Id - ${nonExistentId}`);
});
});