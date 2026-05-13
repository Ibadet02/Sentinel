import { Prisma } from "../generated/prisma/client";
import { prisma } from "../prisma";

export const createIssue = async (
  issueData: {
    title: string;
    description?: string;
  },
  userId: number
) => {
  const issue = await prisma.issue.create({
    data: { ...issueData, userId },
  });

  return issue;
};

export const getAllIssues = async () => {
  const allIssues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true } } },
  });

  return allIssues;
};

export const getIssueById = async (id: number) => {
  const issue = await prisma.issue.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
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
    include: { author: { select: { id: true, name: true } } },
  });

  return updatedIssue;
};

export const deleteIssue = async (id: number) => {
  await prisma.issue.delete({
    where: { id },
  });
};
