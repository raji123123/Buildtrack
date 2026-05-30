const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all sites
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sites WHERE is_active = true');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single site
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sites WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Site not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create site
router.post('/', async (req, res) => {
  try {
    const { name, city, address, site_type, manager_name, phone } = req.body;
    if (!name || !city) {
      return res.status(400).json({ success: false, error: 'Name and city are required' });
    }
    const result = await pool.query(`
      INSERT INTO sites (name, city, address, site_type, manager_name, phone)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `, [name, city, address, site_type || 'site', manager_name, phone]);
    res.json({ success: true, message: 'Site added!', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update site
router.put('/:id', async (req, res) => {
  try {
    const { name, city, address, site_type, manager_name, phone } = req.body;
    await pool.query(`
      UPDATE sites 
      SET name=$1, city=$2, address=$3, site_type=$4, manager_name=$5, phone=$6
      WHERE id=$7
    `, [name, city, address, site_type, manager_name, phone, req.params.id]);
    res.json({ success: true, message: 'Site updated!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE site
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('UPDATE sites SET is_active = false WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Site deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;