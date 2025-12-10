import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { csrfProtection } from "../middleware/csrf.middleware.js";

const router = Router();

router.get("/", postController.getAllPosts);
router.get("/my-posts", authMiddleware, postController.getMyPosts);
router.get("/:id", postController.getPostById);
router.get("/slug/:slug", postController.getPostBySlug);
router.post("/", authMiddleware, csrfProtection, postController.createPost);
router.put("/:id", authMiddleware, csrfProtection, postController.updatePost);
router.delete("/:id", authMiddleware, csrfProtection, postController.deletePost);

export default router;
