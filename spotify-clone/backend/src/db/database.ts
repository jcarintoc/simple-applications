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

  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration_seconds INTEGER NOT NULL DEFAULT 180,
    cover_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS playlist_songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    UNIQUE(playlist_id, song_id)
  );

  CREATE TABLE IF NOT EXISTS liked_songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    liked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    UNIQUE(user_id, song_id)
  );
`);

// Seed some songs if none exist
const songCount = db.prepare("SELECT COUNT(*) as count FROM songs").get() as { count: number };
if (songCount.count === 0) {
  const insertSong = db.prepare(`
    INSERT INTO songs (title, artist, album, duration_seconds, cover_url)
    VALUES (?, ?, ?, ?, ?)
  `);

  const seedSongs = [
    ["Bohemian Rhapsody", "Queen", "A Night at the Opera", 354, "https://placehold.co/300x300/1DB954/white?text=BR"],
    ["Hotel California", "Eagles", "Hotel California", 391, "https://placehold.co/300x300/1DB954/white?text=HC"],
    ["Stairway to Heaven", "Led Zeppelin", "Led Zeppelin IV", 482, "https://placehold.co/300x300/1DB954/white?text=SH"],
    ["Imagine", "John Lennon", "Imagine", 183, "https://placehold.co/300x300/1DB954/white?text=IM"],
    ["Billie Jean", "Michael Jackson", "Thriller", 294, "https://placehold.co/300x300/1DB954/white?text=BJ"],
    ["Sweet Child O Mine", "Guns N' Roses", "Appetite for Destruction", 356, "https://placehold.co/300x300/1DB954/white?text=SC"],
    ["Smells Like Teen Spirit", "Nirvana", "Nevermind", 301, "https://placehold.co/300x300/1DB954/white?text=TS"],
    ["Purple Rain", "Prince", "Purple Rain", 520, "https://placehold.co/300x300/1DB954/white?text=PR"],
    ["Like a Rolling Stone", "Bob Dylan", "Highway 61 Revisited", 369, "https://placehold.co/300x300/1DB954/white?text=RS"],
    ["What's Going On", "Marvin Gaye", "What's Going On", 233, "https://placehold.co/300x300/1DB954/white?text=WG"],
  ];

  for (const song of seedSongs) {
    insertSong.run(...song);
  }
}

export default db;
