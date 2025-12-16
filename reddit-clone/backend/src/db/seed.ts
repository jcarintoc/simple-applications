import { db } from "./database.js";

export function seedDatabase(): void {
  // Check if subreddits already exist
  const existingSubreddits = db.prepare("SELECT COUNT(*) as count FROM subreddits").get() as { count: number };
  if (existingSubreddits.count > 0) {
    return; // Already seeded
  }

  // Get or create a default user for subreddits and posts
  let defaultUser = db.prepare("SELECT id FROM users LIMIT 1").get() as { id: number } | undefined;

  if (!defaultUser) {
    // Create a default user if none exists
    const hashedPassword = "$2b$10$rK9X8J5YqH8vN2mZ3pL5qeKLmNpQrS7tUvWxYzAbCdEfGhIjKlMnO"; // "password"
    const result = db
      .prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)")
      .run("reddit@example.com", hashedPassword, "Reddit User");
    defaultUser = { id: result.lastInsertRowid as number };
  }

  const userId = defaultUser.id;

  // Create sample subreddits
  const subreddits = [
    {
      name: "programming",
      description: "Computer Programming: Discuss programming languages, algorithms, and software development.",
      creator_id: userId,
    },
    {
      name: "webdev",
      description: "Web Development: All things web development, including HTML, CSS, JavaScript, and frameworks.",
      creator_id: userId,
    },
    {
      name: "javascript",
      description: "JavaScript: The JavaScript programming language and ecosystem.",
      creator_id: userId,
    },
    {
      name: "react",
      description: "React: A JavaScript library for building user interfaces.",
      creator_id: userId,
    },
    {
      name: "technology",
      description: "Technology: The latest technology news and discussions.",
      creator_id: userId,
    },
  ];

  const insertSubreddit = db.prepare("INSERT INTO subreddits (name, description, creator_id) VALUES (?, ?, ?)");
  const subredditIds: number[] = [];

  for (const subreddit of subreddits) {
    const result = insertSubreddit.run(subreddit.name, subreddit.description, subreddit.creator_id);
    subredditIds.push(result.lastInsertRowid as number);
  }

  // Create sample posts
  const posts = [
    {
      subreddit_id: subredditIds[0],
      user_id: userId,
      title: "What programming language should I learn first?",
      content: "I'm new to programming and wondering what language would be best to start with. Any recommendations?",
    },
    {
      subreddit_id: subredditIds[0],
      user_id: userId,
      title: "Best practices for code reviews",
      content: "What are some best practices you follow when doing code reviews? How do you balance being thorough with being efficient?",
    },
    {
      subreddit_id: subredditIds[1],
      user_id: userId,
      title: "How to get started with web development",
      content: "I want to learn web development. Should I start with HTML/CSS/JavaScript or jump into a framework like React?",
    },
    {
      subreddit_id: subredditIds[1],
      user_id: userId,
      title: "CSS Grid vs Flexbox - When to use which?",
      content: "I'm learning CSS layout and wondering when I should use Grid vs Flexbox. What are the use cases for each?",
    },
    {
      subreddit_id: subredditIds[2],
      user_id: userId,
      title: "Understanding JavaScript closures",
      content: "Can someone explain JavaScript closures in simple terms? I'm having trouble grasping the concept.",
    },
    {
      subreddit_id: subredditIds[2],
      user_id: userId,
      title: "ES6+ features every developer should know",
      content: "What are the most important ES6+ features that every JavaScript developer should be familiar with?",
    },
    {
      subreddit_id: subredditIds[3],
      user_id: userId,
      title: "React hooks best practices",
      content: "What are some best practices when using React hooks? Any common pitfalls to avoid?",
    },
    {
      subreddit_id: subredditIds[3],
      user_id: userId,
      title: "When to use useState vs useReducer",
      content: "I'm trying to understand when to use useState versus useReducer for state management in React. What are the guidelines?",
    },
    {
      subreddit_id: subredditIds[4],
      user_id: userId,
      title: "Latest AI developments in 2025",
      content: "What are the most exciting AI developments happening this year? Share your thoughts and findings!",
    },
    {
      subreddit_id: subredditIds[4],
      user_id: userId,
      title: "The future of web browsers",
      content: "With all the new web standards and browser features, where do you see browsers heading in the next few years?",
    },
    {
      subreddit_id: subredditIds[0],
      user_id: userId,
      title: "How to debug effectively",
      content: "What are your go-to debugging strategies? Share your tips and tricks for finding and fixing bugs faster.",
    },
    {
      subreddit_id: subredditIds[1],
      user_id: userId,
      title: "Building responsive designs",
      content: "What's your approach to building responsive web designs? Mobile-first or desktop-first?",
    },
    {
      subreddit_id: subredditIds[2],
      user_id: userId,
      title: "Async/await vs Promises",
      content: "When should I use async/await versus traditional Promises? Are there performance differences?",
    },
    {
      subreddit_id: subredditIds[3],
      user_id: userId,
      title: "React performance optimization tips",
      content: "What are your favorite techniques for optimizing React application performance?",
    },
    {
      subreddit_id: subredditIds[4],
      user_id: userId,
      title: "Open source contributions",
      content: "How do you find open source projects to contribute to? Any recommendations for beginners?",
    },
  ];

  const insertPost = db.prepare(
    "INSERT INTO posts (subreddit_id, user_id, title, content) VALUES (?, ?, ?, ?)"
  );

  const insertMany = db.transaction((postsList) => {
    for (const post of postsList) {
      insertPost.run(post.subreddit_id, post.user_id, post.title, post.content);
    }
  });

  insertMany(posts);
  console.log("Database seeded with sample subreddits and posts");
}
