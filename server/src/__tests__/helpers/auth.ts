import { randomUUID } from "crypto";
import request from "supertest";
import { app } from "../../app";

interface CreateUserOptions {
  email?: string;
  name?: string;
  password?: string;
}

export const createAuthenticatedAgent = async (
  options: CreateUserOptions = {}
) => {
  const email = options.email ?? `test-${randomUUID()}@test.com`;
  const name = options.name ?? "Test User";
  const password = options.password ?? "password123";

  const agent = request.agent(app);

  const response = await agent
    .post("/auth/signup")
    .send({ email, password, name });

  if (response.status !== 201) {
    throw new Error(
      `Test signup failed: ${response.status} ${JSON.stringify(response.body)}`
    );
  }

  return {
    agent,
    user: response.body.user as { id: number; email: string; name: string },
  };
};
