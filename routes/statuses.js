const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all statuses
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM statuses');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET status by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM statuses WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Status not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create status
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await db.query('INSERT INTO statuses (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update status
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const [result] = await db.query('UPDATE statuses SET name = ? WHERE id = ?', [name, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Status not found' });
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE status
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM statuses WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Status not found' });
    res.json({ message: 'Status deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
