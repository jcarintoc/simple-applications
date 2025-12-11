import { apiClient } from "./client";
import type { GeneratePasswordInput, SavePasswordInput, SavedPassword } from "./types";

let csrfToken: string | null = null;

export const passwordApi = {
  async getCsrfToken(): Promise<string> {
    if (csrfToken) return csrfToken;
    const response = await apiClient.get<{ csrfToken: string }>("/passwords/csrf-token");
    csrfToken = response.data.csrfToken;
    return csrfToken;
  },

  clearCsrfToken(): void {
    csrfToken = null;
  },

  async generatePassword(data: GeneratePasswordInput): Promise<string> {
    const response = await apiClient.post<{ password: string }>("/passwords/generate", data);
    return response.data.password;
  },

  async getSavedPasswords(): Promise<SavedPassword[]> {
    const response = await apiClient.get<{ passwords: SavedPassword[] }>("/passwords");
    return response.data.passwords;
  },

  async savePassword(data: SavePasswordInput): Promise<SavedPassword> {
    const response = await apiClient.post<{ password: SavedPassword }>("/passwords", data);
    return response.data.password;
  },

  async deletePassword(id: number): Promise<void> {
    try {
      const token = await this.getCsrfToken();
      await apiClient.delete(`/passwords/${id}`, {
        headers: { "x-csrf-token": token },
      });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 403 && axiosError.response?.data?.error === "Invalid CSRF token") {
          this.clearCsrfToken();
          const newToken = await this.getCsrfToken();
          await apiClient.delete(`/passwords/${id}`, {
            headers: { "x-csrf-token": newToken },
          });
          return;
        }
      }
      throw error;
    }
  },

  async deleteAllPasswords(): Promise<void> {
    try {
      const token = await this.getCsrfToken();
      await apiClient.delete("/passwords", {
        headers: { "x-csrf-token": token },
      });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 403 && axiosError.response?.data?.error === "Invalid CSRF token") {
          this.clearCsrfToken();
          const newToken = await this.getCsrfToken();
          await apiClient.delete("/passwords", {
            headers: { "x-csrf-token": newToken },
          });
          return;
        }
      }
      throw error;
    }
  },
};

