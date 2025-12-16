import db from "../db/database.js";
import type { JobPost, JobApplication, JobApplicationDto } from "../types/index.js";

export class JobRepository {
  findJobById(id: number): JobPost | undefined {
    return db.prepare("SELECT * FROM job_posts WHERE id = ?").get(id) as JobPost | undefined;
  }

  findAllJobs(limit: number, offset: number): JobPost[] {
    return db.prepare("SELECT * FROM job_posts ORDER BY created_at DESC LIMIT ? OFFSET ?")
      .all(limit, offset) as JobPost[];
  }

  countJobs(): number {
    const result = db.prepare("SELECT COUNT(*) as count FROM job_posts").get() as { count: number };
    return result.count;
  }

  findApplicationByUserAndJob(userId: number, jobId: number): JobApplication | undefined {
    return db.prepare("SELECT * FROM job_applications WHERE user_id = ? AND job_post_id = ?")
      .get(userId, jobId) as JobApplication | undefined;
  }

  findApplicationsByUserId(userId: number): JobApplication[] {
    return db.prepare("SELECT * FROM job_applications WHERE user_id = ? ORDER BY created_at DESC")
      .all(userId) as JobApplication[];
  }

  createApplication(userId: number, jobId: number, data: JobApplicationDto): number {
    const result = db.prepare(
      "INSERT INTO job_applications (user_id, job_post_id, cover_letter) VALUES (?, ?, ?)"
    ).run(userId, jobId, data.cover_letter || null);
    return result.lastInsertRowid as number;
  }

  findApplicationById(id: number): JobApplication | undefined {
    return db.prepare("SELECT * FROM job_applications WHERE id = ?").get(id) as JobApplication | undefined;
  }
}

export const jobRepository = new JobRepository();
