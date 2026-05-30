const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all materials
router.get('/', (req, res) => {
  try {
    const materials = db.prepare(`
      SELECT m.*, c.name as category_name 
      FROM materials m
      LEFT JOIN categories c ON m.category_id = c.id
    `).all();
    res.json({ success: true, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single material
router.get('/:id', (req, res) => {
  try {
    const material = db.prepare('SELECT * FROM materials WHERE id = ?').get(req.params.id);
    if (!material) return res.status(404).json({ success: false, error: 'Material not found' });
    res.json({ success: true, data: material });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create material
router.post('/', (req, res) => {
  try {
    const { name, category_id, sku, unit, min_stock, unit_price, description } = req.body;
    if (!name || !sku || !unit) {
      return res.status(400).json({ success: false, error: 'Name, SKU and unit are required' });
    }
    const result = db.prepare(`
      INSERT INTO materials (name, category_id, sku, unit, min_stock, unit_price, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, category_id, sku, unit, min_stock || 0, unit_price || 0, description);
    res.json({ success: true, message: 'Material added!', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update material
router.put('/:id', (req, res) => {
  try {
    const { name, category_id, sku, unit, min_stock, unit_price, description } = req.body;
    db.prepare(`
      UPDATE materials 
      SET name=?, category_id=?, sku=?, unit=?, min_stock=?, unit_price=?, description=?
      WHERE id=?
    `).run(name, category_id, sku, unit, min_stock, unit_price, description, req.params.id);
    res.json({ success: true, message: 'Material updated!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE material
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM materials WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Material deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;