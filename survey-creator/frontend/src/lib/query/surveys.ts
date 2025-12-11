import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { surveysApi, type CreateSurveyInput } from "../api";

export const surveysKeys = {
  all: ["surveys"] as const,
  lists: () => [...surveysKeys.all, "list"] as const,
  list: () => [...surveysKeys.lists()] as const,
  my: () => [...surveysKeys.all, "my"] as const,
  detail: (id: number) => [...surveysKeys.all, "detail", id] as const,
  results: (id: number) => [...surveysKeys.all, "results", id] as const,
};

export function useSurveys() {
  return useQuery({
    queryKey: surveysKeys.list(),
    queryFn: surveysApi.getAll,
    staleTime: 30 * 1000,
  });
}

export function useMySurveys() {
  return useQuery({
    queryKey: surveysKeys.my(),
    queryFn: surveysApi.getMySurveys,
    staleTime: 30 * 1000,
  });
}

export function useSurvey(id: number) {
  return useQuery({
    queryKey: surveysKeys.detail(id),
    queryFn: () => surveysApi.getById(id),
    staleTime: 60 * 1000,
  });
}

export function useSurveyResults(id: number) {
  return useQuery({
    queryKey: surveysKeys.results(id),
    queryFn: () => surveysApi.getResults(id),
    staleTime: 10 * 1000,
  });
}

export function useCSRFToken() {
  return useQuery({
    queryKey: ["csrf-token"],
    queryFn: surveysApi.getCSRFToken,
    staleTime: 50 * 60 * 1000,
  });
}

export function useCreateSurvey() {
  const queryClient = useQueryClient();
  const { data: csrfToken, refetch: refetchCSRFToken } = useCSRFToken();

  return useMutation({
    mutationFn: async (data: CreateSurveyInput) => {
      let token = csrfToken;
      if (!token) {
        const result = await refetchCSRFToken();
        token = result.data;
      }
      if (!token) {
        throw new Error("CSRF token not available");
      }
      return surveysApi.create(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveysKeys.list() });
      queryClient.invalidateQueries({ queryKey: surveysKeys.my() });
    },
  });
}

export function useSubmitResponse() {
  const queryClient = useQueryClient();
  const { data: csrfToken, refetch: refetchCSRFToken } = useCSRFToken();

  return useMutation({
    mutationFn: async ({ surveyId, selectedOption }: { surveyId: number; selectedOption: number }) => {
      let token = csrfToken;
      if (!token) {
        const result = await refetchCSRFToken();
        token = result.data;
      }
      if (!token) {
        throw new Error("CSRF token not available");
      }
      return surveysApi.submitResponse(surveyId, selectedOption, token);
    },
    onSuccess: (_, { surveyId }) => {
      queryClient.invalidateQueries({ queryKey: surveysKeys.results(surveyId) });
      queryClient.invalidateQueries({ queryKey: surveysKeys.detail(surveyId) });
      queryClient.invalidateQueries({ queryKey: surveysKeys.list() });
    },
  });
}

export function useDeleteSurvey() {
  const queryClient = useQueryClient();
  const { data: csrfToken, refetch: refetchCSRFToken } = useCSRFToken();

  return useMutation({
    mutationFn: async (id: number) => {
      let token = csrfToken;
      if (!token) {
        const result = await refetchCSRFToken();
        token = result.data;
      }
      if (!token) {
        throw new Error("CSRF token not available");
      }
      return surveysApi.delete(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveysKeys.list() });
      queryClient.invalidateQueries({ queryKey: surveysKeys.my() });
    },
  });
}

