import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app.js";
import dotenv from "dotenv";

import drinkOptions from "../../../src/modules/drinkOptions/drinkOptions.model.js";
import User from "../../../src/modules/users/user.model.js";
import testUsers from "../../../src/seeders/userSeed.js";
import optionsSeed from "../../../src/seeders/optionsSeed.js";
import resetData from "../../../src/utils/resetData.js";

dotenv.config();

describe("Options API", () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_TEST_URI);
    }

    await resetData(User, testUsers);

  
    const adminLogin = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "adminuser",
      password: "password123",
    });
    adminToken = adminLogin.body.token;

  
    const userLogin = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "user_test",
      password: "password123",
    });
    userToken = userLogin.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(drinkOptions, optionsSeed);
  });

  // --- AUTHORIZATION TESTS ---
  describe("Role-Based Access Control (RBAC)", () => {
    const forbiddenMethods = [
      { method: "post", url: "/api/options", data: { options: { test: [] } } },
      { method: "put", url: "/api/options", data: { options: { size: [] } } },
      { method: "delete", url: "/api/options/size", data: null },
    ];

    forbiddenMethods.forEach(({ method, url, data }) => {
      test(`should return 403 when a regular user tries ${method.toUpperCase()} ${url}`, async () => {
        const req = request(app)[method](url).set("Authorization", `Bearer ${userToken}`);
        if (data) req.send(data);
        const res = await req;
        expect(res.statusCode).toBe(403);
      });

      test(`should return 401 when an unauthenticated user tries ${method.toUpperCase()} ${url}`, async () => {
        const req = request(app)[method](url);
        if (data) req.send(data);
        const res = await req;
        expect(res.statusCode).toBe(401);
      });
    });
  });

  // --- GET OPTIONS ---
  describe("GET /api/options", () => {
    test("should fetch all drink options", async () => {
      const res = await request(app).get("/api/options");
      expect(res.statusCode).toBe(200);
      const options = res.body.options || res.body;
      expect(options).toHaveProperty("size");
      expect(options.size.length).toBe(3);
    });
  });

  // --- CREATE OPTIONS (POST) ---
  describe("POST /api/options", () => {
    test("should add a new group successfully", async () => {
      const newGroup = {
        options: {
          tea_type: [
            { label: "Green", priceModifier: 0 },
            { label: "Black", priceModifier: 0.2 },
          ],
        },
      };
      const res = await request(app)
        .post("/api/options")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newGroup);

      expect(res.statusCode).toBe(201);
      const options = res.body.options || res.body;
      expect(options.tea_type).toBeDefined();
    });

    test("should fail if group name already exists (409)", async () => {
      const duplicateGroup = {
        options: {
          size: [{ label: "Micro", priceModifier: 0 }],
        },
      };
      const res = await request(app)
        .post("/api/options")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(duplicateGroup);

      expect(res.statusCode).toBe(409);
    });

    test("should fail if incoming labels are duplicates in payload (409)", async () => {
      const dupeLabels = {
        options: {
          temp: [
            { label: "Hot", priceModifier: 0 },
            { label: "hot", priceModifier: 0 }, 
          ],
        },
      };
      const res = await request(app)
        .post("/api/options")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(dupeLabels);

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toMatch(/duplicate/i);
    });
  });

  // --- UPDATE OPTIONS (PUT) ---
  describe("PUT /api/options", () => {
    test("should update existing item and add a new item to group", async () => {
      const doc = await drinkOptions.findOne();
      const group = doc.options.get("size");
      const sizeId = group[0]._id.toString();

      const updateData = {
        options: {
          size: [
            { _id: sizeId, label: "Super Small", priceModifier: 0.5 },
            { label: "Extra Large", priceModifier: 2.0 },
          ],
        },
      };

      const res = await request(app)
        .put("/api/options")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      const options = res.body.options || res.body;
      const updatedSize = options.size;
      expect(updatedSize.some((i) => i.label === "Super Small")).toBe(true);
      expect(updatedSize.some((i) => i.label === "Extra Large")).toBe(true);
    });

    test("should reject update if label already exists in database group (409)", async () => {
      const doc = await drinkOptions.findOne();
      const sizes = doc.options.get("size");
      const mediumItem = sizes.find((i) => i.label === "Medium");

      const badUpdate = {
        options: {
          size: [{ _id: mediumItem._id.toString(), label: "Small", priceModifier: 0 }],
        },
      };

      const res = await request(app)
        .put("/api/options")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(badUpdate);

      expect(res.statusCode).toBe(409);
    });

    test("should fail if request payload itself has duplicates during update (409)", async () => {
      const badUpdate = {
        options: {
          size: [
            { label: "New Size", priceModifier: 1 },
            { label: "new size ", priceModifier: 2 },
          ],
        },
      };

      const res = await request(app)
        .put("/api/options")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(badUpdate);

      expect(res.statusCode).toBe(409);
    });

    test("should reject update with malformed Mongoose ID", async () => {
      const badIdUpdate = {
        options: {
          size: [{ _id: "not-a-valid-id", label: "Broken", priceModifier: 0 }],
        },
      };

      const res = await request(app)
        .put("/api/options")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(badIdUpdate);

      expect(res.statusCode).toBe(400);
    });
  });

  // --- DELETE OPERATIONS ---
  describe("DELETE Operations", () => {
    test("should delete an entire group and preserve others", async () => {
      const res = await request(app)
        .delete("/api/options/size")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(204);
      const doc = await drinkOptions.findOne();
      expect(doc.options.has("size")).toBe(false);
      expect(doc.options.has("milk")).toBe(true); // Edge case: ensure other data stays
    });

    test("should delete a specific item from a group", async () => {
      const doc = await drinkOptions.findOne();
      const itemId = doc.options.get("size")[0]._id.toString();

      const res = await request(app)
        .delete(`/api/options/size/${itemId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(204);
      const updatedDoc = await drinkOptions.findOne();
      expect(updatedDoc.options.get("size").id(itemId)).toBeNull();
    });

    test("should return 404 for non-existent group deletion", async () => {
      const res = await request(app)
        .delete("/api/options/ghost_group")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});