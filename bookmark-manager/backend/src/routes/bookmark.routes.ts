import { Router } from "express";
import { bookmarkController } from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateCsrfToken, getCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/csrf-token", getCsrfToken);

router.get("/", (req, res) => bookmarkController.getBookmarks(req, res));
router.get("/tags", (req, res) => bookmarkController.getTags(req, res));
router.get("/:id", (req, res) => bookmarkController.getBookmarkById(req, res));

router.post("/", validateCsrfToken, (req, res) => bookmarkController.createBookmark(req, res));
router.put("/:id", validateCsrfToken, (req, res) => bookmarkController.updateBookmark(req, res));
router.delete("/:id", validateCsrfToken, (req, res) => bookmarkController.deleteBookmark(req, res));

export default router;
