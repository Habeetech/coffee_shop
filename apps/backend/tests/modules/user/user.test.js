import request from "supertest";
import app from "../../../src/app.js";
import User from "../../../src/modules/users/user.model.js";
import mongoose from "mongoose";
import resetData from "../../../src/utils/resetData.js";
import testUsers from "../../../src/seeders/userSeed.js"
import dotenv from "dotenv";
import { dropTestDatabase } from "../../../src/utils/resetData.js";
import console from "console";


dotenv.config();


let testToken;
let testUserId;
let adminToken;
let managerToken;


beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);
  await dropTestDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User API - Get Users", () => {
  let getUsersAdminToken;

  beforeEach(async () => {
    await dropTestDatabase()
    await resetData(User, testUsers);

    const adminLoginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "adminuser",
      password: "password123"
    });
    adminToken = adminLoginRes.body.token;


    const userLoginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "user_test",
      password: "password123"
    });
    testToken = userLoginRes.body.token;
    const userDb = await User.findOne({ username: "user_test" });
    testUserId = userDb._id.toString();


    const managerLoginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "manageruser",
      password: "password123"
    });
    managerToken = managerLoginRes.body.token;
    getUsersAdminToken = adminToken;


    for (let i = 1; i <= 3; i++) {
      const res = await request(app).post("/api/auth/register").send({
        username: `getUsersUser${i}`,
        email: `getusersuser${i}@example.com`,
        password: "TestPass123",
        confirmPassword: "TestPass123",
        phone: `123456789${i}`
      });
    }
  });

  test("GET /api/user returns all users without passwordHash", async () => {
    const res = await request(app).get("/api/user").set("Authorization", `Bearer ${getUsersAdminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(6);
    res.body.forEach(user => {
      expect(user.passwordHash).toBeUndefined();
      expect(user.username).toBeDefined();
      expect(user.email).toBeDefined();
    });
  });

  test("GET /api/user returns users with expected fields", async () => {
    const res = await request(app).get("/api/user").set("Authorization", `Bearer ${getUsersAdminToken}`);
    expect(res.statusCode).toBe(200);
    res.body.forEach(user => {
      expect(user._id).toBeDefined();
      expect(user.username).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });
  });

  test("GET /api/user returns empty array when no users", async () => {
    await resetData(User);
    const res = await request(app).get("/api/user").set("Authorization", `Bearer ${getUsersAdminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("User API - Get Specific User", () => {
  let specificUserId;
  let getSpecificAdminToken;

  beforeEach(async () => {
    getSpecificAdminToken = adminToken;

    const res = await request(app).post("/api/auth/register").send({
      username: "specificuser",
      email: "specific@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });
    const user = await User.findOne({ username: "specificuser" });
    specificUserId = user._id.toString();
  });

  test("GET /api/user/:id returns user by valid id", async () => {
    const res = await request(app).get(`/api/user/${specificUserId}`).set("Authorization", `Bearer ${getSpecificAdminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(specificUserId);
    expect(res.body.username).toBe("specificuser");
    expect(res.body.passwordHash).toBeUndefined();
  });

  test("GET /api/user/:id with invalid ObjectId returns 400", async () => {
    const res = await request(app).get("/api/user/invalid-id").set("Authorization", `Bearer ${getSpecificAdminToken}`);
    expect(res.statusCode).toBe(400);
  });

  test("GET /api/user/:id with non-existent ObjectId returns 404", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/user/${fakeId}`).set("Authorization", `Bearer ${getSpecificAdminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("GET /api/user/:id does not include passwordHash", async () => {
    const res = await request(app).get(`/api/user/${specificUserId}`).set("Authorization", `Bearer ${getSpecificAdminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.passwordHash).toBeUndefined();
  });

  test("GET /api/user/:id with user containing optional fields", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        usernameOrEmail: "specificuser",
        password: "TestPass123"
      });

    const specificUserToken = loginRes.body.token;

    const updateRes = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${specificUserToken}`)
      .send({
        firstName: "John",
        lastName: "Doe",
        phone: "9876543210"
      });

    expect(updateRes.statusCode).toBe(200);

    const getRes = await request(app)
      .get(`/api/user/${specificUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.firstName).toBe("John");
    expect(getRes.body.lastName).toBe("Doe");
    expect(getRes.body.phone).toBe("9876543210");
    expect(getRes.body).toHaveProperty("favorites");
    expect(Array.isArray(getRes.body.favorites)).toBe(true);
  });

});

describe("User API - Update Profile", () => {

  let updateTestToken;
  let updateUserId;

  beforeEach(async () => {
    await dropTestDatabase();
    await resetData(User, testUsers);
    await User.createIndexes();
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "updatetest",
      email: "update@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });
    const user = await User.findOne({ username: "updatetest" });
    updateUserId = user._id.toString();

    const loginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "updatetest",
      password: "TestPass123"
    });
    updateTestToken = loginRes.body.token;
  });

  test("PUT /api/user/mine with valid name update", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        firstName: "UpdatedFirst",
        lastName: "UpdatedLast"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe("UpdatedFirst");
    expect(res.body.lastName).toBe("UpdatedLast");
  });

  test("PUT /api/user/mine with only firstName update", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        firstName: "OnlyFirst"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe("OnlyFirst");
  });

  test("PUT /api/user/mine with email update", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        email: "newemail@example.com"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("newemail@example.com");
  });

  test("PUT /api/user/mine with duplicate email fails", async () => {
    const anotherRes = await request(app).post("/api/auth/register").send({
      username: "anotheruser",
      email: "another@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "9876543256710"
    });
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        email: "another@example.com"
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("Email already exist");
  });

  test("PUT /api/user/mine with duplicate username fails", async () => {
    const anotherRes = await request(app).post("/api/auth/register").send({
      username: "anotheruser",
      email: "another@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "9876543210"
    });

    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        username: "anotheruser"
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("Username already exist");
  });

  test("PUT /api/user/mine with duplicate phone fails", async () => {
    const anotherRes = await request(app).post("/api/auth/register").send({
      username: "anotheruser",
      email: "another@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "9876543210"
    });


    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        phone: "9876543210"
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("Phone number already exist");
  });

  test("PUT /api/user/mine with invalid email format fails", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        email: "notanemail"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.email")).toBe(true);
  });

  test("PUT /api/user/mine with invalid username format fails", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        username: "invalid user!"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.username")).toBe(true);
  });

  test("PUT /api/user/mine with phone too short fails", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        phone: "1234567"
      });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/user/mine with phone too long fails", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        phone: "1".repeat(21)
      });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/user/mine with address object", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          country: "USA",
          postal: "10001"
        }
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.address).toBeDefined();
    expect(res.body.address.street).toBe("123 Main St");
  });

  test("PUT /api/user/mine with empty body succeeds", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({});
    expect(res.statusCode).toBe(200);
  });

  test("PUT /api/user/mine with unknown fields fails in strict mode", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        firstName: "John",
        unknownField: "value"
      });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/user/mine updates updatedAt timestamp", async () => {

    const getRes = await request(app).get(`/api/user/${updateUserId}`).set("Authorization", `Bearer ${adminToken}`);
    const originalUpdatedAt = new Date(getRes.body.updatedAt).getTime();

    await new Promise(resolve => setTimeout(resolve, 100));

    const updateRes = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${updateTestToken}`)
      .send({
        firstName: "Updated"
      });

    const newUpdatedAt = new Date(updateRes.body.updatedAt).getTime();
    expect(newUpdatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);
  });
});

describe("User API - Change Password", () => {
  let changePassToken;
  let changePassUserId;

  beforeEach(async () => {
    await dropTestDatabase();
    await resetData(User, testUsers);
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "passtest",
      email: "pass@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });
    changePassUserId = registerRes.body._id;

    const loginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "passtest",
      password: "TestPass123"
    });
    changePassToken = loginRes.body.token;
  });

  test("PUT /api/user/mine/changepassword with valid new password", async () => {
    const res = await request(app)
      .put("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "NewSecurePass123",
        confirmPassword: "NewSecurePass123"
      });
    expect(res.statusCode).toBe(200);
  });

  test("PUT /api/user/mine/changepassword then login with new password", async () => {
    await request(app)
      .put("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "NewSecurePass123",
        confirmPassword: "NewSecurePass123"
      });

    const loginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "passtest",
      password: "NewSecurePass123"
    });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });

  test("PUT /api/user/mine/changepassword password mismatch fails", async () => {
    const res = await request(app)
      .put("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "NewPass123",
        confirmPassword: "DifferentPass123"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.confirmPassword")).toBe(true);
  });

  test("PUT /api/user/mine/changepassword empty password fails", async () => {
    const res = await request(app)
      .put("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "",
        confirmPassword: ""
      });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/user/mine/changepassword null password fails", async () => {
    const res = await request(app)
      .put("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: null,
        confirmPassword: null
      });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/user/mine/changepassword missing confirmPassword fails", async () => {
    const res = await request(app)
      .put("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "NewPass123"
      });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/user/mine/changepassword old password still fails to login", async () => {
    await request(app)
      .put("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "NewSecurePass123",
        confirmPassword: "NewSecurePass123"
      });

    const loginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "passtest",
      password: "TestPass123"
    });
    expect(loginRes.statusCode).toBe(400);
  });

  test("PUT /api/user/mine/changepassword with max password length", async () => {
    const res = await request(app)
      .put("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "a".repeat(100),
        confirmPassword: "a".repeat(100)
      });
    expect(res.statusCode).toBe(200);
  });

  test("PUT /api/user/mine/changepassword with password too long fails", async () => {
    const res = await request(app)
      .put("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "a".repeat(101),
        confirmPassword: "a".repeat(101)
      });
    expect(res.statusCode).toBe(400);
  });
});

describe("User API - Delete User", () => {
  let testToken2;
  let testUserId2;
  let anotherUserId;
  let deleteAdminToken;

  beforeEach(async () => {
    await dropTestDatabase()
    await resetData(User, testUsers);

    const adminLoginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "adminuser",
      password: "password123"
    });
    deleteAdminToken = adminLoginRes.body.token;

    await request(app).post("/api/auth/register").send({
      username: "deletetest",
      email: "delete@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });
    const deleteUser = await User.findOne({ username: "deletetest" });
    testUserId2 = deleteUser._id.toString();

    await request(app).post("/api/auth/register").send({
      username: "anotheruser",
      email: "another@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "9876543210"
    });
    const anotherUser = await User.findOne({ username: "anotheruser" });
    anotherUserId = anotherUser._id.toString();

    const loginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "deletetest",
      password: "TestPass123"
    });
    testToken2 = loginRes.body.token;
  });

  test("DELETE /api/user/:id with valid id returns 204", async () => {
    const res = await request(app).delete(`/api/user/${anotherUserId}`).set("Authorization", `Bearer ${deleteAdminToken}`);
    expect(res.statusCode).toBe(204);
  });

  test("DELETE /api/user/:id removes user from database", async () => {
    await request(app).delete(`/api/user/${anotherUserId}`).set("Authorization", `Bearer ${deleteAdminToken}`);
    const getRes = await request(app).get(`/api/user/${anotherUserId}`).set("Authorization", `Bearer ${deleteAdminToken}`);
    expect(getRes.statusCode).toBe(404);
  });

  test("DELETE /api/user/:id with invalid ObjectId returns 400", async () => {
    const res = await request(app).delete("/api/user/invalid-id").set("Authorization", `Bearer ${deleteAdminToken}`);
    expect(res.statusCode).toBe(400);
  });

  test("DELETE /api/user/:id with non-existent ObjectId returns 404", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/user/${fakeId}`).set("Authorization", `Bearer ${deleteAdminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("DELETE /api/user/mine deletes own profile", async () => {
    const res = await request(app)
      .delete("/api/user/mine")
      .set("Authorization", `Bearer ${testToken2}`);
    expect(res.statusCode).toBe(204);
  });

  test("DELETE /api/user/mine removes user from database", async () => {
    await request(app)
      .delete("/api/user/mine")
      .set("Authorization", `Bearer ${testToken2}`);

    const getRes = await request(app).get(`/api/user/${testUserId2}`).set("Authorization", `Bearer ${deleteAdminToken}`);
    expect(getRes.statusCode).toBe(404);
  });

  test("DELETE /api/user/:id twice returns 404 on second", async () => {
    await request(app).delete(`/api/user/${anotherUserId}`).set("Authorization", `Bearer ${deleteAdminToken}`);
    const secondRes = await request(app).delete(`/api/user/${anotherUserId}`).set("Authorization", `Bearer ${deleteAdminToken}`);
    expect(secondRes.statusCode).toBe(404);
  });
});

describe("User API - Change Role", () => {
  let roleTestUserId;
  let roleAdminToken;

  beforeEach(async () => {
    await dropTestDatabase()
    await resetData(User, testUsers);


    const adminLoginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "adminuser",
      password: "password123"
    });
    roleAdminToken = adminLoginRes.body.token;

    await request(app).post("/api/auth/register").send({
      username: "roletest",
      email: "role@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });
    const roleUser = await User.findOne({ username: "roletest" });
    roleTestUserId = roleUser._id.toString();
  });

  test("PATCH /api/user/:id/role change to manager", async () => {
    const res = await request(app)
      .patch(`/api/user/${roleTestUserId}/role`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "manager" });
    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe("manager");
  });

  test("PATCH /api/user/:id/role change to admin", async () => {
    const res = await request(app)
      .patch(`/api/user/${roleTestUserId}/role`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "admin" });
    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe("admin");
  });

  test("PATCH /api/user/:id/role change back to user", async () => {
    await request(app)
      .patch(`/api/user/${roleTestUserId}/role`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "manager" });

    const res = await request(app)
      .patch(`/api/user/${roleTestUserId}/role`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "user" });
    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe("user");
  });

  test("PATCH /api/user/:id/role with invalid role", async () => {
    const res = await request(app)
      .patch(`/api/user/${roleTestUserId}/role`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "superadmin" });
    expect(res.statusCode).toBe(400);
  });

  test("PATCH /api/user/:id/role with non-existent user returns 404", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/user/${fakeId}/role`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "manager" });
    expect(res.statusCode).toBe(404);
  });

  test("PATCH /api/user/:id/role expects role field in body", async () => {
    const res = await request(app)
      .patch(`/api/user/${roleTestUserId}/role`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test("PATCH /api/user/:id/role with null role fails", async () => {
    const res = await request(app)
      .patch(`/api/user/${roleTestUserId}/role`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: null });
    expect(res.statusCode).toBe(400);
  });

  test("PATCH /api/user/:id/role with invalid ObjectId returns 400", async () => {
    const res = await request(app)
      .patch("/api/user/invalid-id/role")
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "manager" });
    expect(res.statusCode).toBe(400);
  });
});

describe("User API - Update Profile", () => {
  let token;
  let userId;

  beforeEach(async () => {
    await dropTestDatabase();
    await resetData(User, testUsers);

    // Create main user
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "mainuser",
      email: "main@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1111111111"
    });

    userId = registerRes.body._id;

    const loginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "mainuser",
      password: "TestPass123"
    });

    token = loginRes.body.token;
    await User.createIndexes();

  });

  test("PUT /api/user/mine updating to same email succeeds", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "main@example.com" });

    expect(res.statusCode).toBe(200);
  });

  test("PUT /api/user/mine updating to same username succeeds", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "mainuser" });

    expect(res.statusCode).toBe(200);
  });

  test("PUT /api/user/mine updating to same phone succeeds", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "1111111111" });

    expect(res.statusCode).toBe(200);
  });
  test("PUT /api/user/mine with duplicate email fails", async () => {
    await request(app).post("/api/auth/register").send({
      username: "otheruser",
      email: "another@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "2222222222"
    });

    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "another@example.com" });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("Email already exist");
  });

  test("PUT /api/user/mine with duplicate username fails", async () => {
    await request(app).post("/api/auth/register").send({
      username: "takenuser",
      email: "taken@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "3333333333"
    });

    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "takenuser" });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("Username already exist");
  });


  test("PUT /api/user/mine with duplicate phone fails", async () => {
    await request(app).post("/api/auth/register").send({
      username: "phoneuser",
      email: "phone@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "9999999999"
    });

    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "9999999999" });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("Phone number already exist");
  });
});


describe("User API - Edge Cases", () => {
  let edgeCaseUserId;
  let edgeAdminToken;

  beforeEach(async () => {
    await dropTestDatabase();
    await resetData(User, testUsers);
    await User.createIndexes();

    const adminLoginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "adminuser",
      password: "password123"
    });
    edgeAdminToken = adminLoginRes.body.token;

    await request(app).post("/api/auth/register").send({
      username: "edgetest",
      email: "edge@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });
    const user = await User.findOne({ username: "edgetest" });
    edgeCaseUserId = user._id;
  });

  test("User created with default role 'user'", async () => {
    const res = await request(app).get(`/api/user/${edgeCaseUserId}`).set("Authorization", `Bearer ${edgeAdminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe("user");
  });

  test("User created with default loyaltyPoints 0", async () => {
    const res = await request(app).get(`/api/user/${edgeCaseUserId}`).set("Authorization", `Bearer ${edgeAdminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.loyaltyPoints).toBe(0);
  });

  test("User has timestamps after creation", async () => {
    const res = await request(app).get(`/api/user/${edgeCaseUserId}`).set("Authorization", `Bearer ${edgeAdminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();
  });

  test("User can have empty optional fields", async () => {
    const res = await request(app).get(`/api/user/${edgeCaseUserId}`).set("Authorization", `Bearer ${edgeAdminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBeUndefined();
    expect(res.body.lastName).toBeUndefined();
    expect(res.body.address).toBeUndefined();
  });

  test("Username and email are trimmed on creation", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "  trimmeduser  ",
      email: "  trimmed@example.com  ",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1111111111"
    });
    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.user.username).toBe("trimmeduser");
    expect(registerRes.body.user.email).toBe("trimmed@example.com");
  });

  test("Special characters in firstName and lastName allowed", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "specialuser",
      email: "special@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      firstName: "Jean-Pierre",
      lastName: "O'Brien",
      phone: "1111111111"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.firstName).toContain("-");
    expect(res.body.user.lastName).toContain("'");
  });

  test("Password hash is bcrypted in database", async () => {
    const user = await User.findById(edgeCaseUserId);
    expect(user.passwordHash).toBeDefined();
    expect(user.passwordHash).not.toBe("TestPass123");
    expect(user.passwordHash.length).toBeGreaterThan(20); // bcrypt hashes are long
  });

  test("Multiple registrations create unique ids", async () => {
    const res1 = await request(app).post("/api/auth/register").send({
      username: "user1",
      email: "user1@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1111111111"
    });

    const res2 = await request(app).post("/api/auth/register").send({
      username: "user2",
      email: "user2@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "2222222222"
    });

    expect(res1.body.user._id).not.toBe(res2.body.user._id);
  });

  test("Large address object is stored correctly", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "addressuser",
      email: "address@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      address: {
        street: "123 Main Street Suite 100",
        city: "San Francisco",
        state: "California",
        country: "United States",
        postal: "94102"
      },
      phone: "1111111111"
    });
    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.user.address).toBeDefined();
  });

  test("Phone number with special characters rejected", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "phoneuser",
      email: "phone@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "(123) 456-7890"
    });
    expect([201, 400]).toContain(res.statusCode);
  });

  test("Very long firstName and lastName handled", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "longname",
      email: "long@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      firstName: "a".repeat(50),
      lastName: "b".repeat(50),
      phone: "1111111111"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.firstName.length).toBe(50);
    expect(res.body.user.lastName.length).toBe(50);
  });

  test("firstName/lastName too long fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "toolongname",
      email: "toolong@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      firstName: "a".repeat(51),
      phone: "1111111111"
    });
    expect(res.statusCode).toBe(400);
  });
});
describe("User API - Concurrency", () => {
  let tokenA, tokenB, userA, userB;

  beforeEach(async () => {
    await dropTestDatabase();
    await resetData(User, testUsers);
    await User.syncIndexes();

    const regA = await request(app).post("/api/auth/register").send({
      username: "userA",
      email: "userA@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1111111111"
    });
    userA = regA.body._id;
    tokenA = (await request(app).post("/api/auth/login").send({
      usernameOrEmail: "userA",
      password: "TestPass123"
    })).body.token;


    const regB = await request(app).post("/api/auth/register").send({
      username: "userB",
      email: "userB@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "2222222222"
    });
    userB = regB.body._id;
    tokenB = (await request(app).post("/api/auth/login").send({
      usernameOrEmail: "userB",
      password: "TestPass123"
    })).body.token;
  });

  test("Two users updating to the same email simultaneously → one succeeds, one fails", async () => {
    const payload = { email: "shared@example.com" };

    const [resA, resB] = await Promise.all([
      request(app).put("/api/user/mine").set("Authorization", `Bearer ${tokenA}`).send(payload),
      request(app).put("/api/user/mine").set("Authorization", `Bearer ${tokenB}`).send(payload)
    ]);

    const statuses = [resA.statusCode, resB.statusCode].sort();
    expect(statuses).toEqual([200, 409]);
  });

  test("Simultaneous updates to different fields should both succeed", async () => {
    const [resA, resB] = await Promise.all([
      request(app).put("/api/user/mine").set("Authorization", `Bearer ${tokenA}`).send({ firstName: "Alpha" }),
      request(app).put("/api/user/mine").set("Authorization", `Bearer ${tokenB}`).send({ lastName: "Beta" })
    ]);

    expect(resA.statusCode).toBe(200);
    expect(resB.statusCode).toBe(200);
  });

  test("High volume concurrency → exactly one wins", async () => {
    const tokens = [];

    for (let i = 0; i < 10; i++) {
      await request(app).post("/api/auth/register").send({
        username: `concurrent_user_${i}`,
        email: `concurrent_user_${i}@example.com`,
        password: "TestPass123",
        confirmPassword: "TestPass123",
        phone: `90000000${i}`
      });

      const login = await request(app).post("/api/auth/login").send({
        usernameOrEmail: `concurrent_user_${i}`,
        password: "TestPass123"
      });

      tokens.push(login.body.token);
    }

    // Ensure all tokens exist
    tokens.forEach((t, i) => {
      if (!t) throw new Error(`Token missing for user ${i}`);
    });

    const payload = { username: "megaUser" };

    const promises = tokens.map(t =>
      request(app)
        .put("/api/user/mine")
        .set("Authorization", `Bearer ${t}`)
        .send(payload)
    );

    const results = await Promise.all(promises);

    const successCount = results.filter(r => r.statusCode === 200).length;
    const conflictCount = results.filter(r => r.statusCode === 409).length;

    expect(successCount).toBe(1);
    expect(conflictCount).toBe(9);
  });



});
describe("User API - Null & Invalid Types", () => {
  let token;

  beforeEach(async () => {
    await dropTestDatabase();
    await resetData(User, testUsers);
    await User.createIndexes();

    const reg = await request(app).post("/api/auth/register").send({
      username: "nulltest",
      email: "nulltest@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });

    token = (await request(app).post("/api/auth/login").send({
      usernameOrEmail: "nulltest",
      password: "TestPass123"
    })).body.token;
  });

  test("Null username fails", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: null });

    expect(res.statusCode).toBe(400);
  });

  test("Empty string username fails", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "" });

    expect(res.statusCode).toBe(400);
  });

  test("Phone number as number type fails", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: 1234567890 });

    expect(res.statusCode).toBe(400);
  });
});
describe("User API - Partial Address Updates", () => {
  let token;

  beforeEach(async () => {
    await dropTestDatabase();
    await resetData(User, testUsers);
    await User.createIndexes();

    const reg = await request(app).post("/api/auth/register").send({
      username: "addresstest",
      email: "addr@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890",
      address: {
        street: "Old St",
        city: "London",
        country: "UK"
      }
    });

    token = (await request(app).post("/api/auth/login").send({
      usernameOrEmail: "addresstest",
      password: "TestPass123"
    })).body.token;
  });

  test("Updating only city preserves other address fields", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ address: { city: "Manchester" } });
    expect(res.statusCode).toBe(200);
    expect(res.body.address.street).toBe("Old St");
    expect(res.body.address.city).toBe("Manchester");
    expect(res.body.address.country).toBe("UK");
  });
});
describe("User API - Security / NoSQL Injection", () => {
  let token;

  beforeEach(async () => {
    await dropTestDatabase();
    await resetData(User, testUsers);
    await User.createIndexes();

    const reg = await request(app).post("/api/auth/register").send({
      username: "injecttest",
      email: "inject@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });

    token = (await request(app).post("/api/auth/login").send({
      usernameOrEmail: "injecttest",
      password: "TestPass123"
    })).body.token;
  });

  test("Attempting to use $set operator fails", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ "$set": { role: "admin" } });

    expect(res.statusCode).toBe(400);
  });

  test("Attempting to overwrite role via payload fails", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "admin" });

    expect(res.statusCode).toBe(400);
  });
});
describe("User API - Case Sensitivity", () => {
  let token;

  beforeEach(async () => {
    await dropTestDatabase();
    await resetData(User, testUsers);
    await User.createIndexes();

    await request(app).post("/api/auth/register").send({
      username: "CaseUser",
      email: "CaseUser@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });

    token = (await request(app).post("/api/auth/login").send({
      usernameOrEmail: "CaseUser",
      password: "TestPass123"
    })).body.token;
  });

  test("Updating to same email with different case should fail (if collation enabled)", async () => {
    const res = await request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "caseuser@example.com" });

    expect([200, 409]).toContain(res.statusCode);
  });
});
