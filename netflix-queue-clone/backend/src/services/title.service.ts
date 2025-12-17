import { titleRepository } from "../repositories/index.js";
import type { TitleWithUserData, TitleType } from "../types/index.js";

export class TitleService {
  getAllTitles(userId: number | null): TitleWithUserData[] {
    return titleRepository.findAllWithUserData(userId);
  }

  getTitlesByType(type: TitleType, userId: number | null): TitleWithUserData[] {
    const titles = titleRepository.findByType(type);
    const allWithData = titleRepository.findAllWithUserData(userId);
    const titleIds = new Set(titles.map((t) => t.id));
    return allWithData.filter((t) => titleIds.has(t.id));
  }

  searchTitles(query: string, userId: number | null): TitleWithUserData[] {
    const titles = titleRepository.search(query);
    const allWithData = titleRepository.findAllWithUserData(userId);
    const titleIds = new Set(titles.map((t) => t.id));
    return allWithData.filter((t) => titleIds.has(t.id));
  }

  getGenres(): string[] {
    return titleRepository.getGenres();
  }
}

export const titleService = new TitleService();
