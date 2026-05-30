const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all vendors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, c.name as category_name 
      FROM vendors v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.is_active = true
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create vendor
router.post('/', async (req, res) => {
  try {
    const { name, category_id, contact_person, phone, email, city, rating } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    const result = await pool.query(`
      INSERT INTO vendors (name, category_id, contact_person, phone, email, city, rating)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `, [name, category_id, contact_person, phone, email, city, rating || 3]);
    res.json({ success: true, message: 'Vendor added!', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update vendor
router.put('/:id', async (req, res) => {
  try {
    const { name, category_id, contact_person, phone, email, city, rating } = req.body;
    await pool.query(`
      UPDATE vendors 
      SET name=$1, category_id=$2, contact_person=$3, phone=$4, email=$5, city=$6, rating=$7
      WHERE id=$8
    `, [name, category_id, contact_person, phone, email, city, rating, req.params.id]);
    res.json({ success: true, message: 'Vendor updated!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE vendor
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('UPDATE vendors SET is_active = false WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Vendor deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;