import db from "../db/database.js";
import type { Survey, CreateSurveyDto, Response } from "../types/index.js";

export class SurveyRepository {
  findAll(): Survey[] {
    return db
      .prepare("SELECT * FROM surveys ORDER BY created_at DESC")
      .all() as Survey[];
  }

  findByUserId(userId: number): Survey[] {
    return db
      .prepare("SELECT * FROM surveys WHERE user_id = ? ORDER BY created_at DESC")
      .all(userId) as Survey[];
  }

  findById(id: number): Survey | undefined {
    return db.prepare("SELECT * FROM surveys WHERE id = ?").get(id) as Survey | undefined;
  }

  create(userId: number, data: CreateSurveyDto): number {
    const result = db
      .prepare("INSERT INTO surveys (user_id, question, options) VALUES (?, ?, ?)")
      .run(userId, data.question, JSON.stringify(data.options));
    return result.lastInsertRowid as number;
  }

  delete(id: number, userId: number): boolean {
    const result = db
      .prepare("DELETE FROM surveys WHERE id = ? AND user_id = ?")
      .run(id, userId);
    return result.changes > 0;
  }

  getAuthorName(userId: number): string {
    const user = db.prepare("SELECT name FROM users WHERE id = ?").get(userId) as { name: string } | undefined;
    return user?.name || "Unknown";
  }

  // Response methods
  addResponse(surveyId: number, userId: number, selectedOption: number): number {
    const result = db
      .prepare("INSERT INTO responses (survey_id, user_id, selected_option) VALUES (?, ?, ?)")
      .run(surveyId, userId, selectedOption);
    return result.lastInsertRowid as number;
  }

  getResponsesBySurveyId(surveyId: number): Response[] {
    return db
      .prepare("SELECT * FROM responses WHERE survey_id = ?")
      .all(surveyId) as Response[];
  }

  getResponseCount(surveyId: number): number {
    const result = db
      .prepare("SELECT COUNT(*) as count FROM responses WHERE survey_id = ?")
      .get(surveyId) as { count: number };
    return result.count;
  }

  hasUserResponded(surveyId: number, userId: number): boolean {
    const result = db
      .prepare("SELECT id FROM responses WHERE survey_id = ? AND user_id = ?")
      .get(surveyId, userId);
    return !!result;
  }
}

export const surveyRepository = new SurveyRepository();

