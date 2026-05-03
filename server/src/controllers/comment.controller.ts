import { Request, Response } from "express";
import * as commentService from "../services/comment.service";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/comment.validator";

export const createComment = async (req: Request, res: Response) => {
  const issueId = Number(req.params.issueId);
  const { content } = createCommentSchema.parse(req.body);
  const createdComment = await commentService.createComment({
    content,
    issueId,
  });

  res.status(201).json(createdComment);
};

export const getCommentsForIssue = async (req: Request, res: Response) => {
  const issueId = Number(req.params.issueId);
  const comments = await commentService.getCommentsForIssue(issueId);

  res.json(comments);
};

export const updateComment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const commentData = updateCommentSchema.parse(req.body);
  const updatedComment = await commentService.updateComment(id, commentData);

  res.json(updatedComment);
};

export const deleteComment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await commentService.deleteComment(id);

  res.status(204).send();
};
