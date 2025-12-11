import rateLimit from "express-rate-limit";

// Global rate limit: 100 requests per 15 minutes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints: 5 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Post creation: 10 posts per hour
export const postCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Too many posts created, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Comment creation: 30 comments per hour
export const commentCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: "Too many comments, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Like/unlike: 60 actions per minute
export const likeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: "Too many like/unlike actions, please slow down",
  standardHeaders: true,
  legacyHeaders: false,
});

// Follow/unfollow: 20 actions per hour
export const followLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Too many follow/unfollow actions, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
