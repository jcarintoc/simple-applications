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

  CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    is_archived INTEGER DEFAULT 0,
    archived_by_sender INTEGER DEFAULT 0,
    archived_by_recipient INTEGER DEFAULT 0,
    is_deleted INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Add new columns to existing table if they don't exist (for migration)
  -- SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we use a try-catch approach
  -- We'll handle this by checking schema or using a migration approach
  
  CREATE INDEX IF NOT EXISTS idx_emails_from_user_id ON emails(from_user_id);
  CREATE INDEX IF NOT EXISTS idx_emails_to_user_id ON emails(to_user_id);
  CREATE INDEX IF NOT EXISTS idx_emails_is_archived ON emails(is_archived);
  CREATE INDEX IF NOT EXISTS idx_emails_is_deleted ON emails(is_deleted);
`);

// Migrate existing schema: Add new archive columns if they don't exist
try {
  db.prepare("ALTER TABLE emails ADD COLUMN archived_by_sender INTEGER DEFAULT 0").run();
} catch (e) {
  // Column already exists, ignore
}

try {
  db.prepare("ALTER TABLE emails ADD COLUMN archived_by_recipient INTEGER DEFAULT 0").run();
} catch (e) {
  // Column already exists, ignore
}

export default db;
