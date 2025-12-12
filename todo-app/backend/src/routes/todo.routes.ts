import { Router } from "express";
import { todoController } from "../controllers/index.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

// All todo routes require authentication
router.use(authMiddleware);

// All state-changing routes require CSRF token
router.use(verifyCsrfToken);

// GET routes
router.get("/", (req, res) => todoController.getTodos(req as AuthRequest, res));
router.get("/:id", (req, res) => todoController.getTodoById(req as AuthRequest, res));

// POST routes
router.post("/", (req, res) => todoController.createTodo(req as AuthRequest, res));

// PUT/PATCH routes
router.put("/:id", (req, res) => todoController.updateTodo(req as AuthRequest, res));
router.patch("/:id", (req, res) => todoController.updateTodo(req as AuthRequest, res));

// DELETE routes
router.delete("/:id", (req, res) => todoController.deleteTodo(req as AuthRequest, res));
router.delete("/", (req, res) => todoController.deleteAllTodos(req as AuthRequest, res));

export default router;
