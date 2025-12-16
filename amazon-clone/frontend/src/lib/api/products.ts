import { apiClient } from "./client";
import {
  type Product,
  type ProductDetail,
  productsResponseSchema,
  productResponseSchema,
  categoriesResponseSchema,
} from "./types";

export interface ProductFilters {
  category?: string;
  search?: string;
}

export const productsApi = {
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.category) {
      params.append("category", filters.category);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }

    const url = `/products${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get(url);
    return productsResponseSchema.parse(response.data).products;
  },

  getProductById: async (id: number): Promise<ProductDetail> => {
    const response = await apiClient.get(`/products/${id}`);
    return productResponseSchema.parse(response.data).product;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get("/products/categories");
    return categoriesResponseSchema.parse(response.data).categories;
  },
};