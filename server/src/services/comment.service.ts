import { Prisma } from "../generated/prisma/client";
import { prisma } from "../prisma";

export const createComment = async (
  commentData: Prisma.CommentUncheckedCreateInput
) => {
  const comment = await prisma.comment.create({
    data: commentData,
  });

  return comment;
};

export const getCommentsForIssue = async (issueId: number) => {
  const comments = await prisma.comment.findMany({
    where: { issueId },
    orderBy: { createdAt: "desc" },
  });

  return comments;
};

export const updateComment = async (
  id: number,
  commentData: Prisma.CommentUncheckedUpdateInput
) => {
  const updatedComment = await prisma.comment.update({
    where: { id },
    data: commentData,
  });

  return updatedComment;
};

export const deleteComment = async (id: number) => {
  await prisma.comment.delete({
    where: { id },
  });
};
