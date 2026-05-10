import { Router } from "express";
import * as commentController from "../controllers/comment.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.patch("/:id", requireAuth, commentController.updateComment);
router.delete("/:id", requireAuth, commentController.deleteComment);

export default router;
