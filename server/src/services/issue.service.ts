import { Prisma } from "../generated/prisma/client";
import { prisma } from "../prisma";

export const createIssue = async (issueData: Prisma.IssueCreateInput) => {
  const issue = await prisma.issue.create({
    data: issueData,
  });

  return issue;
};

export const getAllIssues = async () => {
  const allIssues = await prisma.issue.findMany();

  return allIssues;
};

export const getIssueById = async (id: number) => {
  const issue = await prisma.issue.findUnique({
    where: { id },
  });

  return issue;
};
