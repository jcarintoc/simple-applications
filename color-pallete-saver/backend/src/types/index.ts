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

// Palette types
export interface Palette {
  id: number;
  user_id: number;
  name: string;
  colors: string; // JSON string of hex colors array
  created_at: string;
}

export interface PaletteResponse {
  id: number;
  name: string;
  colors: string[];
  createdAt: string;
}

export interface CreatePaletteDto {
  name: string;
  colors: string[];
}

export interface UpdatePaletteDto {
  name?: string;
  colors?: string[];
}
