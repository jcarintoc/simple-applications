import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get CSRF token from cookie
function getCsrfToken(): string | null {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Add CSRF token to all state-changing requests and cache control for GET requests
apiClient.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();
  if (csrfToken && config.method && !["get", "head", "options"].includes(config.method.toLowerCase())) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
  }
  // Prevent caching for GET requests to avoid 304 issues
  if (config.method && ["get", "head"].includes(config.method.toLowerCase())) {
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";
  }
  return config;
});

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: RetryableRequest;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(apiClient(config));
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error: string }>) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;
    const errorMessage = error.response?.data?.error;
    const needsRefresh = isUnauthorized &&
      (errorMessage === "Token expired" || errorMessage === "Not authenticated");

    // Don't try to refresh if we're already on refresh/login/register/logout
    const isRefreshRoute = originalRequest.url?.includes("/auth/refresh");
    const isLoginRoute = originalRequest.url?.includes("/auth/login");
    const isRegisterRoute = originalRequest.url?.includes("/auth/register");
    const isLogoutRoute = originalRequest.url?.includes("/auth/logout");
    const shouldSkipRefresh = isRefreshRoute || isLoginRoute || isRegisterRoute || isLogoutRoute;

    // Only attempt refresh if unauthorized, not skipped route, and not already retried
    if (needsRefresh && !shouldSkipRefresh && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        // Don't redirect here - let the ProtectedRoute handle it
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
