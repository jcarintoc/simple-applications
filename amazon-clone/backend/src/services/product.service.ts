import { productRepository } from "../repositories/product.repository.js";
import type { ProductResponse, ProductDetailResponse, ProductFilters } from "../types/index.js";

export class ProductService {
  getProducts(filters?: ProductFilters): ProductResponse[] {
    const products = productRepository.findAll(filters);
    
    // Add rating stats for each product
    return products.map((product) => {
      const stats = productRepository.findByIdWithStats(product.id);
      return {
        ...product,
        average_rating: stats?.average_rating,
        review_count: stats?.review_count,
      };
    });
  }

  getProductById(id: number): ProductDetailResponse | null {
    const product = productRepository.findByIdWithStats(id);
    if (!product) return null;

    const reviews = productRepository.getReviewsByProductId(id);

    return {
      ...product,
      reviews,
    };
  }

  getCategories(): string[] {
    return productRepository.getCategories();
  }
}

export const productService = new ProductService();