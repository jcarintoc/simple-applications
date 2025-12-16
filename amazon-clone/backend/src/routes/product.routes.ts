import { Router } from "express";
import { productController } from "../controllers/product.controller.js";

const router = Router();

router.get("/", productController.getProducts.bind(productController));
router.get("/categories", productController.getCategories.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));

export default router;