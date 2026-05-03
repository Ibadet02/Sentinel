import { Router } from "express";
import * as issueController from "../controllers/issue.controller";
import * as commentController from "../controllers/comment.controller";

const router = Router();

router.post("/", issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getIssueById);
router.patch("/:id", issueController.updateIssue);
router.delete("/:id", issueController.deleteIssue);
router.post("/:issueId/comments", commentController.createComment);
router.get("/:issueId/comments", commentController.getCommentsForIssue);

export default router;
