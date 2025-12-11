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

export interface Expense {
  id: number;
  user_id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseDto {
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface UpdateExpenseDto {
  title?: string;
  amount?: number;
  category?: string;
  date?: string;
  description?: string;
}
