import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/", postController.getAllPost);
router.get("/stats", auth(Role.ADMIN), postController.getPostStats);
router.get("/my-posts", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.getMyPosts);
router.get("/:postId", auth(Role.ADMIN, Role.USER), postController.getPostById);
router.post("/", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.createPost);
router.patch("/:postId", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.updatePost);
router.delete("/:postId", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.deletePost);

export const postRoutes = router;
