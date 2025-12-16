import { z } from "zod";

// Zod Schemas
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export const authResponseSchema = z.object({
  message: z.string(),
  user: userSchema,
});

export const userResponseSchema = z.object({
  user: userSchema,
});

export const errorResponseSchema = z.object({
  error: z.string(),
});

// Types derived from schemas
// Product schemas
export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  image_url: z.string(),
  category: z.string(),
  stock: z.number(),
  created_at: z.string(),
  average_rating: z.number().optional(),
  review_count: z.number().optional(),
});

export const reviewSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  reviewer_name: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().nullable(),
  created_at: z.string(),
});

export const productDetailSchema = productSchema.extend({
  reviews: z.array(reviewSchema),
});

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
});

export const productResponseSchema = z.object({
  product: productDetailSchema,
});

export const categoriesResponseSchema = z.object({
  categories: z.array(z.string()),
});

// Cart schemas
export const cartItemSchema = z.object({
  id: z.number(),
  session_id: z.string().nullable(),
  user_id: z.number().nullable(),
  product_id: z.number(),
  quantity: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  product: productSchema,
});

export const cartResponseSchema = z.object({
  items: z.array(cartItemSchema),
});

export const addToCartInputSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1),
});

export const updateCartItemInputSchema = z.object({
  quantity: z.number().min(1),
});

export const cartItemResponseSchema = z.object({
  item: cartItemSchema,
});

// Order schemas
export const orderItemSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  product_id: z.number(),
  quantity: z.number(),
  price: z.number(),
  product: productSchema,
});

export const orderSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  total: z.number(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  created_at: z.string(),
  items: z.array(orderItemSchema),
});

export const ordersResponseSchema = z.object({
  orders: z.array(orderSchema),
});

export const orderResponseSchema = z.object({
  order: orderSchema,
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type Product = z.infer<typeof productSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type ProductDetail = z.infer<typeof productDetailSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type AddToCartInput = z.infer<typeof addToCartInputSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemInputSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
