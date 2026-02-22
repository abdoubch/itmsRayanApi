const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all pieces (optional: filter by organe_id)
router.get('/', async (req, res) => {
  try {
    const { organe_id } = req.query;
    let query = 'SELECT p.*, o.name as organe_name FROM pieces p JOIN organes o ON p.organe_id = o.id';
    const params = [];
    if (organe_id) {
      query += ' WHERE p.organe_id = ?';
      params.push(organe_id);
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET piece by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT p.*, o.name as organe_name FROM pieces p JOIN organes o ON p.organe_id = o.id WHERE p.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Piece not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create piece
router.post('/', async (req, res) => {
  try {
    const { name, organe_id, reference, description } = req.body;
    const [result] = await db.query(
      'INSERT INTO pieces (name, organe_id, reference, description) VALUES (?, ?, ?, ?)',
      [name, organe_id, reference, description]
    );
    res.status(201).json({ id: result.insertId, name, organe_id, reference, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update piece
router.put('/:id', async (req, res) => {
  try {
    const { name, organe_id, reference, description } = req.body;
    const updates = [];
    const values = [];
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (organe_id !== undefined) { updates.push('organe_id = ?'); values.push(organe_id); }
    if (reference !== undefined) { updates.push('reference = ?'); values.push(reference); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);
    await db.query(`UPDATE pieces SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Piece updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE piece
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM pieces WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Piece not found' });
    res.json({ message: 'Piece deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
