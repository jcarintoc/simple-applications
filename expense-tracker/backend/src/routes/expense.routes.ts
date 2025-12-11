import { Router } from "express";
import { expenseController } from "../controllers/index.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { csrfProtection, csrfTokenMiddleware } from "../middleware/csrf.middleware.js";

const router = Router();

// All expense routes require authentication
router.use(authenticate);
router.use(csrfTokenMiddleware);

// GET /api/expenses/csrf-token - Get CSRF token
router.get("/csrf-token", expenseController.getCsrfToken.bind(expenseController));

// GET /api/expenses - Get all expenses for the authenticated user
router.get("/", expenseController.getAll.bind(expenseController));

// GET /api/expenses/export - Export expenses as CSV
router.get("/export", expenseController.exportCSV.bind(expenseController));

// GET /api/expenses/:id - Get a specific expense
router.get("/:id", expenseController.getById.bind(expenseController));

// POST /api/expenses - Create a new expense (CSRF protected)
router.post("/", csrfProtection, expenseController.create.bind(expenseController));

// PUT /api/expenses/:id - Update an expense (CSRF protected)
router.put("/:id", csrfProtection, expenseController.update.bind(expenseController));

// DELETE /api/expenses/:id - Delete an expense (CSRF protected)
router.delete("/:id", csrfProtection, expenseController.delete.bind(expenseController));

export default router;
