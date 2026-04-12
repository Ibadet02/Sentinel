import { beforeEach } from "vitest";
import { prisma } from "../prisma";

beforeEach(async () => {
  await prisma.issue.deleteMany();
});
