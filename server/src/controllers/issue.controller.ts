import { Request, Response } from "express";
import * as issueService from "../services/issue.service";

export const createIssue = async (req: Request, res: Response) => {
  const issueData = req.body;

  try {
    const createdIssue = await issueService.createIssue(issueData);

    res.status(201).json(createdIssue);
  } catch (err) {
    res.status(500).json({ error: "Error while creating the issue" });
  }
};

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const allIssues = await issueService.getAllIssues();

    res.json(allIssues);
  } catch (err) {
    res.status(500).json({ error: "Error while getting all issues" });
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const issue = await issueService.getIssueById(id);

    if (!issue) {
      res.status(404).json({ error: "Issue not found" });
      return;
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: "Error while getting the issue" });
  }
};

export const updateIssue = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const issueData = req.body;
  try {
    const updatedIssue = await issueService.updateIssue(id, issueData);

    res.json(updatedIssue);
  } catch (err) {
    res.status(500).json({ error: "Error while updating the issue" });
  }
};

export const deleteIssue = async(req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await issueService.deleteIssue(id);

    res.status(204).send();
  } catch(err) {
    res.status(500).json({error: "Error while deleting the issue"})
  }
}
