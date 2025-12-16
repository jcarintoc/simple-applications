import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

// GET cart - no CSRF needed (read operation)
router.get("/", cartController.getCart.bind(cartController));

// All mutations require CSRF
router.post("/", verifyCsrfToken, cartController.addToCart.bind(cartController));
router.put("/:id", verifyCsrfToken, cartController.updateCartItem.bind(cartController));
router.delete("/:id", verifyCsrfToken, cartController.removeCartItem.bind(cartController));
router.delete("/", verifyCsrfToken, cartController.clearCart.bind(cartController));

export default router;