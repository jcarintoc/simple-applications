import { jobRepository } from "../repositories/job.repository.js";
import type { JobApplicationDto, JobPostWithApplicationStatus, JobApplicationWithDetails } from "../types/index.js";

export class JobService {
  getJobs(userId: number, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const jobs = jobRepository.findAllJobs(limit, offset);
    const total = jobRepository.countJobs();

    const jobsWithApplicationStatus: JobPostWithApplicationStatus[] = jobs.map(job => ({
      ...job,
      has_applied: !!jobRepository.findApplicationByUserAndJob(userId, job.id)
    }));

    return {
      jobs: jobsWithApplicationStatus,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    };
  }

  getJobById(jobId: number, userId: number): JobPostWithApplicationStatus {
    const job = jobRepository.findJobById(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    return {
      ...job,
      has_applied: !!jobRepository.findApplicationByUserAndJob(userId, jobId)
    };
  }

  applyToJob(userId: number, jobId: number, data: JobApplicationDto) {
    const job = jobRepository.findJobById(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    const existingApplication = jobRepository.findApplicationByUserAndJob(userId, jobId);
    if (existingApplication) {
      throw new Error("Already applied to this job");
    }

    const applicationId = jobRepository.createApplication(userId, jobId, data);
    return jobRepository.findApplicationById(applicationId);
  }

  getMyApplications(userId: number): JobApplicationWithDetails[] {
    const applications = jobRepository.findApplicationsByUserId(userId);

    return applications.map(app => {
      const job = jobRepository.findJobById(app.job_post_id)!;
      return {
        id: app.id,
        job_post_id: app.job_post_id,
        job_title: job.job_title,
        company_name: job.company_name,
        status: app.status,
        created_at: app.created_at
      };
    });
  }
}

export const jobService = new JobService();
