import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../../data");
const dbPath = path.join(dataDir, "app.db");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS titles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('movie', 'show')),
    description TEXT,
    genre TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    duration_minutes INTEGER,
    seasons INTEGER,
    thumbnail_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title_id INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE,
    UNIQUE(user_id, title_id)
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    rated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE,
    UNIQUE(user_id, title_id)
  );

  CREATE TABLE IF NOT EXISTS continue_watching (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    title_id INTEGER NOT NULL,
    progress_percent INTEGER NOT NULL DEFAULT 0 CHECK(progress_percent >= 0 AND progress_percent <= 100),
    last_watched DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE,
    UNIQUE(session_id, title_id)
  );
`);

// Seed some titles if none exist
const titleCount = db.prepare("SELECT COUNT(*) as count FROM titles").get() as { count: number };
if (titleCount.count === 0) {
  const insertTitle = db.prepare(`
    INSERT INTO titles (title, type, description, genre, release_year, duration_minutes, seasons, thumbnail_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedTitles = [
    // Using Lorem Picsum for better placeholder images with consistent IDs for each title
    ["Stranger Things", "show", "A group of kids uncover supernatural mysteries in their small town.", "Sci-Fi", 2016, null, 4, "https://picsum.photos/seed/stranger-things/300/450"],
    ["The Witcher", "show", "A mutated monster hunter struggles to find his place in a world.", "Fantasy", 2019, null, 3, "https://picsum.photos/seed/the-witcher/300/450"],
    ["Breaking Bad", "show", "A chemistry teacher turns to cooking meth to secure his family's future.", "Drama", 2008, null, 5, "https://picsum.photos/seed/breaking-bad/300/450"],
    ["The Crown", "show", "The reign of Queen Elizabeth II from her wedding to the present day.", "Drama", 2016, null, 6, "https://picsum.photos/seed/the-crown/300/450"],
    ["Squid Game", "show", "Contestants play deadly children's games for a chance at a huge cash prize.", "Thriller", 2021, null, 2, "https://picsum.photos/seed/squid-game/300/450"],
    ["Inception", "movie", "A thief who enters people's dreams takes on one last job.", "Sci-Fi", 2010, 148, null, "https://picsum.photos/seed/inception/300/450"],
    ["The Shawshank Redemption", "movie", "Two imprisoned men bond over several years, finding solace and redemption.", "Drama", 1994, 142, null, "https://picsum.photos/seed/shawshank/300/450"],
    ["Pulp Fiction", "movie", "Various interconnected stories of criminals in Los Angeles.", "Crime", 1994, 154, null, "https://picsum.photos/seed/pulp-fiction/300/450"],
    ["The Dark Knight", "movie", "Batman faces the Joker, a criminal mastermind who wants chaos.", "Action", 2008, 152, null, "https://picsum.photos/seed/dark-knight/300/450"],
    ["Interstellar", "movie", "A team of explorers travel through a wormhole in search of a new home.", "Sci-Fi", 2014, 169, null, "https://picsum.photos/seed/interstellar/300/450"],
    ["Parasite", "movie", "A poor family schemes to become employed by a wealthy family.", "Thriller", 2019, 132, null, "https://picsum.photos/seed/parasite/300/450"],
    ["Wednesday", "show", "Wednesday Addams attends a new school and solves a mystery.", "Comedy", 2022, null, 1, "https://picsum.photos/seed/wednesday/300/450"],
  ];

  for (const title of seedTitles) {
    insertTitle.run(...title);
  }
}

export default db;
