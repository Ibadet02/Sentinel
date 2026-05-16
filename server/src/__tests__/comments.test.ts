import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { createAuthenticatedAgent } from "./helpers/auth";

describe("POST /issues/:issueId/comments", () => {
  it("creates a comment when authenticated", async () => {
    const { agent, user } = await createAuthenticatedAgent();
    const issue = await agent.post("/issues").send({ title: "Parent" });

    const response = await agent
      .post(`/issues/${issue.body.id}/comments`)
      .send({ content: "First comment" });

    expect(response.status).toBe(201);
    expect(response.body.content).toBe("First comment");
    expect(response.body.userId).toBe(user.id);
    expect(response.body.issueId).toBe(issue.body.id);
  });

  it("rejects when not authenticated", async () => {
    const { agent } = await createAuthenticatedAgent();
    const issue = await agent.post("/issues").send({ title: "Parent" });

    const response = await request(app)
      .post(`/issues/${issue.body.id}/comments`)
      .send({ content: "Should fail" });

    expect(response.status).toBe(401);
  });

  it("rejects empty content with 400", async () => {
    const { agent } = await createAuthenticatedAgent();
    const issue = await agent.post("/issues").send({ title: "Parent" });

    const response = await agent
      .post(`/issues/${issue.body.id}/comments`)
      .send({ content: "" });

    expect(response.status).toBe(400);
  });
});

describe("GET /issues/:issueId/comments", () => {
  it("returns comments with author included (public)", async () => {
    const { agent, user } = await createAuthenticatedAgent();
    const issue = await agent.post("/issues").send({ title: "Parent" });
    await agent
      .post(`/issues/${issue.body.id}/comments`)
      .send({ content: "Hello" });

    const response = await request(app).get(
      `/issues/${issue.body.id}/comments`
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].content).toBe("Hello");
    expect(response.body[0].author).toBeDefined();
    expect(response.body[0].author.name).toBe(user.name);
  });
});

describe("PATCH /comments/:id", () => {
  it("updates own comment", async () => {
    const { agent } = await createAuthenticatedAgent();
    const issue = await agent.post("/issues").send({ title: "Parent" });
    const comment = await agent
      .post(`/issues/${issue.body.id}/comments`)
      .send({ content: "Original" });

    const response = await agent
      .patch(`/comments/${comment.body.id}`)
      .send({ content: "Updated" });

    expect(response.status).toBe(200);
    expect(response.body.content).toBe("Updated");
  });

  it("rejects when not authenticated", async () => {
    const response = await request(app)
      .patch("/comments/1")
      .send({ content: "Nope" });

    expect(response.status).toBe(401);
  });

  it("returns 404 for non-existent comment", async () => {
    const { agent } = await createAuthenticatedAgent();

    const response = await agent
      .patch("/comments/99999")
      .send({ content: "Nope" });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /comments/:id", () => {
  it("deletes own comment", async () => {
    const { agent } = await createAuthenticatedAgent();
    const issue = await agent.post("/issues").send({ title: "Parent" });
    const comment = await agent
      .post(`/issues/${issue.body.id}/comments`)
      .send({ content: "To delete" });

    const response = await agent.delete(`/comments/${comment.body.id}`);

    expect(response.status).toBe(204);
  });

  it("rejects when not authenticated", async () => {
    const response = await request(app).delete("/comments/1");
    expect(response.status).toBe(401);
  });

  it("returns 404 for non-existent comment", async () => {
    const { agent } = await createAuthenticatedAgent();
    const response = await agent.delete("/comments/99999");
    expect(response.status).toBe(404);
  });
});

describe("Comment ownership", () => {
  it("returns 403 when non-owner tries to update", async () => {
    const { agent: ownerAgent } = await createAuthenticatedAgent();
    const { agent: strangerAgent } = await createAuthenticatedAgent();

    const issue = await ownerAgent.post("/issues").send({ title: "Parent" });
    const comment = await ownerAgent
      .post(`/issues/${issue.body.id}/comments`)
      .send({ content: "Owner's comment" });

    const response = await strangerAgent
      .patch(`/comments/${comment.body.id}`)
      .send({ content: "Hijacked" });

    expect(response.status).toBe(403);

    const list = await request(app).get(`/issues/${issue.body.id}/comments`);
    expect(list.body[0].content).toBe("Owner's comment");
  });

  it("returns 403 when non-owner tries to delete", async () => {
    const { agent: ownerAgent } = await createAuthenticatedAgent();
    const { agent: strangerAgent } = await createAuthenticatedAgent();

    const issue = await ownerAgent.post("/issues").send({ title: "Parent" });
    const comment = await ownerAgent
      .post(`/issues/${issue.body.id}/comments`)
      .send({ content: "Untouchable" });

    const response = await strangerAgent.delete(`/comments/${comment.body.id}`);

    expect(response.status).toBe(403);

    const list = await request(app).get(`/issues/${issue.body.id}/comments`);
    expect(list.body.length).toBe(1);
  });
});
