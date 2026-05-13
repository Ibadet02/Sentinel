import { Request, Response } from "express";
import * as commentService from "../services/comment.service";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/comment.validator";

export const createComment = async (req: Request, res: Response) => {
  const issueId = Number(req.params.issueId);
  const { content } = createCommentSchema.parse(req.body);
  const userId = req.user!.id;
  const createdComment = await commentService.createComment(
    {
      content,
      issueId,
    },
    userId
  );

  res.status(201).json(createdComment);
};

export const getCommentsForIssue = async (req: Request, res: Response) => {
  const issueId = Number(req.params.issueId);
  const comments = await commentService.getCommentsForIssue(issueId);

  res.json(comments);
};

export const updateComment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user!.id;
  const commentData = updateCommentSchema.parse(req.body);
  const existing = await commentService.getCommentById(id);

  if (!existing) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }

  if (existing.userId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const updatedComment = await commentService.updateComment(id, commentData);

  res.json(updatedComment);
};

export const deleteComment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user!.id;
  const existing = await commentService.getCommentById(id);

  if (!existing) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }

  if (existing.userId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  await commentService.deleteComment(id);

  res.status(204).send();
};
