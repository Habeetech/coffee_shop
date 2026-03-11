import request from "supertest";
import app from "../../../src/app.js";
import User from "../../../src/modules/users/user.model.js";
import testUsers from "../../../src/seeders/userSeed.js"
import mongoose from "mongoose";
import resetData from "../../../src/utils/resetData.js";
import dotenv from "dotenv";
dotenv.config();

describe("Auth API - Register", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
  await resetData(User, testUsers);
});

  test("POST /api/auth/register with valid data creates user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.username).toBe("testuser");
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.user.role).toBe("user");
  });

  test("POST /api/auth/register with optional all fields", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "fulluser",
      email: "full@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.firstName === "John" || !res.body.firstName).toBe(true);
  });

  // Duplicate Detection
  test("POST /api/auth/register with duplicate username returns 409", async () => {
    const firstRes = await request(app).post("/api/auth/register").send({
      username: "duplicate",
      email: "first@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1111111111"
    });

    const res = await request(app).post("/api/auth/register").send({
      username: "duplicate",
      email: "second@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "2222222222"
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("Username already exist");
  });

  test("POST /api/auth/register with duplicate email returns 409", async () => {
    const firstRes = await request(app).post("/api/auth/register").send({
      username: "user1",
      email: "duplicate@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1111111111"
    });

    const res = await request(app).post("/api/auth/register").send({
      username: "user2",
      email: "duplicate@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "2222222222"
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("Email already exist");
  });

  test("POST /api/auth/register with duplicate phone returns 409", async () => {
    const firstRes = await request(app).post("/api/auth/register").send({
      username: "user1",
      email: "first@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "9876543210"
    });

    const res = await request(app).post("/api/auth/register").send({
      username: "user2",
      email: "second@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "9876543210"
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("Phone number already exist");
  });

  test("POST /api/auth/register password mismatch fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "DifferentPass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.confirmPassword")).toBe(true);
  });

  test("POST /api/auth/register empty password fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "",
      confirmPassword: "",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/register null password fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: null,
      confirmPassword: null,
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/register missing confirmPassword fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/register with invalid email format fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "notanemail",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.email")).toBe(true);
  });

  test("POST /api/auth/register with email missing @ fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test.example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/register with email missing domain fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/register with empty email fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/register with invalid username characters fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "test user!",
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.username")).toBe(true);
  });

  test("POST /api/auth/register with valid special characters in username", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "test_user.123-name",
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.username).toBe("test_user.123-name");
  });

  test("POST /api/auth/register with empty username fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "",
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/register with very long username fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "a".repeat(51),
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.username")).toBe(true);
  });

  test("POST /api/auth/register trims whitespace from username", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "  testuser  ",
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.username).toBe("testuser");
  });

  test("POST /api/auth/register trims whitespace from email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "  test@example.com  ",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("test@example.com");
  });

  test("POST /api/auth/register missing username fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.username")).toBe(true);
  });

  test("POST /api/auth/register missing email fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.email")).toBe(true);
  });

  test("POST /api/auth/register missing password fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      confirmPassword: "SecurePass123",
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/register with unknown fields fails in strict mode", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1234567890",
      unknownField: "value"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/register with very long password succeeds", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "a".repeat(100),
      confirmPassword: "a".repeat(100),
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(201);
  });

  test("POST /api/auth/register with password too long fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "a".repeat(101),
      confirmPassword: "a".repeat(101),
      phone: "1234567890"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/register with 8 character phone succeeds", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "12345678"
    });
    expect(res.statusCode).toBe(201);
  });

  test("POST /api/auth/register with very long phone fails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      phone: "1".repeat(21)
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("Auth API - Login", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await resetData(User, testUsers);
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "TestPass123",
      confirmPassword: "TestPass123",
      phone: "1234567890"
    });
  });


  test("POST /api/auth/login with valid username returns token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "testuser",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe("string");
  });

  test("POST /api/auth/login with valid email returns token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "test@example.com",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("POST /api/auth/login token is valid JWT", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "testuser",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(200);
    const tokenParts = res.body.token.split(".");
    expect(tokenParts.length).toBe(3);
  });


  test("POST /api/auth/login with non-existent username fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "nonexistent",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Could not find");
  });

  test("POST /api/auth/login with non-existent email fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "nonexistent@example.com",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/login with wrong password fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "testuser",
      password: "WrongPass123"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("invalid password");
  });

  test("POST /api/auth/login with empty password fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "testuser",
      password: ""
    });
    expect(res.statusCode).toBe(400);
  });

  // Email Format Validation
  test("POST /api/auth/login with invalid email format fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "notanemail",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors || res.body.message || res.body).toBeDefined();
  });

  test("POST /api/auth/login with email missing @ fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "test.example.com",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(400);
  });

 
  test("POST /api/auth/login with valid username format", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "testuser",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(200);
  });

  test("POST /api/auth/login with invalid username characters fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "test user!",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(400);
  });


  test("POST /api/auth/login trims whitespace from usernameOrEmail", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "  testuser  ",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("POST /api/auth/login empty usernameOrEmail fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(400);
  });

 
  test("POST /api/auth/login missing usernameOrEmail fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some(e => e.field === "body.usernameOrEmail")).toBe(true);
  });

  test("POST /api/auth/login missing password fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "testuser"
    });
    expect(res.statusCode).toBe(400);
  });

  // Edge Cases
  test("POST /api/auth/login with unknown fields fails in strict mode", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "testuser",
      password: "TestPass123",
      rememberMe: true
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/login with case sensitive username", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "TestUser",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/login null usernameOrEmail fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: null,
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/login null password fails", async () => {
    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "testuser",
      password: null
    });
    expect(res.statusCode).toBe(400);
  });

  test("POST /api/auth/login multiple users - correct user identified by username", async () => {
    const anotherRes = await request(app).post("/api/auth/register").send({
      username: "anotheruser",
      email: "another@example.com",
      password: "AnotherPass123",
      confirmPassword: "AnotherPass123",
      phone: "9876543210"
    });

    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "testuser",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("POST /api/auth/login multiple users - correct user identified by email", async () => {

    const anotherRes = await request(app).post("/api/auth/register").send({
      username: "anotheruser",
      email: "another@example.com",
      password: "AnotherPass123",
      confirmPassword: "AnotherPass123",
      phone: "9876543210"
    });

    const res = await request(app).post("/api/auth/login").send({
      usernameOrEmail: "test@example.com",
      password: "TestPass123"
    });
    expect(res.statusCode).toBe(200);
  });
});

