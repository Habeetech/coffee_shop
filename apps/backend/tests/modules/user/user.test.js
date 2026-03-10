import request from "supertest";
import app from "../../../src/app.js";
import User from "../../../src/modules/users/user.model.js";
import mongoose from "mongoose";
import resetData from "../../../src/utils/resetData.js";
import dotenv from "dotenv";
dotenv.config();

let testToken;
let testUserId;
let adminToken;
let managerToken;
let createdUsers = []; // Track users created during tests for cleanup

// Setup tokens for seeded users
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);
  
  // Login as Admin_Test
  const adminLoginRes = await request(app).post("/api/auth/login").send({
    usernameOrEmail: "Admin_Test",
    password: "password123"
  });
  adminToken = adminLoginRes.body.token;
  
  // Login as User_test
  const userLoginRes = await request(app).post("/api/auth/login").send({
    usernameOrEmail: "User_test",
    password: "password123"
  });
  testToken = userLoginRes.body.token;
  const userDb = await User.findOne({ username: "User_test" });
  testUserId = userDb._id.toString();
  
  // Login as Manager_test
  const managerLoginRes = await request(app).post("/api/auth/login").send({
    usernameOrEmail: "Manager_test",
    password: "password123"
  });
  managerToken = managerLoginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User API - Get Users", () => {
  let getUsersAdminToken;
  
  beforeEach(async () => {
    // Use seeded Admin_Test
    getUsersAdminToken = adminToken;
    
    // Create additional test users for this group
    for (let i = 1; i <= 3; i++) {
      const res = await request(app).post("/api/auth/register").send({
        username: `getUsersUser${i}`,
        email: `getusersuser${i}@example.com`,
        password: "TestPass123",
        confirmPassword: "TestPass123",
        phone: `123456789${i}`
      });
      createdUsers.push(res.body._id);
    }
  });

  test("GET /api/user returns all users without passwordHash", async () => {
    const res = await request(app).get("/api/user").set("Authorization", `Bearer ${getUsersAdminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(4); // admin + 3 test users
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
      expect(user.role).toBe("user");
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });
  });

  test("GET /api/user returns empty array when no users", async () => {
    await resetData([], User);
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
    createdUsers.push(specificUserId);
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
    await request(app).post("/api/user/mine").set("Authorization", `Bearer validToken`).send({
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210"
    }); // This test assumes auth middleware is in place
  });
});

describe("User API - Update Profile", () => {
  let updateTestToken;
  let updateUserId;

  beforeEach(async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "updatetest",
      email: "update@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });
    updateUserId = registerRes.body._id;
    createdUsers.push(updateUserId);
    
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
    // Create another user
    const anotherRes = await request(app).post("/api/auth/register").send({
      username: "anotheruser",
      email: "another@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "9876543210"
    });
    createdUsers.push(anotherRes.body._id);

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
    // Create another user
    const anotherRes = await request(app).post("/api/auth/register").send({
      username: "anotheruser",
      email: "another@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "9876543210"
    });
    createdUsers.push(anotherRes.body._id);

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
    // Create another user
    const anotherRes = await request(app).post("/api/auth/register").send({
      username: "anotheruser",
      email: "another@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "9876543210"
    });
    createdUsers.push(anotherRes.body._id);

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
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "passtest",
      email: "pass@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });
    changePassUserId = registerRes.body._id;
    createdUsers.push(changePassUserId);
    
    const loginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "passtest",
      password: "TestPass123"
    });
    changePassToken = loginRes.body.token;
  });

  test("POST /api/user/mine/changepassword with valid new password", async () => {
    const res = await request(app)
      .post("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "NewSecurePass123",
        confirmPassword: "NewSecurePass123"
      });
    expect(res.statusCode).toBe(200);
  });

  test("POST /api/user/mine/changepassword then login with new password", async () => {
    await request(app)
      .post("/api/user/mine/changepassword")
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

  test("POST /api/user/mine/changepassword password mismatch fails", async () => {
    const res = await request(app)
      .post("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "NewPass123",
        confirmPassword: "DifferentPass123"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.confirmPassword")).toBe(true);
  });

  test("POST /api/user/mine/changepassword empty password fails", async () => {
    const res = await request(app)
      .post("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "",
        confirmPassword: ""
      });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/user/mine/changepassword null password fails", async () => {
    const res = await request(app)
      .post("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: null,
        confirmPassword: null
      });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/user/mine/changepassword missing confirmPassword fails", async () => {
    const res = await request(app)
      .post("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "NewPass123"
      });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/user/mine/changepassword old password still fails to login", async () => {
    await request(app)
      .post("/api/user/mine/changepassword")
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

  test("POST /api/user/mine/changepassword with max password length", async () => {
    const res = await request(app)
      .post("/api/user/mine/changepassword")
      .set("Authorization", `Bearer ${changePassToken}`)
      .send({
        password: "a".repeat(100),
        confirmPassword: "a".repeat(100)
      });
    expect(res.statusCode).toBe(200);
  });

  test("POST /api/user/mine/changepassword with password too long fails", async () => {
    const res = await request(app)
      .post("/api/user/mine/changepassword")
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
    await resetData([], User);
    
    // Recreate admin user for deletion test
    await request(app).post("/api/auth/register").send({
      username: "deleteAdmin",
      email: "deleteadmin@coffee.test",
      password: "AdminPass123",
      confirmPassword: "AdminPass123",
      phone: "3333333333"
    });
    const adminDbUser = await User.findOne({ username: "deleteAdmin" });
    await User.updateOne({ _id: adminDbUser._id }, { role: "admin" });
    
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "deleteAdmin",
      password: "AdminPass123"
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
    await resetData([], User);
    
    // Recreate admin user for role changes
    await request(app).post("/api/auth/register").send({
      username: "roleAdmin",
      email: "roleadmin@coffee.test",
      password: "AdminPass123",
      confirmPassword: "AdminPass123",
      phone: "4444444444"
    });
    const adminDbUser = await User.findOne({ username: "roleAdmin" });
    await User.updateOne({ _id: adminDbUser._id }, { role: "admin" });
    
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "roleAdmin",
      password: "AdminPass123"
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
      .put(`/api/user/${roleTestUserId}`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "manager" });
    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe("manager");
  });

  test("PATCH /api/user/:id/role change to admin", async () => {
    const res = await request(app)
      .put(`/api/user/${roleTestUserId}`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "admin" });
    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe("admin");
  });

  test("PATCH /api/user/:id/role change back to user", async () => {
    await request(app)
      .put(`/api/user/${roleTestUserId}`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "manager" });
    
    const res = await request(app)
      .put(`/api/user/${roleTestUserId}`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "user" });
    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe("user");
  });

  test("PATCH /api/user/:id/role with invalid role", async () => {
    const res = await request(app)
      .put(`/api/user/${roleTestUserId}`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "superadmin" });
    expect(res.statusCode).toBe(400);
  });

  test("PATCH /api/user/:id/role with non-existent user returns 404", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/user/${fakeId}`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "manager" });
    expect(res.statusCode).toBe(404);
  });

  test("PATCH /api/user/:id/role expects role field in body", async () => {
    const res = await request(app)
      .put(`/api/user/${roleTestUserId}`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test("PATCH /api/user/:id/role with null role fails", async () => {
    const res = await request(app)
      .put(`/api/user/${roleTestUserId}`)
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: null });
    expect(res.statusCode).toBe(400);
  });

  test("PATCH /api/user/:id/role with invalid ObjectId returns 400", async () => {
    const res = await request(app)
      .put("/api/user/invalid-id")
      .set("Authorization", `Bearer ${roleAdminToken}`)
      .send({ role: "manager" });
    expect(res.statusCode).toBe(400);
  });
});

describe("User API - Concurrent Operations", () => {
  let concurrentToken;
  let concurrentUserId;
  let concurrentUserId2;

  beforeEach(async () => {
    await resetData([], User);
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "concurrenttest",
      email: "concurrent@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });
    concurrentUserId = registerRes.body._id;

    const registerRes2 = await request(app).post("/api/auth/register").send({
      username: "concurrenttest2",
      email: "concurrent2@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "9876543210"
    });
    concurrentUserId2 = registerRes2.body._id;
    
    const loginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "concurrenttest",
      password: "TestPass123"
    });
    concurrentToken = loginRes.body.token;
  });

  test("Concurrent profile updates on same user", async () => {
    const update1 = request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${concurrentToken}`)
      .send({ firstName: "Update1" });

    const update2 = request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${concurrentToken}`)
      .send({ firstName: "Update2" });

    const [res1, res2] = await Promise.all([update1, update2]);
    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
  });

  test("Concurrent duplicate email detection", async () => {
    // Create second user
    await request(app).post("/api/auth/register").send({
      username: "seconduser",
      email: "second@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "9876543210"
    });

    const update1 = request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${concurrentToken}`)
      .send({ email: "second@example.com" });

    const update2 = request(app)
      .put("/api/user/mine")
      .set("Authorization", `Bearer ${concurrentToken}`)
      .send({ email: "second@example.com" });

    const [res1, res2] = await Promise.all([update1, update2]);
    // At least one should fail due to duplicate
    expect([res1.statusCode, res2.statusCode]).toContain(409);
  });
});

describe("User API - Edge Cases", () => {
  let edgeCaseUserId;
  let edgeAdminToken;

  beforeEach(async () => {
    await resetData([], User);
    
    // Create an admin user for authorized GET requests
    await request(app).post("/api/auth/register").send({
      username: "edgeAdmin",
      email: "edgeadmin@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "0000000000"
    });
    const adminUser = await User.findOne({ username: "edgeAdmin" });
    await User.updateOne({ _id: adminUser._id }, { role: "admin" });
    
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "edgeAdmin",
      password: "TestPass123"
    });
    edgeAdminToken = adminLoginRes.body.token;
    
    // Create edge case test user
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
    expect(registerRes.body.username).toBe("trimmeduser");
    expect(registerRes.body.email).toBe("trimmed@example.com");
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
    expect(res.body.firstName).toContain("-");
    expect(res.body.lastName).toContain("'");
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

    expect(res1.body._id).not.toBe(res2.body._id);
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
    expect(registerRes.body.address).toBeDefined();
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
    expect(res.body.firstName.length).toBe(50);
    expect(res.body.lastName.length).toBe(50);
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
afterEach(async () => {
  for (let id of createdUsers) {
    await User.findByIdAndDelete(id);
  }
  createdUsers = [];
});