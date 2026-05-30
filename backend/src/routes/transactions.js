const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all transactions
router.get('/', (req, res) => {
  try {
    const transactions = db.prepare(`
      SELECT t.*, 
        m.name as material_name, 
        m.unit as material_unit,
        s.name as site_name,
        v.name as vendor_name
      FROM transactions t
      LEFT JOIN materials m ON t.material_id = m.id
      LEFT JOIN sites s ON t.site_id = s.id
      LEFT JOIN vendors v ON t.vendor_id = v.id
      ORDER BY t.created_at DESC
    `).all();
    res.json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create transaction
router.post('/', (req, res) => {
  try {
    const { 
      transaction_type, material_id, site_id, 
      vendor_id, quantity, unit_price, note, created_by 
    } = req.body;

    if (!transaction_type || !material_id || !quantity) {
      return res.status(400).json({ 
        success: false, 
        error: 'Transaction type, material and quantity are required' 
      });
    }

    const total_amount = (quantity || 0) * (unit_price || 0);

    // Save transaction
    const result = db.prepare(`
      INSERT INTO transactions 
      (transaction_type, material_id, site_id, vendor_id, quantity, unit_price, total_amount, note, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(transaction_type, material_id, site_id, vendor_id, quantity, unit_price || 0, total_amount, note, created_by);

    // Update stock
    const existing = db.prepare(
      'SELECT * FROM site_stock WHERE site_id = ? AND material_id = ?'
    ).get(site_id, material_id);

    if (existing) {
      if (transaction_type === 'inward' || transaction_type === 'purchase') {
        db.prepare(
          'UPDATE site_stock SET quantity = quantity + ? WHERE site_id = ? AND material_id = ?'
        ).run(quantity, site_id, material_id);
      } else if (transaction_type === 'outward') {
        db.prepare(
          'UPDATE site_stock SET quantity = quantity - ? WHERE site_id = ? AND material_id = ?'
        ).run(quantity, site_id, material_id);
      } else if (transaction_type === 'damaged') {
        db.prepare(
          'UPDATE site_stock SET quantity = quantity - ?, damaged_qty = damaged_qty + ? WHERE site_id = ? AND material_id = ?'
        ).run(quantity, quantity, site_id, material_id);
      }
    } else {
      db.prepare(
        'INSERT INTO site_stock (site_id, material_id, quantity) VALUES (?, ?, ?)'
      ).run(site_id, material_id, quantity);
    }

    res.json({ success: true, message: 'Transaction saved!', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET transactions by site
router.get('/site/:siteId', (req, res) => {
  try {
    const transactions = db.prepare(`
      SELECT t.*, 
        m.name as material_name,
        m.unit as material_unit
      FROM transactions t
      LEFT JOIN materials m ON t.material_id = m.id
      WHERE t.site_id = ?
      ORDER BY t.created_at DESC
    `).all(req.params.siteId);
    res.json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;