const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
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
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create transaction
router.post('/', async (req, res) => {
  try {
    const { transaction_type, material_id, site_id, vendor_id, quantity, unit_price, note, created_by } = req.body;
    if (!transaction_type || !material_id || !quantity) {
      return res.status(400).json({ success: false, error: 'Transaction type, material and quantity are required' });
    }
    const total_amount = (quantity || 0) * (unit_price || 0);
    const result = await pool.query(`
      INSERT INTO transactions 
      (transaction_type, material_id, site_id, vendor_id, quantity, unit_price, total_amount, note, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `, [transaction_type, material_id, site_id, vendor_id, quantity, unit_price || 0, total_amount, note, created_by]);

    // Update stock
    const existing = await pool.query(
      'SELECT * FROM site_stock WHERE site_id = $1 AND material_id = $2',
      [site_id, material_id]
    );

    if (existing.rows.length > 0) {
      if (transaction_type === 'inward' || transaction_type === 'purchase') {
        await pool.query(
          'UPDATE site_stock SET quantity = quantity + $1 WHERE site_id = $2 AND material_id = $3',
          [quantity, site_id, material_id]
        );
      } else if (transaction_type === 'outward') {
        await pool.query(
          'UPDATE site_stock SET quantity = quantity - $1 WHERE site_id = $2 AND material_id = $3',
          [quantity, site_id, material_id]
        );
      } else if (transaction_type === 'damaged') {
        await pool.query(
          'UPDATE site_stock SET quantity = quantity - $1, damaged_qty = damaged_qty + $1 WHERE site_id = $2 AND material_id = $3',
          [quantity, site_id, material_id]
        );
      }
    } else {
      await pool.query(
        'INSERT INTO site_stock (site_id, material_id, quantity) VALUES ($1, $2, $3)',
        [site_id, material_id, quantity]
      );
    }

    res.json({ success: true, message: 'Transaction saved!', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET transactions by site
router.get('/site/:siteId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, 
        m.name as material_name,
        m.unit as material_unit
      FROM transactions t
      LEFT JOIN materials m ON t.material_id = m.id
      WHERE t.site_id = $1
      ORDER BY t.created_at DESC
    `, [req.params.siteId]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;