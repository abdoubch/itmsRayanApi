const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all priorities
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM priorities');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET priority by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM priorities WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Priority not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create priority
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await db.query('INSERT INTO priorities (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update priority
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const [result] = await db.query('UPDATE priorities SET name = ? WHERE id = ?', [name, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Priority not found' });
    res.json({ message: 'Priority updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE priority
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM priorities WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Priority not found' });
    res.json({ message: 'Priority deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
