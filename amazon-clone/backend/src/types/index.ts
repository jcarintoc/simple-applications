export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthPayload {
  userId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  created_at: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  created_at: string;
  average_rating?: number;
  review_count?: number;
}

export interface Review {
  id: number;
  product_id: number;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ProductDetailResponse extends ProductResponse {
  reviews: Review[];
}

export interface ProductFilters {
  category?: string;
  search?: string;
}

export interface CartItem {
  id: number;
  session_id: string | null;
  user_id: number | null;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithProduct extends CartItem {
  product: ProductResponse;
}

export interface AddToCartDto {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderWithItems extends Order {
  items: Array<OrderItem & { product: ProductResponse }>;
}
