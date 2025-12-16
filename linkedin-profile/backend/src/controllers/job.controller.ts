import type { Request, Response } from "express";
import { jobService } from "../services/job.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class JobController {
  getJobs(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (page < 1 || limit < 1 || limit > 100) {
      res.status(400).json({ error: "Invalid pagination parameters" });
      return;
    }

    try {
      const result = jobService.getJobs(userId, page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error getting jobs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  getJobById(req: Request, res: Response): void {
    const userId = (req as AuthRequest).userId!;
    const jobId = parseInt(req.params.id);

    if (isNaN(jobId)) {
      res.status(400).json({ error: "Invalid job ID" });
      return;
    }

    try {
      const job = jobService.getJobById(jobId, userId);
      res.json({ job });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get job";
      if (message === "Job not found") {
        res.status(404).json({ error: message });
        return;
      }
      console.error("Error getting job:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  applyToJob(req: AuthRequest, res: Response): void {
    const userId = req.userId!;
    const jobId = parseInt(req.params.id);
    const { cover_letter } = req.body;

    if (isNaN(jobId)) {
      res.status(400).json({ error: "Invalid job ID" });
      return;
    }

    if (cover_letter !== undefined && typeof cover_letter !== "string") {
      res.status(400).json({ error: "Cover letter must be a string" });
      return;
    }

    try {
      const application = jobService.applyToJob(userId, jobId, { cover_letter });
      res.json({ message: "Application submitted successfully", application });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to apply to job";
      const knownErrors: Record<string, number> = {
        "Job not found": 404,
        "Already applied to this job": 400
      };

      if (knownErrors[message]) {
        res.status(knownErrors[message]).json({ error: message });
        return;
      }

      console.error("Error applying to job:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  getMyApplications(req: AuthRequest, res: Response): void {
    const userId = req.userId!;

    try {
      const applications = jobService.getMyApplications(userId);
      res.json({ applications });
    } catch (error) {
      console.error("Error getting applications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export const jobController = new JobController();
