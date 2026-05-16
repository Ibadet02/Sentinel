import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { createAuthenticatedAgent } from "./helpers/auth";

describe("GET /health", () => {
  it("should return status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("POST /issues", () => {
  it("should create an issue with valid data", async () => {
    const { agent, user } = await createAuthenticatedAgent();
    const response = await agent.post("/issues").send({ title: "Test title" });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test title");
    expect(response.body.status).toBe("OPEN");
    expect(response.body.userId).toBe(user.id);
    expect(response.body.id).toBeDefined();
  });

  it("should reject when not authenticated", async () => {
    const response = await request(app)
      .post("/issues")
      .send({ title: "Should fail" });

    expect(response.status).toBe(401);
  });

  it("should reject empty title", async () => {
    const { agent } = await createAuthenticatedAgent();
    const response = await agent.post("/issues").send({ title: "" });

    expect(response.status).toBe(400);
  });

  it("should reject missing title", async () => {
    const { agent } = await createAuthenticatedAgent();
    const response = await agent.post("/issues").send({});

    expect(response.status).toBe(400);
  });
});

describe("GET /issues", () => {
  it("should return an array of issues", async () => {
    const { agent } = await createAuthenticatedAgent();
    await agent.post("/issues").send({ title: "New title", status: "OPEN" });
    const response = await request(app).get("/issues");

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("status");
  });
});

describe("GET /issues/:id", () => {
  it("should return an issue with a valid id", async () => {
    const { agent } = await createAuthenticatedAgent();
    const createResponse = await agent
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
  it("should reject when not authenticated", async () => {
    const response = await request(app)
      .patch("/issues/1")
      .send({ title: "Nope" });

    expect(response.status).toBe(401);
  });

  it("should update the issue with the given id", async () => {
    const { agent, user } = await createAuthenticatedAgent();
    const createResponse = await agent
      .post("/issues")
      .send({ title: "Issue to be updated" });
    const id = createResponse.body.id;

    const response = await agent
      .patch(`/issues/${id}`)
      .send({ title: "Title updated", status: "CLOSED" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Title updated");
    expect(response.body.status).toBe("CLOSED");
    expect(response.body.userId).toBe(user.id);
  });

  it("should return 404 for non-existent id", async () => {
    const { agent } = await createAuthenticatedAgent();
    const response = await agent
      .patch("/issues/99999")
      .send({ title: "Non-existent record" });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /issues/:id", () => {
  it("should reject when not authenticated", async () => {
    const response = await request(app).delete("/issues/1");

    expect(response.status).toBe(401);
  });

  it("should delete the issue with the given id", async () => {
    const { agent } = await createAuthenticatedAgent();
    const createResponse = await agent
      .post("/issues")
      .send({ title: "Issue to be deleted" });
    const id = createResponse.body.id;

    const response = await agent.delete(`/issues/${id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should return 404 for non-existent id", async () => {
    const { agent } = await createAuthenticatedAgent();
    const response = await agent.delete("/issues/99999");

    expect(response.status).toBe(404);
  });
});

describe("Issue ownership", () => {
  it("should return 403 when non-owner tries to update", async () => {
    const { agent: ownerAgent } = await createAuthenticatedAgent();
    const { agent: strangerAgent } = await createAuthenticatedAgent();

    const created = await ownerAgent
      .post("/issues")
      .send({ title: "Owner's issue" });
    const id = created.body.id;

    const response = await strangerAgent
      .patch(`/issues/${id}`)
      .send({ title: "Issue hijcaked" });

    expect(response.status).toBe(403);

    const stillThere = await request(app).get(`/issues/${id}`);

    expect(stillThere.body.title).toBe("Owner's issue");
  });

  it("should return 403 when non-owner tries to delete", async () => {
    const { agent: ownerAgent } = await createAuthenticatedAgent();
    const { agent: strangerAgent } = await createAuthenticatedAgent();

    const created = await ownerAgent
      .post("/issues")
      .send({ title: "Don't delete me" });
    const id = created.body.id;

    const response = await strangerAgent.delete(`/issues/${id}`);

    expect(response.status).toBe(403);

    const stillThere = await request(app).get(`/issues/${id}`);
    expect(stillThere.status).toBe(200);
    expect(stillThere.body.id).toBe(id);
  });

  it("owner can still update their own issue (sanity check)", async () => {
    const { agent } = await createAuthenticatedAgent();
    const created = await agent.post("/issues").send({ title: "Mine" });
    const id = created.body.id;

    const response = await agent
      .patch(`/issues/${id}`)
      .send({ title: "Updated by owner" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated by owner");
  });
});
