import { apiClient } from "./client";
import {
  type LoginInput,
  type RegisterInput,
  type AuthResponse,
  type UserResponse,
  authResponseSchema,
  userResponseSchema,
} from "./types";

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return authResponseSchema.parse(response.data);
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return authResponseSchema.parse(response.data);
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getMe: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>("/auth/me");
    return userResponseSchema.parse(response.data);
  },

  refresh: async (): Promise<void> => {
    await apiClient.post("/auth/refresh");
  },
};
