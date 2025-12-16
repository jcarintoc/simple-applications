import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobs, getJobById, applyToJob, getMyApplications } from "../api/jobs";
import type { JobApplicationInput } from "../api/types";

export const jobKeys = {
  all: ["jobs"] as const,
  list: (page: number, limit: number) => [...jobKeys.all, "list", { page, limit }] as const,
  detail: (jobId: number) => [...jobKeys.all, "detail", jobId] as const,
  applications: () => [...jobKeys.all, "applications"] as const,
};

export function useJobs(page = 1, limit = 20) {
  return useQuery({
    queryKey: jobKeys.list(page, limit),
    queryFn: () => getJobs(page, limit),
    staleTime: 2 * 60 * 1000,
  });
}

export function useJobById(jobId: number) {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => getJobById(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, input }: { jobId: number; input?: JobApplicationInput }) =>
      applyToJob(jobId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: jobKeys.applications(),
    queryFn: getMyApplications,
    staleTime: 2 * 60 * 1000,
  });
}
