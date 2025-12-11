import { apiClient } from "./client";
import type { Expense, CreateExpenseDto, UpdateExpenseDto } from "./types";

export interface ExpensesResponse {
  expenses: Expense[];
  csrfToken: string;
}

export interface ExpenseResponse {
  expense: Expense;
  csrfToken?: string;
}

export interface DeleteExpenseResponse {
  message: string;
  csrfToken: string;
}

let csrfToken: string | null = null;

export function getCsrfToken(): string | null {
  return csrfToken;
}

export function setCsrfToken(token: string): void {
  csrfToken = token;
}

export async function fetchCsrfToken(): Promise<string> {
  const response = await apiClient.get<{ csrfToken: string }>("/expenses/csrf-token");
  if (response.data.csrfToken) {
    setCsrfToken(response.data.csrfToken);
  }
  return response.data.csrfToken;
}

export async function getExpenses(): Promise<ExpensesResponse> {
  const response = await apiClient.get<ExpensesResponse>("/expenses");
  // Only set token if we don't have one yet (initial fetch)
  if (response.data.csrfToken && !getCsrfToken()) {
    setCsrfToken(response.data.csrfToken);
  }
  return response.data;
}

export async function getExpenseById(id: number): Promise<ExpenseResponse> {
  const response = await apiClient.get<ExpenseResponse>(`/expenses/${id}`);
  return response.data;
}

export async function createExpense(
  data: CreateExpenseDto
): Promise<ExpenseResponse> {
  let token = getCsrfToken();
  if (!token) {
    token = await fetchCsrfToken();
  }
  const response = await apiClient.post<ExpenseResponse>("/expenses", data, {
    headers: { "X-CSRF-Token": token },
  });
  if (response.data.csrfToken) {
    setCsrfToken(response.data.csrfToken);
  }
  return response.data;
}

export async function updateExpense(
  id: number,
  data: UpdateExpenseDto
): Promise<ExpenseResponse> {
  let token = getCsrfToken();
  if (!token) {
    token = await fetchCsrfToken();
  }
  const response = await apiClient.put<ExpenseResponse>(
    `/expenses/${id}`,
    data,
    {
      headers: { "X-CSRF-Token": token },
    }
  );
  if (response.data.csrfToken) {
    setCsrfToken(response.data.csrfToken);
  }
  return response.data;
}

export async function deleteExpense(
  id: number
): Promise<DeleteExpenseResponse> {
  let token = getCsrfToken();
  if (!token) {
    token = await fetchCsrfToken();
  }
  const response = await apiClient.delete<DeleteExpenseResponse>(
    `/expenses/${id}`,
    {
      headers: { "X-CSRF-Token": token },
    }
  );
  if (response.data.csrfToken) {
    setCsrfToken(response.data.csrfToken);
  }
  return response.data;
}

export async function exportExpensesCSV(): Promise<Blob> {
  const response = await apiClient.get("/expenses/export", {
    responseType: "blob",
  });
  return response.data;
}
