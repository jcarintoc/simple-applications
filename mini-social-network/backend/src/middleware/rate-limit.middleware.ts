import rateLimit from "express-rate-limit";

// Global rate limit: 1000 requests per 15 minutes (very generous for testing)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints: 20 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Post creation: 50 posts per hour
export const postCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: "Too many posts created, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Comment creation: 100 comments per hour
export const commentCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many comments, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Like/unlike: 200 actions per minute
export const likeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: "Too many like/unlike actions, please slow down",
  standardHeaders: true,
  legacyHeaders: false,
});

// Follow/unfollow: 100 actions per hour
export const followLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many follow/unfollow actions, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
