const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all sites
router.get('/', (req, res) => {
  try {
    const sites = db.prepare('SELECT * FROM sites WHERE is_active = 1').all();
    res.json({ success: true, data: sites });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single site
router.get('/:id', (req, res) => {
  try {
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(req.params.id);
    if (!site) return res.status(404).json({ success: false, error: 'Site not found' });
    res.json({ success: true, data: site });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create site
router.post('/', (req, res) => {
  try {
    const { name, city, address, site_type, manager_name, phone } = req.body;
    if (!name || !city) {
      return res.status(400).json({ success: false, error: 'Name and city are required' });
    }
    const result = db.prepare(`
      INSERT INTO sites (name, city, address, site_type, manager_name, phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, city, address, site_type || 'site', manager_name, phone);
    res.json({ success: true, message: 'Site added!', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update site
router.put('/:id', (req, res) => {
  try {
    const { name, city, address, site_type, manager_name, phone } = req.body;
    db.prepare(`
      UPDATE sites 
      SET name=?, city=?, address=?, site_type=?, manager_name=?, phone=?
      WHERE id=?
    `).run(name, city, address, site_type, manager_name, phone, req.params.id);
    res.json({ success: true, message: 'Site updated!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE site
router.delete('/:id', (req, res) => {
  try {
    db.prepare('UPDATE sites SET is_active = 0 WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Site deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;