import { Router } from "express";
import * as issueController from "../controllers/issue.controller";

const router = Router();

router.post("/", issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getIssueById);
router.patch("/:id", issueController.updateIssue);
router.delete("/:id", issueController.deleteIssue);

export default router;
