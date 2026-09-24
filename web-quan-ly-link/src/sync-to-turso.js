const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@libsql/client');

// Auto-load .env
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

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL) {
  console.error('❌ Thiếu biến TURSO_DATABASE_URL trong .env hoặc environment!');
  process.exit(1);
}

// Đường dẫn file SQLite cục bộ
const LOCAL_DB_PATH = process.env.DATABASE_PATH || 
  (fs.existsSync(path.join(__dirname, '..', '..', 'data', 'links.db'))
    ? path.join(__dirname, '..', '..', 'data', 'links.db')
    : path.join(__dirname, '..', 'data', 'links.db'));

console.log(`🔍 Nguồn dữ liệu SQLite cục bộ: ${LOCAL_DB_PATH}`);
console.log(`🌐 Đích Turso Cloud: ${TURSO_DATABASE_URL}`);

const localDb = new sqlite3.Database(LOCAL_DB_PATH);
const tursoClient = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

const localAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    localDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

async function sync() {
  try {
    // 1. Khởi tạo bảng trên Turso nếu chưa có
    console.log('⏳ Khởi tạo cấu trúc bảng trên Turso...');
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT    NOT NULL,
        color      TEXT    NOT NULL DEFAULT '#6366f1',
        icon       TEXT    NOT NULL DEFAULT 'folder',
        created_at TEXT    NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await tursoClient.execute(`
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

    // 2. Lấy dữ liệu từ SQLite cục bộ
    const categories = await localAll('SELECT * FROM categories');
    console.log(`📦 Tìm thấy ${categories.length} danh mục trong SQLite cục bộ.`);

    const links = await localAll('SELECT * FROM links');
    console.log(`📦 Tìm thấy ${links.length} liên kết trong SQLite cục bộ.`);

    // 3. Đưa danh mục sang Turso
    for (const cat of categories) {
      const existing = await tursoClient.execute({
        sql: 'SELECT id FROM categories WHERE id = ?',
        args: [cat.id],
      });
      if (existing.rows.length === 0) {
        await tursoClient.execute({
          sql: 'INSERT INTO categories (id, name, color, icon, created_at) VALUES (?, ?, ?, ?, ?)',
          args: [cat.id, cat.name, cat.color, cat.icon, cat.created_at || new Date().toISOString()],
        });
        console.log(`  + Đã thêm danh mục: ${cat.name} (ID: ${cat.id})`);
      }
    }

    // 4. Đưa liên kết sang Turso
    for (const lk of links) {
      const existing = await tursoClient.execute({
        sql: 'SELECT id FROM links WHERE id = ?',
        args: [lk.id],
      });
      if (existing.rows.length === 0) {
        await tursoClient.execute({
          sql: `INSERT INTO links (id, category_id, name, url, frontend_host, backend_host, database_host, tech_stack, resource_type, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            lk.id,
            lk.category_id,
            lk.name,
            lk.url,
            lk.frontend_host || null,
            lk.backend_host || null,
            lk.database_host || null,
            lk.tech_stack || null,
            lk.resource_type || 'project',
            lk.created_at || new Date().toISOString(),
          ],
        });
        console.log(`  + Đã thêm liên kết: ${lk.name} (URL: ${lk.url})`);
      }
    }

    console.log('✅ Hoàn tất đồng bộ dữ liệu sang Turso Cloud thành công!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi đồng bộ dữ liệu sang Turso:', err.message);
    process.exit(1);
  }
}

sync();
