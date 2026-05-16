import { beforeEach } from "vitest";
import { prisma } from "../prisma";

beforeEach(async () => {
  await prisma.comment.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.user.deleteMany();
});
