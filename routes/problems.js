const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all problems
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM problems');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET problem by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM problems WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Problem not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create problem
router.post('/', async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const [result] = await db.query(
      'INSERT INTO problems (title, description, type) VALUES (?, ?, ?)',
      [title, description, type || null]
    );
    res.status(201).json({ id: result.insertId, title, description, type: type || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update problem
router.put('/:id', async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const updates = [];
    const values = [];
    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (type !== undefined) { updates.push('type = ?'); values.push(type); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);
    await db.query(`UPDATE problems SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Problem updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE problem
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM problems WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Problem not found' });
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
