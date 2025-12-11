import type { Request, Response } from "express";
import { surveyService } from "../services/survey.service.js";
import type { CSRFRequest } from "../middleware/csrf.middleware.js";
import type { CreateSurveyDto, SubmitResponseDto } from "../types/index.js";

export class SurveyController {
  // Get all surveys (public)
  getAll(_req: Request, res: Response): void {
    try {
      const surveys = surveyService.findAll();
      res.json({ surveys });
    } catch (error) {
      this.handleError(res, error, "Failed to fetch surveys");
    }
  }

  // Get user's surveys (requires auth)
  getMySurveys(req: CSRFRequest, res: Response): void {
    const userId = req.userId!;
    try {
      const surveys = surveyService.findByUserId(userId);
      res.json({ surveys });
    } catch (error) {
      this.handleError(res, error, "Failed to fetch surveys");
    }
  }

  // Get single survey (public)
  getById(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }

    try {
      const survey = surveyService.findById(id);
      if (!survey) {
        res.status(404).json({ error: "Survey not found" });
        return;
      }
      res.json({ survey });
    } catch (error) {
      this.handleError(res, error, "Failed to fetch survey");
    }
  }

  // Create survey (requires auth + CSRF)
  create(req: CSRFRequest, res: Response): void {
    const userId = req.userId!;
    const { question, options } = req.body as CreateSurveyDto;

    if (!question || !options || !Array.isArray(options)) {
      res.status(400).json({ error: "Question and options are required" });
      return;
    }

    try {
      const survey = surveyService.create(userId, { question, options });
      res.status(201).json({ survey });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create survey";
      if (message.includes("at least") || message.includes("at most")) {
        res.status(400).json({ error: message });
        return;
      }
      this.handleError(res, error, "Failed to create survey");
    }
  }

  // Submit response (requires auth + CSRF)
  submitResponse(req: CSRFRequest, res: Response): void {
    const userId = req.userId!;
    const surveyId = parseInt(req.params.id, 10);
    const { selected_option } = req.body as SubmitResponseDto;

    if (isNaN(surveyId)) {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }

    if (selected_option === undefined || selected_option === null) {
      res.status(400).json({ error: "Selected option is required" });
      return;
    }

    try {
      surveyService.submitResponse(surveyId, userId, selected_option);
      res.json({ message: "Response submitted successfully" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit response";
      if (message.includes("not found")) {
        res.status(404).json({ error: message });
        return;
      }
      if (message.includes("Invalid") || message.includes("already responded")) {
        res.status(400).json({ error: message });
        return;
      }
      this.handleError(res, error, "Failed to submit response");
    }
  }

  // Get results (public)
  getResults(req: Request, res: Response): void {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }

    try {
      const results = surveyService.getResults(id);
      if (!results) {
        res.status(404).json({ error: "Survey not found" });
        return;
      }
      res.json({ survey: results });
    } catch (error) {
      this.handleError(res, error, "Failed to fetch results");
    }
  }

  // Delete survey (requires auth + CSRF)
  delete(req: CSRFRequest, res: Response): void {
    const userId = req.userId!;
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid survey ID" });
      return;
    }

    try {
      surveyService.delete(id, userId);
      res.json({ message: "Survey deleted successfully" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete survey";
      if (message.includes("not found") || message.includes("access denied")) {
        res.status(404).json({ error: message });
        return;
      }
      this.handleError(res, error, "Failed to delete survey");
    }
  }

  private handleError(res: Response, error: unknown, fallbackMessage: string): void {
    console.error(`${fallbackMessage}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const surveyController = new SurveyController();

