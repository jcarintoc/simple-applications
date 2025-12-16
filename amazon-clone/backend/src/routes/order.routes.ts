import { Router } from "express";
import { orderController } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

router.post("/checkout", verifyCsrfToken, orderController.checkout.bind(orderController));
router.get("/", orderController.getOrders.bind(orderController));
router.get("/:id", orderController.getOrderById.bind(orderController));

export default router;