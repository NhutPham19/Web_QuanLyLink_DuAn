const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

const LINK_JOIN = `
  SELECT l.*, c.name AS category_name, c.color AS category_color, c.icon AS category_icon
  FROM links l
  LEFT JOIN categories c ON c.id = l.category_id
`;

// GET /api/links?category_id=&search=&resource_type=
router.get('/', async (req, res) => {
  try {
    const { category_id, search, resource_type, frontend_host, backend_host, database_host } = req.query;
    let sql = LINK_JOIN + ' WHERE 1=1';
    const params = [];

    if (category_id) { sql += ' AND l.category_id = ?'; params.push(category_id); }
    if (resource_type) { sql += ' AND l.resource_type = ?'; params.push(resource_type); }
    if (frontend_host) { sql += ' AND l.frontend_host = ?'; params.push(frontend_host); }
    if (backend_host)  { sql += ' AND l.backend_host = ?'; params.push(backend_host); }
    if (database_host) { sql += ' AND l.database_host = ?'; params.push(database_host); }
    if (search) {
      sql += ' AND (l.name LIKE ? OR l.url LIKE ? OR l.frontend_host LIKE ? OR l.backend_host LIKE ? OR l.database_host LIKE ? OR l.tech_stack LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY l.created_at DESC';
    const rows = await all(sql, params);

    // Parse tech_stack JSON for ease of use
    const formatted = rows.map((r) => {
      let parsedTech = [];
      if (r.tech_stack) {
        try {
          parsedTech = typeof r.tech_stack === 'string' ? JSON.parse(r.tech_stack) : r.tech_stack;
        } catch {
          parsedTech = r.tech_stack ? [r.tech_stack] : [];
        }
      }
      return { ...r, tech_stack: parsedTech };
    });

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/links/:id
router.get('/:id', async (req, res) => {
  try {
    const row = await get(LINK_JOIN + ' WHERE l.id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ success: false, message: 'Không tìm thấy link' });

    let parsedTech = [];
    if (row.tech_stack) {
      try {
        parsedTech = typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : row.tech_stack;
      } catch {
        parsedTech = row.tech_stack ? [row.tech_stack] : [];
      }
    }

    res.json({ success: true, data: { ...row, tech_stack: parsedTech } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/links
router.post('/', async (req, res) => {
  try {
    const { name, url, category_id, frontend_host, backend_host, database_host, tech_stack, resource_type = 'project' } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Tên link không được rỗng' });
    if (!url?.trim())  return res.status(400).json({ success: false, message: 'URL không được rỗng' });
    try { new URL(url.trim()); } catch { return res.status(400).json({ success: false, message: 'URL không hợp lệ' }); }

    const techStackJson = Array.isArray(tech_stack)
      ? JSON.stringify(tech_stack)
      : (typeof tech_stack === 'string' && tech_stack ? JSON.stringify([tech_stack]) : null);

    const result = await run(
      `INSERT INTO links (name, url, category_id, frontend_host, backend_host, database_host, tech_stack, resource_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        url.trim(),
        category_id ?? null,
        frontend_host?.trim() || null,
        backend_host?.trim() || null,
        database_host?.trim() || null,
        techStackJson,
        resource_type?.trim() || 'project',
      ]
    );
    const created = await get(LINK_JOIN + ' WHERE l.id = ?', [result.lastID]);
    let parsedTech = [];
    if (created.tech_stack) {
      try { parsedTech = JSON.parse(created.tech_stack); } catch { parsedTech = []; }
    }
    res.status(201).json({ success: true, data: { ...created, tech_stack: parsedTech } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/links/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get('SELECT * FROM links WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy link' });

    const { name, url, category_id, frontend_host, backend_host, database_host, tech_stack, resource_type } = req.body;
    if (url) { try { new URL(url.trim()); } catch { return res.status(400).json({ success: false, message: 'URL không hợp lệ' }); } }

    const newName = name !== undefined ? name.trim() : existing.name;
    const newUrl = url !== undefined ? url.trim() : existing.url;
    const newCategoryId = category_id !== undefined ? category_id : existing.category_id;
    const newFrontendHost = frontend_host !== undefined ? (frontend_host?.trim() || null) : existing.frontend_host;
    const newBackendHost = backend_host !== undefined ? (backend_host?.trim() || null) : existing.backend_host;
    const newDatabaseHost = database_host !== undefined ? (database_host?.trim() || null) : existing.database_host;
    const newResourceType = resource_type !== undefined ? (resource_type?.trim() || 'project') : existing.resource_type;

    let newTechStack = existing.tech_stack;
    if (tech_stack !== undefined) {
      newTechStack = Array.isArray(tech_stack)
        ? JSON.stringify(tech_stack)
        : (typeof tech_stack === 'string' && tech_stack ? JSON.stringify([tech_stack]) : null);
    }

    await run(
      `UPDATE links SET name = ?, url = ?, category_id = ?, frontend_host = ?, backend_host = ?, database_host = ?, tech_stack = ?, resource_type = ? WHERE id = ?`,
      [newName, newUrl, newCategoryId, newFrontendHost, newBackendHost, newDatabaseHost, newTechStack, newResourceType, id]
    );
    const updated = await get(LINK_JOIN + ' WHERE l.id = ?', [id]);
    let parsedTech = [];
    if (updated.tech_stack) {
      try { parsedTech = JSON.parse(updated.tech_stack); } catch { parsedTech = []; }
    }
    res.json({ success: true, data: { ...updated, tech_stack: parsedTech } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/links/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get('SELECT * FROM links WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy link' });
    await run('DELETE FROM links WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa link' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
