const path = require('path');
const fs = require('fs');

// Auto-load .env if available
[path.join(__dirname, '..', '.env'), path.join(__dirname, '..', '..', '.env')].forEach((envFile) => {
  if (fs.existsSync(envFile)) {
    const lines = fs.readFileSync(envFile, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
});

const isTurso = Boolean(process.env.TURSO_DATABASE_URL);
let run, get, all, db;

if (isTurso) {
  const { createClient } = require('@libsql/client');
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  run = async (sql, params = []) => {
    const rs = await client.execute({ sql, args: params });
    return {
      lastID: Number(rs.lastInsertRowid ?? 0),
      changes: rs.rowsAffected,
    };
  };

  get = async (sql, params = []) => {
    const rs = await client.execute({ sql, args: params });
    return rs.rows[0] || null;
  };

  all = async (sql, params = []) => {
    const rs = await client.execute({ sql, args: params });
    return rs.rows;
  };

  db = client;
} else {
  const sqlite3 = require('sqlite3').verbose();
  const DATA_DIR = process.env.DATABASE_DIR || path.join(__dirname, '..', 'data');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'links.db');
  const localDb = new sqlite3.Database(DB_PATH);

  run = (sql, params = []) =>
    new Promise((resolve, reject) =>
      localDb.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      })
    );

  get = (sql, params = []) =>
    new Promise((resolve, reject) =>
      localDb.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      })
    );

  all = (sql, params = []) =>
    new Promise((resolve, reject) =>
      localDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      })
    );

  db = localDb;
}

// Init schema
const init = async () => {
  await run(`PRAGMA foreign_keys = ON`);

  await run(`
    CREATE TABLE IF NOT EXISTS categories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      color      TEXT    NOT NULL DEFAULT '#6366f1',
      icon       TEXT    NOT NULL DEFAULT 'folder',
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS links (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      name          TEXT    NOT NULL,
      url           TEXT    NOT NULL,
      frontend_host TEXT,
      backend_host  TEXT,
      database_host TEXT,
      tech_stack    TEXT,
      resource_type TEXT    DEFAULT 'project',
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Auto-migration for existing SQLite database
  const columns = await all(`PRAGMA table_info(links)`);
  const colNames = columns.map((c) => c.name);
  if (!colNames.includes('frontend_host')) {
    await run(`ALTER TABLE links ADD COLUMN frontend_host TEXT`);
  }
  if (!colNames.includes('backend_host')) {
    await run(`ALTER TABLE links ADD COLUMN backend_host TEXT`);
  }
  if (!colNames.includes('database_host')) {
    await run(`ALTER TABLE links ADD COLUMN database_host TEXT`);
  }
  if (!colNames.includes('tech_stack')) {
    await run(`ALTER TABLE links ADD COLUMN tech_stack TEXT`);
  }
  if (!colNames.includes('resource_type')) {
    await run(`ALTER TABLE links ADD COLUMN resource_type TEXT DEFAULT 'project'`);
  }

  // Seed category mặc định
  const count = await get('SELECT COUNT(*) as c FROM categories');
  if (count.c === 0) {
    await run(`INSERT INTO categories (name, color, icon) VALUES ('Chung', '#6366f1', 'globe')`);
  }
};

module.exports = { db, run, get, all, init };
