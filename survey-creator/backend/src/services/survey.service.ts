import { surveyRepository } from "../repositories/index.js";
import type { Survey, CreateSurveyDto, SurveyResponse, SurveyWithResults } from "../types/index.js";

export class SurveyService {
  findAll(): SurveyResponse[] {
    const surveys = surveyRepository.findAll();
    return surveys.map((s) => this.toSurveyResponse(s));
  }

  findByUserId(userId: number): SurveyResponse[] {
    const surveys = surveyRepository.findByUserId(userId);
    return surveys.map((s) => this.toSurveyResponse(s));
  }

  findById(id: number): SurveyResponse | null {
    const survey = surveyRepository.findById(id);
    if (!survey) return null;
    return this.toSurveyResponse(survey);
  }

  create(userId: number, data: CreateSurveyDto): SurveyResponse {
    if (data.options.length < 2) {
      throw new Error("Survey must have at least 2 options");
    }
    if (data.options.length > 6) {
      throw new Error("Survey can have at most 6 options");
    }

    const id = surveyRepository.create(userId, data);
    const survey = surveyRepository.findById(id);
    if (!survey) {
      throw new Error("Failed to create survey");
    }
    return this.toSurveyResponse(survey);
  }

  delete(id: number, userId: number): void {
    const survey = surveyRepository.findById(id);
    if (!survey || survey.user_id !== userId) {
      throw new Error("Survey not found or access denied");
    }

    const deleted = surveyRepository.delete(id, userId);
    if (!deleted) {
      throw new Error("Failed to delete survey");
    }
  }

  submitResponse(surveyId: number, userId: number, selectedOption: number): void {
    const survey = surveyRepository.findById(surveyId);
    if (!survey) {
      throw new Error("Survey not found");
    }

    const options = JSON.parse(survey.options) as string[];
    if (selectedOption < 0 || selectedOption >= options.length) {
      throw new Error("Invalid option selected");
    }

    // Check if user already responded
    if (surveyRepository.hasUserResponded(surveyId, userId)) {
      throw new Error("You have already responded to this survey");
    }

    surveyRepository.addResponse(surveyId, userId, selectedOption);
  }

  getResults(id: number): SurveyWithResults | null {
    const survey = surveyRepository.findById(id);
    if (!survey) return null;

    const responses = surveyRepository.getResponsesBySurveyId(id);
    const options = JSON.parse(survey.options) as string[];
    const totalResponses = responses.length;

    const results = options.map((option, index) => {
      const count = responses.filter((r) => r.selected_option === index).length;
      const percentage = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
      return { option, count, percentage };
    });

    return {
      ...this.toSurveyResponse(survey),
      results,
    };
  }

  private toSurveyResponse(survey: Survey): SurveyResponse {
    return {
      id: survey.id,
      question: survey.question,
      options: JSON.parse(survey.options) as string[],
      created_at: survey.created_at,
      author_name: surveyRepository.getAuthorName(survey.user_id),
      response_count: surveyRepository.getResponseCount(survey.id),
    };
  }
}

export const surveyService = new SurveyService();

