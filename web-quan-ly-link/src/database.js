const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DATA_DIR = process.env.DATABASE_DIR || path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'links.db');
const db = new sqlite3.Database(DB_PATH);

// Promisify helpers
const run = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this); // this.lastID, this.changes
    })
  );

const get = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    })
  );

const all = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    })
  );

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
