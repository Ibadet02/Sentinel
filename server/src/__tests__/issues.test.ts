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
    const createResponse = await request(app)
      .post("/issues")
      .send({ title: "New title", status: "OPEN" });
    const response = await request(app).get("/issues");

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("status");
  });
});

describe("GET /issues/:id", () => {
  it("should return an issue with a valid id", async () => {
    const createResponse = await request(app)
      .post("/issues")
      .send({ title: "Find me" });
    const id = createResponse.body.id;

    const response = await request(app).get(`/issues/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
  });

  it("should return 404 if the id is invalid", async () => {
    const response = await request(app).get("/issues/99999");

    expect(response.status).toBe(404);
  });
});

describe("PATCH /issues/:id", () => {
  it("should update the record with the given id", async () => {
    const createResponse = await request(app)
      .post("/issues")
      .send({ title: "Issue to be updated" });
    const id = createResponse.body.id;

    const response = await request(app)
      .patch(`/issues/${id}`)
      .send({ title: "Title updated", status: "CLOSED" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Title updated");
    expect(response.body.status).toBe("CLOSED");
  });

  it("should return 404 for non-existent id", async () => {
    const response = await request(app)
      .patch("/issues/99999")
      .send({ title: "Non-existent record" });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /issues/:id", () => {
  it("should delete the record with the given id", async () => {
    const createResponse = await request(app)
      .post("/issues")
      .send({ title: "Issue to be deleted" });
    const id = createResponse.body.id;

    const response = await request(app).delete(`/issues/${id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should return 404 for non-existent id", async () => {
    const response = await request(app).delete("/issues/99999");

    expect(response.status).toBe(404);
  });
});
