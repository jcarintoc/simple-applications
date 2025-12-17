import { watchlistRepository, titleRepository } from "../repositories/index.js";
import type { TitleWithUserData } from "../types/index.js";

export class WatchlistService {
  getWatchlist(userId: number): TitleWithUserData[] {
    return watchlistRepository.findByUserId(userId);
  }

  toggleWatchlist(userId: number, titleId: number): { success: boolean; in_watchlist: boolean; error?: string } {
    const title = titleRepository.findById(titleId);
    if (!title) {
      return { success: false, in_watchlist: false, error: "Title not found" };
    }

    const inWatchlist = watchlistRepository.toggle(userId, titleId);
    return { success: true, in_watchlist: inWatchlist };
  }

  addToWatchlist(userId: number, titleId: number): { success: boolean; error?: string } {
    const title = titleRepository.findById(titleId);
    if (!title) {
      return { success: false, error: "Title not found" };
    }

    if (watchlistRepository.isInWatchlist(userId, titleId)) {
      return { success: false, error: "Already in watchlist" };
    }

    watchlistRepository.add(userId, titleId);
    return { success: true };
  }

  removeFromWatchlist(userId: number, titleId: number): { success: boolean; error?: string } {
    if (!watchlistRepository.isInWatchlist(userId, titleId)) {
      return { success: false, error: "Not in watchlist" };
    }

    watchlistRepository.remove(userId, titleId);
    return { success: true };
  }
}

export const watchlistService = new WatchlistService();
