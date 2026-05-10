import { Router } from "express";
import * as issueController from "../controllers/issue.controller";
import * as commentController from "../controllers/comment.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getIssueById);
router.patch("/:id", requireAuth, issueController.updateIssue);
router.delete("/:id", requireAuth, issueController.deleteIssue);
router.post("/:issueId/comments", requireAuth, commentController.createComment);
router.get("/:issueId/comments", commentController.getCommentsForIssue);

export default router;
