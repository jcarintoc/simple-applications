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

export type FavoriteCategory = "Movie" | "Song" | "Book" | "Game" | "Show" | "Other";

export interface Favorite {
  id: number;
  user_id: number;
  name: string;
  category: FavoriteCategory;
  created_at: string;
}

export interface FavoriteResponse {
  id: number;
  name: string;
  category: FavoriteCategory;
  created_at: string;
}

export interface CreateFavoriteDto {
  name: string;
  category: FavoriteCategory;
}

export interface UpdateFavoriteDto {
  name?: string;
  category?: FavoriteCategory;
}
