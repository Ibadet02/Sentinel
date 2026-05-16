import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { createAuthenticatedAgent } from "./helpers/auth";

describe("POST /auth/signup", () => {
  it("creates user, sets HttpOnly cookie, and never returns passwordHash", async () => {
    const response = await request(app).post("/auth/signup").send({
      email: "new@test.com",
      password: "password123",
      name: "New User",
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("new@test.com");
    expect(response.body.user.name).toBe("New User");
    expect(response.body.user.id).toBeDefined();
    expect(response.body.user.passwordHash).toBeUndefined();

    const setCookie = response.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(setCookie[0]).toMatch(/token=/);
    expect(setCookie[0]).toMatch(/HttpOnly/i);
    expect(setCookie[0]).toMatch(/SameSite=Lax/i);
  });

  it("rejects invalid email format with 400", async () => {
    const response = await request(app).post("/auth/signup").send({
      email: "not-an-email",
      password: "password123",
      name: "X",
    });

    expect(response.status).toBe(400);
  });

  it("rejects password shorter than 8 chars with 400", async () => {
    const response = await request(app).post("/auth/signup").send({
      email: "short@test.com",
      password: "short",
      name: "X",
    });

    expect(response.status).toBe(400);
  });

  it("rejects empty name with 400", async () => {
    const response = await request(app).post("/auth/signup").send({
      email: "noname@test.com",
      password: "password123",
      name: "",
    });

    expect(response.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  it("logs in with correct credentials and sets cookie", async () => {
    await request(app).post("/auth/signup").send({
      email: "login@test.com",
      password: "password123",
      name: "Logger",
    });

    const response = await request(app).post("/auth/login").send({
      email: "login@test.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("login@test.com");
    expect(response.body.user.passwordHash).toBeUndefined();
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("returns 401 for wrong password", async () => {
    await request(app).post("/auth/signup").send({
      email: "pwtest@test.com",
      password: "password123",
      name: "PWTest",
    });

    const response = await request(app).post("/auth/login").send({
      email: "pwtest@test.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
  });

  it("returns 401 for unknown email (same as wrong password — enumeration prevention)", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "ghost@test.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
  });
});

describe("GET /auth/me", () => {
  it("returns the authenticated user", async () => {
    const { agent, user } = await createAuthenticatedAgent();

    const response = await agent.get("/auth/me");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(user.id);
    expect(response.body.email).toBe(user.email);
    expect(response.body.passwordHash).toBeUndefined();
  });

  it("returns 401 without cookie", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
  });
});

describe("POST /auth/logout", () => {
  it("clears the cookie — subsequent /me returns 401", async () => {
    const { agent } = await createAuthenticatedAgent();

    // Verify we're authenticated first
    const meBefore = await agent.get("/auth/me");
    expect(meBefore.status).toBe(200);

    // Logout
    const logoutResponse = await agent.post("/auth/logout");
    expect(logoutResponse.status).toBe(204);

    // Now /me should fail
    const meAfter = await agent.get("/auth/me");
    expect(meAfter.status).toBe(401);
  });

  it("returns 401 when not authenticated", async () => {
    const response = await request(app).post("/auth/logout");

    expect(response.status).toBe(401);
  });
});
