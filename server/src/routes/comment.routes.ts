import { Router } from "express";
import * as commentController from "../controllers/comment.controller";

const router = Router();

router.patch("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

export default router;
