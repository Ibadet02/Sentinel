import request from "supertest";
import { app } from "../app";
import { describe, it, expect } from "vitest";

describe("GET /health", () => {
  it("should return status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("POST /issues", () => {
  it("should create an issue with valid data", async () => {
    const response = await request(app)
      .post("/issues")
      .send({ title: "Test title" });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test title");
    expect(response.body.status).toBe("OPEN");
    expect(response.body.id).toBeDefined();
  });

  it("should reject empty title", async () => {
    const response = await request(app).post("/issues").send({ title: "" });

    expect(response.status).toBe(400);
  });

  it("should reject missing title", async () => {
    const response = await request(app).post("/issues").send({});

    expect(response.status).toBe(400);
  });
});

describe("GET /issues", () => {
  it("should return an array of issues", async () => {
    const response = await request(app).get("/issues");

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("status");
  });
});

describe("GET /issues/:id", ()=> {
    it("should an issue with a valid id", async ()=> {
        const response = await request(app).get("/issues/:id");
        
    })
})