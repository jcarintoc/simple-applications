import { apiClient } from "./client";
import {
  type Survey,
  type SurveyWithResults,
  type CreateSurveyInput,
  type SurveysResponse,
  type SurveyResponse,
  type SurveyResultsResponse,
  type CSRFTokenResponse,
  surveysResponseSchema,
  surveyResponseSchema,
  surveyResultsResponseSchema,
  csrfTokenResponseSchema,
} from "./types";

export const surveysApi = {
  getAll: async (): Promise<Survey[]> => {
    const response = await apiClient.get<SurveysResponse>("/surveys");
    const data = surveysResponseSchema.parse(response.data);
    return data.surveys;
  },

  getMySurveys: async (): Promise<Survey[]> => {
    const response = await apiClient.get<SurveysResponse>("/surveys/user/my-surveys");
    const data = surveysResponseSchema.parse(response.data);
    return data.surveys;
  },

  getById: async (id: number): Promise<Survey> => {
    const response = await apiClient.get<SurveyResponse>(`/surveys/${id}`);
    const data = surveyResponseSchema.parse(response.data);
    return data.survey;
  },

  create: async (data: CreateSurveyInput, csrfToken: string): Promise<Survey> => {
    const response = await apiClient.post<SurveyResponse>("/surveys", data, {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    });
    const parsed = surveyResponseSchema.parse(response.data);
    return parsed.survey;
  },

  submitResponse: async (surveyId: number, selectedOption: number, csrfToken: string): Promise<void> => {
    await apiClient.post(
      `/surveys/${surveyId}/respond`,
      { selected_option: selectedOption },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      }
    );
  },

  getResults: async (id: number): Promise<SurveyWithResults> => {
    const response = await apiClient.get<SurveyResultsResponse>(`/surveys/${id}/results`);
    const data = surveyResultsResponseSchema.parse(response.data);
    return data.survey;
  },

  delete: async (id: number, csrfToken: string): Promise<void> => {
    await apiClient.delete(`/surveys/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    });
  },

  getCSRFToken: async (): Promise<string> => {
    const response = await apiClient.get<CSRFTokenResponse>("/csrf-token");
    const data = csrfTokenResponseSchema.parse(response.data);
    return data.csrfToken;
  },
};

