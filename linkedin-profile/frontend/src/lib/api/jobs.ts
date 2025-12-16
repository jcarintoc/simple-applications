import { apiClient } from "./client";
import type { JobPost, JobApplicationInput, JobApplicationResponse } from "./types";

interface JobsResponse {
  jobs: JobPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export async function getJobs(page = 1, limit = 20): Promise<JobsResponse> {
  const { data } = await apiClient.get<JobsResponse>("/jobs", {
    params: { page, limit },
  });
  return data;
}

export async function getJobById(jobId: number): Promise<JobPost> {
  const { data } = await apiClient.get<{ job: JobPost }>(`/jobs/${jobId}`);
  return data.job;
}

export async function applyToJob(jobId: number, input?: JobApplicationInput): Promise<void> {
  await apiClient.post(`/jobs/${jobId}/apply`, input || {});
}

export async function getMyApplications(): Promise<JobApplicationResponse[]> {
  const { data } = await apiClient.get<{ applications: JobApplicationResponse[] }>("/jobs/applications/my");
  return data.applications;
}
