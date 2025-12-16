import { storyRepository } from "../repositories/index.js";
import type { StoryWithAuthor } from "../types/index.js";

export class StoryService {
  getActive(): StoryWithAuthor[] {
    return storyRepository.findActive();
  }

  getByUser(userId: number): StoryWithAuthor[] {
    return storyRepository.findByUser(userId);
  }
}

export const storyService = new StoryService();
