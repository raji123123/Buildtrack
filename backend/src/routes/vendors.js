const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all vendors
router.get('/', (req, res) => {
  try {
    const vendors = db.prepare(`
      SELECT v.*, c.name as category_name 
      FROM vendors v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.is_active = 1
    `).all();
    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create vendor
router.post('/', (req, res) => {
  try {
    const { name, category_id, contact_person, phone, email, city, rating } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    const result = db.prepare(`
      INSERT INTO vendors (name, category_id, contact_person, phone, email, city, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, category_id, contact_person, phone, email, city, rating || 3);
    res.json({ success: true, message: 'Vendor added!', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update vendor
router.put('/:id', (req, res) => {
  try {
    const { name, category_id, contact_person, phone, email, city, rating } = req.body;
    db.prepare(`
      UPDATE vendors 
      SET name=?, category_id=?, contact_person=?, phone=?, email=?, city=?, rating=?
      WHERE id=?
    `).run(name, category_id, contact_person, phone, email, city, rating, req.params.id);
    res.json({ success: true, message: 'Vendor updated!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE vendor
router.delete('/:id', (req, res) => {
  try {
    db.prepare('UPDATE vendors SET is_active = 0 WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Vendor deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;