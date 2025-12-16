import { subredditRepository } from "../repositories/index.js";
import type {
  Subreddit,
  SubredditWithCreator,
  CreateSubredditDto,
  UpdateSubredditDto,
} from "../types/index.js";

export class SubredditService {
  getAll(): SubredditWithCreator[] {
    return subredditRepository.findAll();
  }

  getById(id: number): SubredditWithCreator | null {
    return subredditRepository.findById(id) || null;
  }

  create(creatorId: number, data: CreateSubredditDto): SubredditWithCreator {
    // Validate name uniqueness
    const existing = subredditRepository.findByName(data.name);
    if (existing) {
      throw new Error("Subreddit name already exists");
    }

    // Validate name format: alphanumeric + underscores, min 3 chars
    if (!/^[a-zA-Z0-9_]{3,}$/.test(data.name)) {
      throw new Error("Subreddit name must be alphanumeric with underscores, minimum 3 characters");
    }

    const id = subredditRepository.create(creatorId, data);
    const subreddit = subredditRepository.findById(id);
    if (!subreddit) {
      throw new Error("Failed to create subreddit");
    }
    return subreddit;
  }

  update(id: number, creatorId: number, data: UpdateSubredditDto): SubredditWithCreator {
    const subreddit = subredditRepository.findById(id);
    if (!subreddit) {
      throw new Error("Subreddit not found");
    }

    if (subreddit.creator_id !== creatorId) {
      throw new Error("You don't have permission to update this subreddit");
    }

    // Validate name uniqueness if name is being updated
    if (data.name && data.name !== subreddit.name) {
      const existing = subredditRepository.findByName(data.name);
      if (existing) {
        throw new Error("Subreddit name already exists");
      }
      if (!/^[a-zA-Z0-9_]{3,}$/.test(data.name)) {
        throw new Error("Subreddit name must be alphanumeric with underscores, minimum 3 characters");
      }
    }

    const success = subredditRepository.update(id, data);
    if (!success) {
      throw new Error("Failed to update subreddit");
    }

    const updated = subredditRepository.findById(id);
    if (!updated) {
      throw new Error("Failed to retrieve updated subreddit");
    }
    return updated;
  }

  delete(id: number, creatorId: number): boolean {
    const subreddit = subredditRepository.findById(id);
    if (!subreddit) {
      throw new Error("Subreddit not found");
    }

    if (subreddit.creator_id !== creatorId) {
      throw new Error("You don't have permission to delete this subreddit");
    }

    return subredditRepository.delete(id);
  }
}

export const subredditService = new SubredditService();

