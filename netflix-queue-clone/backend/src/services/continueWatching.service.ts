import { continueWatchingRepository, titleRepository } from "../repositories/index.js";
import type { ContinueWatchingWithTitle, ContinueWatching } from "../types/index.js";

export class ContinueWatchingService {
  getContinueWatching(sessionId: string): ContinueWatchingWithTitle[] {
    return continueWatchingRepository.findBySessionId(sessionId);
  }

  updateProgress(sessionId: string, titleId: number, progressPercent: number): { success: boolean; progress?: ContinueWatching; error?: string } {
    const title = titleRepository.findById(titleId);
    if (!title) {
      return { success: false, error: "Title not found" };
    }

    if (progressPercent < 0 || progressPercent > 100) {
      return { success: false, error: "Progress must be between 0 and 100" };
    }

    const progress = continueWatchingRepository.updateProgress(sessionId, titleId, progressPercent);
    return { success: true, progress };
  }

  removeFromContinueWatching(sessionId: string, titleId: number): { success: boolean; error?: string } {
    const removed = continueWatchingRepository.remove(sessionId, titleId);
    if (!removed) {
      return { success: false, error: "Not in continue watching list" };
    }
    return { success: true };
  }

  clearContinueWatching(sessionId: string): { success: boolean; cleared: number } {
    const cleared = continueWatchingRepository.clearAll(sessionId);
    return { success: true, cleared };
  }
}

export const continueWatchingService = new ContinueWatchingService();
