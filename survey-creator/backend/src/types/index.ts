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

// Survey types
export interface Survey {
  id: number;
  user_id: number;
  question: string;
  options: string; // JSON stringified array
  created_at: string;
}

export interface SurveyResponse {
  id: number;
  question: string;
  options: string[];
  created_at: string;
  author_name: string;
  response_count: number;
}

export interface SurveyWithResults extends SurveyResponse {
  results: { option: string; count: number; percentage: number }[];
}

export interface CreateSurveyDto {
  question: string;
  options: string[];
}

export interface SubmitResponseDto {
  selected_option: number;
}

export interface Response {
  id: number;
  survey_id: number;
  user_id: number;
  selected_option: number;
  created_at: string;
}
