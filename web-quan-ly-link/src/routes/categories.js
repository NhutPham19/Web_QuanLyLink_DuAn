const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const rows = await all(`
      SELECT c.*, COUNT(l.id) AS link_count
      FROM categories c
      LEFT JOIN links l ON l.category_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name, color = '#6366f1', icon = 'folder' } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'Tên category không được rỗng' });
    }
    const result = await run(
      `INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)`,
      [name.trim(), color, icon]
    );
    const created = await get('SELECT * FROM categories WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get('SELECT * FROM categories WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy category' });

    const { name, color, icon } = req.body;
    await run(
      `UPDATE categories SET
        name  = COALESCE(?, name),
        color = COALESCE(?, color),
        icon  = COALESCE(?, icon)
       WHERE id = ?`,
      [name?.trim() ?? null, color ?? null, icon ?? null, id]
    );
    const updated = await get('SELECT * FROM categories WHERE id = ?', [id]);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await get('SELECT * FROM categories WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy category' });
    await run('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa category' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
