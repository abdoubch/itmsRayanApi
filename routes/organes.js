const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all organes (optional: filter by machine_id)
router.get('/', async (req, res) => {
  try {
    const { machine_id } = req.query;
    let query = 'SELECT o.*, m.name as machine_name FROM organes o JOIN machines m ON o.machine_id = m.id';
    const params = [];
    if (machine_id) {
      query += ' WHERE o.machine_id = ?';
      params.push(machine_id);
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET organe by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT o.*, m.name as machine_name FROM organes o JOIN machines m ON o.machine_id = m.id WHERE o.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Organe not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create organe
router.post('/', async (req, res) => {
  try {
    const { name, machine_id, description } = req.body;
    const [result] = await db.query(
      'INSERT INTO organes (name, machine_id, description) VALUES (?, ?, ?)',
      [name, machine_id, description]
    );
    res.status(201).json({ id: result.insertId, name, machine_id, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update organe
router.put('/:id', async (req, res) => {
  try {
    const { name, machine_id, description } = req.body;
    const updates = [];
    const values = [];
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (machine_id !== undefined) { updates.push('machine_id = ?'); values.push(machine_id); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);
    await db.query(`UPDATE organes SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Organe updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE organe
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM organes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Organe not found' });
    res.json({ message: 'Organe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
