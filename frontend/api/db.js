import { createClient } from '@libsql/client';

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || 'libsql://web-quan-ly-link-nhutpham19.aws-ap-northeast-1.turso.io';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || '';

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export const run = async (sql, params = []) => {
  const rs = await client.execute({ sql, args: params });
  return {
    lastID: Number(rs.lastInsertRowid ?? 0),
    changes: rs.rowsAffected,
  };
};

export const get = async (sql, params = []) => {
  const rs = await client.execute({ sql, args: params });
  return rs.rows[0] || null;
};

export const all = async (sql, params = []) => {
  const rs = await client.execute({ sql, args: params });
  return rs.rows;
};

export const db = client;
