import Database from '@tauri-apps/plugin-sql';

const DB_PATH = 'sqlite:snippets.db';

export class DbCore {
  private static db: Database | null = null;
  private static dbPromise: Promise<Database> | null = null;
  private static _lock = Promise.resolve();

  static async getDb(): Promise<Database> {
    if (this.db) return this.db;
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = Database.load(DB_PATH).then(async (db) => {
      await db.execute('PRAGMA journal_mode = WAL');
      await db.execute('PRAGMA synchronous = NORMAL');
      await db.execute('PRAGMA foreign_keys = ON');

      await db.execute(`
        CREATE TABLE IF NOT EXISTS snippets (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          is_favorite INTEGER DEFAULT 0,
          is_template INTEGER DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS files (
          id TEXT PRIMARY KEY,
          snippet_id TEXT NOT NULL,
          filename TEXT NOT NULL,
          code TEXT NOT NULL,
          language TEXT NOT NULL,
          FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS snippet_tags (
          snippet_id TEXT NOT NULL,
          tag_id INTEGER NOT NULL,
          PRIMARY KEY (snippet_id, tag_id),
          FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS folders (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT DEFAULT '#6366f1',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS snippet_folders (
          snippet_id TEXT NOT NULL,
          folder_id TEXT NOT NULL,
          PRIMARY KEY (snippet_id, folder_id),
          FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
          FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS snippet_history (
          id TEXT PRIMARY KEY,
          snippet_id TEXT NOT NULL,
          data TEXT NOT NULL,
          created_at TEXT NOT NULL,
          FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
        )
      `);

       try {
        await db.execute(`
          CREATE VIRTUAL TABLE IF NOT EXISTS snippets_fts USING fts5(
            snippet_id UNINDEXED,
            title,
            description,
            content,
            tokenize='porter unicode61'
          )
        `);
      } catch (e) {
        console.warn('DB: FTS5 not supported', e);
      }

      return db;
    });

    this.db = await this.dbPromise;
    return this.db;
  }

  static async withLock<T>(operation: (db: Database) => Promise<T>): Promise<T> {
    const oldLock = this._lock;
    let release: () => void;
    this._lock = new Promise((resolve) => {
      release = resolve;
    });

    try {
      await oldLock;
      const db = await this.getDb();
      return await operation(db);
    } catch (error) {
      console.error('Database Operation Error:', error);
      throw error;
    } finally {
      release!();
    }
  }

  static async transaction<T>(operation: (db: Database) => Promise<T>): Promise<T> {
    return this.withLock(async (db) => {
      await db.execute('BEGIN IMMEDIATE');
      try {
        const result = await operation(db);
        await db.execute('COMMIT');
        return result;
      } catch (error) {
        try {
          await db.execute('ROLLBACK');
        } catch (e) { /* ignore */ }
        throw error;
      }
    });
  }
}
