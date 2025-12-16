import type { Request, Response } from "express";
import { productService } from "../services/product.service.js";
import type { ProductFilters } from "../types/index.js";

export class ProductController {
  getProducts(req: Request, res: Response): void {
    const filters: ProductFilters = {};
    
    if (req.query.category && typeof req.query.category === "string") {
      filters.category = req.query.category;
    }
    
    if (req.query.search && typeof req.query.search === "string") {
      filters.search = req.query.search;
    }

    try {
      const products = productService.getProducts(filters);
      res.json({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  getProductById(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    try {
      const product = productService.getProductById(id);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json({ product });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  getCategories(req: Request, res: Response): void {
    try {
      const categories = productService.getCategories();
      res.json({ categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  }
}

export const productController = new ProductController();