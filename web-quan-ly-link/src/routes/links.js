const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

const LINK_JOIN = `
  SELECT l.*, c.name AS category_name, c.color AS category_color, c.icon AS category_icon
  FROM links l
  LEFT JOIN categories c ON c.id = l.category_id
`;

// GET /api/links?category_id=&search=
router.get('/', async (req, res) => {
  try {
    const { category_id, search } = req.query;
    let sql = LINK_JOIN + ' WHERE 1=1';
    const params = [];

    if (category_id) { sql += ' AND l.category_id = ?'; params.push(category_id); }
    if (search)      { sql += ' AND (l.name LIKE ? OR l.url LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    sql += ' ORDER BY l.created_at DESC';
    const rows = await all(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/links/:id
router.get('/:id', async (req, res) => {
  try {
    const row = await get(LINK_JOIN + ' WHERE l.id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ success: false, message: 'Không tìm thấy link' });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/links
router.post('/', async (req, res) => {
  try {
    const { name, url, category_id } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Tên link không được rỗng' });
    if (!url?.trim())  return res.status(400).json({ success: false, message: 'URL không được rỗng' });
    try { new URL(url.trim()); } catch { return res.status(400).json({ success: false, message: 'URL không hợp lệ' }); }

    const result = await run(
      `INSERT INTO links (name, url, category_id) VALUES (?, ?, ?)`,
      [name.trim(), url.trim(), category_id ?? null]
    );
    const created = await get(LINK_JOIN + ' WHERE l.id = ?', [result.lastID]);
    res.status(201).json({ success: true, data: created });
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

    const { name, url, category_id } = req.body;
    if (url) { try { new URL(url.trim()); } catch { return res.status(400).json({ success: false, message: 'URL không hợp lệ' }); } }

    const newName = name !== undefined ? name.trim() : existing.name;
    const newUrl = url !== undefined ? url.trim() : existing.url;
    const newCategoryId = category_id !== undefined ? category_id : existing.category_id;

    await run(
      `UPDATE links SET name = ?, url = ?, category_id = ? WHERE id = ?`,
      [newName, newUrl, newCategoryId, id]
    );
    const updated = await get(LINK_JOIN + ' WHERE l.id = ?', [id]);
    res.json({ success: true, data: updated });
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
