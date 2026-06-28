import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/", postController.getAllPost);
router.get("/:postId", auth(Role.ADMIN, Role.USER), postController.getPostById);
router.get("/stats", auth(Role.ADMIN, Role.USER), postController.getPostStats);
router.get("/my-posts", auth(Role.ADMIN, Role.USER), postController.getMyPosts);
router.post("/", auth(Role.ADMIN, Role.USER), postController.createPost);
router.put("/:postId", auth(Role.ADMIN, Role.USER), postController.updatePost);
router.delete("/:postId", auth(Role.ADMIN, Role.USER), postController.deletePost);

export const postRoutes = router;
