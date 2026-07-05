import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/author/:authorId", commentController.getCommentByAuthor)
router.get("/:postId", commentController.getCommentByPostId)
router.post("/", auth(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.createComment)
router.patch("/:commentId", auth(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.updateComment)
router.delete("/:commentId", auth(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.deleteComment)
router.put("/:commentId/moderate", auth(Role.ADMIN), commentController.changeCommentStatus)

export const commentRoutes = router