const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all materials
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, c.name as category_name 
      FROM materials m
      LEFT JOIN categories c ON m.category_id = c.id
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single material
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materials WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Material not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create material
router.post('/', async (req, res) => {
  try {
    const { name, category_id, sku, unit, min_stock, unit_price, description } = req.body;
    if (!name || !sku || !unit) {
      return res.status(400).json({ success: false, error: 'Name, SKU and unit are required' });
    }
    const result = await pool.query(`
      INSERT INTO materials (name, category_id, sku, unit, min_stock, unit_price, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `, [name, category_id, sku, unit, min_stock || 0, unit_price || 0, description]);
    res.json({ success: true, message: 'Material added!', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update material
router.put('/:id', async (req, res) => {
  try {
    const { name, category_id, sku, unit, min_stock, unit_price, description } = req.body;
    await pool.query(`
      UPDATE materials 
      SET name=$1, category_id=$2, sku=$3, unit=$4, min_stock=$5, unit_price=$6, description=$7
      WHERE id=$8
    `, [name, category_id, sku, unit, min_stock, unit_price, description, req.params.id]);
    res.json({ success: true, message: 'Material updated!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE material
// DELETE material
router.delete('/:id', async (req, res) => {
  try {
    // First delete related records
    await pool.query('DELETE FROM site_stock WHERE material_id = $1', [req.params.id]);
    await pool.query('DELETE FROM transactions WHERE material_id = $1', [req.params.id]);
    await pool.query('DELETE FROM transfers WHERE material_id = $1', [req.params.id]);
    // Then delete material
    await pool.query('DELETE FROM materials WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Material deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;