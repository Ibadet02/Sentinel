import { Prisma } from "../generated/prisma/client";
import { prisma } from "../prisma";

export const createComment = async (
  commentData: { content: string; issueId: number },
  userId: number
) => {
  const comment = await prisma.comment.create({
    data: { ...commentData, userId },
  });

  return comment;
};

export const getCommentsForIssue = async (issueId: number) => {
  const comments = await prisma.comment.findMany({
    where: { issueId },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true } } },
  });

  return comments;
};

export const getCommentById = async (id: number) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });

  return comment;
};

export const updateComment = async (
  id: number,
  commentData: Prisma.CommentUncheckedUpdateInput
) => {
  const updatedComment = await prisma.comment.update({
    where: { id },
    data: commentData,
    include: { author: { select: { id: true, name: true } } },
  });

  return updatedComment;
};

export const deleteComment = async (id: number) => {
  await prisma.comment.delete({
    where: { id },
  });
};
