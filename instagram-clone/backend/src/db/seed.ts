import { db } from "./database.js";

export function seedDatabase(): void {
  // Check if posts already exist
  const existingPosts = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
  if (existingPosts.count > 0) {
    return; // Already seeded
  }

  // Create users
  const hashedPassword = "$2b$10$rK9X8J5YqH8vN2mZ3pL5qeKLmNpQrS7tUvWxYzAbCdEfGhIjKlMnO"; // "password"
  
  const users = [
    { email: "alice@example.com", name: "Alice Johnson" },
    { email: "bob@example.com", name: "Bob Smith" },
    { email: "charlie@example.com", name: "Charlie Brown" },
    { email: "diana@example.com", name: "Diana Prince" },
    { email: "eve@example.com", name: "Eve Williams" },
    { email: "frank@example.com", name: "Frank Miller" },
    { email: "grace@example.com", name: "Grace Lee" },
  ];

  const userIds: number[] = [];
  const insertUser = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");

  for (const user of users) {
    const result = insertUser.run(user.email, hashedPassword, user.name);
    userIds.push(result.lastInsertRowid as number);
  }

  // Create posts
  const posts = [
    { user_id: userIds[0], image_url: "https://picsum.photos/seed/alice1/400/400", caption: "Beautiful sunset today! 🌅" },
    { user_id: userIds[0], image_url: "https://picsum.photos/seed/alice2/400/400", caption: "Coffee and code ☕" },
    { user_id: userIds[1], image_url: "https://picsum.photos/seed/bob1/400/400", caption: "New workspace setup" },
    { user_id: userIds[1], image_url: "https://picsum.photos/seed/bob2/400/400", caption: "Weekend vibes" },
    { user_id: userIds[2], image_url: "https://picsum.photos/seed/charlie1/400/400", caption: "Nature walk" },
    { user_id: userIds[2], image_url: "https://picsum.photos/seed/charlie2/400/400", caption: null },
    { user_id: userIds[3], image_url: "https://picsum.photos/seed/diana1/400/400", caption: "Art gallery visit" },
    { user_id: userIds[3], image_url: "https://picsum.photos/seed/diana2/400/400", caption: "Foodie adventures 🍕" },
    { user_id: userIds[4], image_url: "https://picsum.photos/seed/eve1/400/400", caption: "Travel diaries" },
    { user_id: userIds[4], image_url: "https://picsum.photos/seed/eve2/400/400", caption: "Morning run" },
    { user_id: userIds[5], image_url: "https://picsum.photos/seed/frank1/400/400", caption: "Photography session" },
    { user_id: userIds[5], image_url: "https://picsum.photos/seed/frank2/400/400", caption: "Urban exploration" },
    { user_id: userIds[6], image_url: "https://picsum.photos/seed/grace1/400/400", caption: "Studio time" },
    { user_id: userIds[6], image_url: "https://picsum.photos/seed/grace2/400/400", caption: "Creative process" },
    { user_id: userIds[0], image_url: "https://picsum.photos/seed/alice3/400/400", caption: "Throwback Thursday" },
    { user_id: userIds[1], image_url: "https://picsum.photos/seed/bob3/400/400", caption: "Productivity tips" },
    { user_id: userIds[2], image_url: "https://picsum.photos/seed/charlie3/400/400", caption: "Book recommendations" },
    { user_id: userIds[3], image_url: "https://picsum.photos/seed/diana3/400/400", caption: "Fashion finds" },
    { user_id: userIds[4], image_url: "https://picsum.photos/seed/eve3/400/400", caption: "City lights" },
    { user_id: userIds[5], image_url: "https://picsum.photos/seed/frank3/400/400", caption: "Weekend project" },
  ];

  const insertPost = db.prepare("INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)");
  const postIds: number[] = [];

  for (const post of posts) {
    const result = insertPost.run(post.user_id, post.image_url, post.caption);
    postIds.push(result.lastInsertRowid as number);
  }

  // Add some likes
  const insertLike = db.prepare("INSERT INTO likes (user_id, post_id) VALUES (?, ?)");
  const likes = [
    { user_id: userIds[1], post_id: postIds[0] },
    { user_id: userIds[2], post_id: postIds[0] },
    { user_id: userIds[3], post_id: postIds[0] },
    { user_id: userIds[0], post_id: postIds[2] },
    { user_id: userIds[2], post_id: postIds[2] },
    { user_id: userIds[4], post_id: postIds[2] },
    { user_id: userIds[1], post_id: postIds[4] },
    { user_id: userIds[3], post_id: postIds[4] },
    { user_id: userIds[0], post_id: postIds[6] },
    { user_id: userIds[2], post_id: postIds[6] },
    { user_id: userIds[5], post_id: postIds[6] },
    { user_id: userIds[6], post_id: postIds[6] },
    { user_id: userIds[1], post_id: postIds[8] },
    { user_id: userIds[3], post_id: postIds[8] },
    { user_id: userIds[0], post_id: postIds[10] },
    { user_id: userIds[4], post_id: postIds[10] },
    { user_id: userIds[5], post_id: postIds[10] },
  ];

  for (const like of likes) {
    try {
      insertLike.run(like.user_id, like.post_id);
      db.prepare("UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?").run(like.post_id);
    } catch {
      // Ignore duplicates
    }
  }

  // Create comments
  const insertComment = db.prepare("INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)");
  const comments = [
    { user_id: userIds[1], post_id: postIds[0], content: "Amazing shot! 🔥" },
    { user_id: userIds[2], post_id: postIds[0], content: "Love this!" },
    { user_id: userIds[0], post_id: postIds[2], content: "Looks great!" },
    { user_id: userIds[3], post_id: postIds[2], content: "Nice setup!" },
    { user_id: userIds[4], post_id: postIds[2], content: "What desk is that?" },
    { user_id: userIds[1], post_id: postIds[4], content: "Beautiful nature!" },
    { user_id: userIds[3], post_id: postIds[4], content: "Where is this?" },
    { user_id: userIds[0], post_id: postIds[6], content: "Great art!" },
    { user_id: userIds[2], post_id: postIds[6], content: "I need to visit there" },
    { user_id: userIds[5], post_id: postIds[6], content: "Stunning!" },
    { user_id: userIds[6], post_id: postIds[6], content: "Artistic vibes ✨" },
    { user_id: userIds[1], post_id: postIds[8], content: "Where are you traveling?" },
    { user_id: userIds[3], post_id: postIds[8], content: "Safe travels!" },
    { user_id: userIds[0], post_id: postIds[10], content: "Great photography skills!" },
    { user_id: userIds[4], post_id: postIds[10], content: "What camera do you use?" },
    { user_id: userIds[5], post_id: postIds[10], content: "Perfect composition!" },
    { user_id: userIds[2], post_id: postIds[12], content: "Creative!" },
    { user_id: userIds[4], post_id: postIds[12], content: "Love your work!" },
    { user_id: userIds[6], post_id: postIds[14], content: "Nice throwback!" },
    { user_id: userIds[1], post_id: postIds[14], content: "Good memories" },
    { user_id: userIds[3], post_id: postIds[16], content: "Thanks for the recommendations!" },
    { user_id: userIds[5], post_id: postIds[16], content: "Added to my reading list" },
    { user_id: userIds[0], post_id: postIds[18], content: "Beautiful city!" },
    { user_id: userIds[2], post_id: postIds[18], content: "Night photography goals" },
    { user_id: userIds[4], post_id: postIds[18], content: "Amazing lights!" },
    { user_id: userIds[1], post_id: postIds[19], content: "Looks interesting!" },
    { user_id: userIds[3], post_id: postIds[19], content: "What's the project about?" },
    { user_id: userIds[5], post_id: postIds[19], content: "Nice work!" },
  ];

  for (const comment of comments) {
    insertComment.run(comment.user_id, comment.post_id, comment.content);
  }

  // Create follow relationships
  const insertFollow = db.prepare("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)");
  const follows = [
    { follower_id: userIds[0], following_id: userIds[1] },
    { follower_id: userIds[0], following_id: userIds[2] },
    { follower_id: userIds[0], following_id: userIds[3] },
    { follower_id: userIds[1], following_id: userIds[0] },
    { follower_id: userIds[1], following_id: userIds[2] },
    { follower_id: userIds[1], following_id: userIds[4] },
    { follower_id: userIds[2], following_id: userIds[0] },
    { follower_id: userIds[2], following_id: userIds[3] },
    { follower_id: userIds[2], following_id: userIds[5] },
    { follower_id: userIds[3], following_id: userIds[0] },
    { follower_id: userIds[3], following_id: userIds[1] },
    { follower_id: userIds[4], following_id: userIds[1] },
    { follower_id: userIds[4], following_id: userIds[3] },
    { follower_id: userIds[5], following_id: userIds[2] },
    { follower_id: userIds[5], following_id: userIds[6] },
    { follower_id: userIds[6], following_id: userIds[3] },
    { follower_id: userIds[6], following_id: userIds[5] },
  ];

  for (const follow of follows) {
    try {
      insertFollow.run(follow.follower_id, follow.following_id);
    } catch {
      // Ignore duplicates
    }
  }

  // Create stories (some active, some expired)
  const now = new Date();
  const activeStories: Array<{ user_id: number; image_url: string; expires_at: Date }> = [];
  const expiredStories: Array<{ user_id: number; image_url: string; expires_at: Date }> = [];

  // Active stories (expire in future)
  for (let i = 0; i < 8; i++) {
    const expiresAt = new Date(now.getTime() + (12 + i * 3) * 60 * 60 * 1000); // 12-36 hours from now
    activeStories.push({
      user_id: userIds[i % userIds.length],
      image_url: `https://picsum.photos/seed/story${i}/400/600`,
      expires_at: expiresAt,
    });
  }

  // Expired stories (expired in past)
  for (let i = 0; i < 7; i++) {
    const expiresAt = new Date(now.getTime() - (1 + i) * 60 * 60 * 1000); // 1-7 hours ago
    expiredStories.push({
      user_id: userIds[i % userIds.length],
      image_url: `https://picsum.photos/seed/expired${i}/400/600`,
      expires_at: expiresAt,
    });
  }

  const insertStory = db.prepare("INSERT INTO stories (user_id, image_url, expires_at) VALUES (?, ?, ?)");

  // Insert active stories
  for (const story of activeStories) {
    insertStory.run(story.user_id, story.image_url, story.expires_at.toISOString().replace("T", " ").substring(0, 19));
  }

  // Insert expired stories
  for (const story of expiredStories) {
    insertStory.run(story.user_id, story.image_url, story.expires_at.toISOString().replace("T", " ").substring(0, 19));
  }

  console.log("Database seeded with sample users, posts, comments, likes, follows, and stories");
}
