import { Request, Response } from "express";
import * as issueService from "../services/issue.service";
import {
  createIssueSchema,
  updateIssueSchema,
} from "../validators/issue.validator";

export const createIssue = async (req: Request, res: Response) => {
  const issueData = createIssueSchema.parse(req.body);
  const userId = req.user!.id;
  const createdIssue = await issueService.createIssue(issueData, userId);

  res.status(201).json(createdIssue);
};

export const getAllIssues = async (req: Request, res: Response) => {
  const allIssues = await issueService.getAllIssues();

  res.json(allIssues);
};

export const getIssueById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const issue = await issueService.getIssueById(id);

  if (!issue) {
    res.status(404).json({ error: "Issue not found" });
    return;
  }

  res.json(issue);
};

export const updateIssue = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user!.id;
  const existing = await issueService.getIssueById(id);
  const issueData = updateIssueSchema.parse(req.body);

  if (!existing) {
    res.status(404).json({ error: "Issue not found" });
    return;
  }

  if (existing.userId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const updatedIssue = await issueService.updateIssue(id, issueData);

  res.json(updatedIssue);
};

export const deleteIssue = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user!.id;
  const existing = await issueService.getIssueById(id);

  if (!existing) {
    res.status(404).json({ error: "Issue not found" });
    return;
  }

  if (existing.userId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  await issueService.deleteIssue(id);

  res.status(204).send();
};
