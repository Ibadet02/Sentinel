import { Prisma } from "../generated/prisma/client";
import { prisma } from "../prisma";

export const createIssue = async (issueData: Prisma.IssueCreateInput) => {
  const issue = await prisma.issue.create({
    data: issueData,
  });

  return issue;
};

export const getAllIssues = async () => {
  const allIssues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
  });

  return allIssues;
};

export const getIssueById = async (id: number) => {
  const issue = await prisma.issue.findUnique({
    where: { id },
  });

  return issue;
};

export const updateIssue = async (
  id: number,
  issueData: Prisma.IssueUpdateInput
) => {
  const updatedIssue = await prisma.issue.update({
    where: { id },
    data: issueData,
  });

  return updatedIssue;
};

export const deleteIssue = async (id: number) => {
  await prisma.issue.delete({
    where: { id },
  });
};
