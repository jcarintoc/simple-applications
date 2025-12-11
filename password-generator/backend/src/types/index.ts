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

// Password Generator Types
export interface SavedPassword {
  id: number;
  user_id: number;
  password: string;
  label: string | null;
  length: number;
  has_uppercase: number;
  has_lowercase: number;
  has_numbers: number;
  has_symbols: number;
  created_at: string;
}

export interface SavedPasswordResponse {
  id: number;
  password: string;
  label: string | null;
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  createdAt: string;
}

export interface GeneratePasswordDto {
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
}

export interface SavePasswordDto {
  password: string;
  label?: string;
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
}
