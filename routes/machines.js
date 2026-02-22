const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all machines
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM machines');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET machine by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM machines WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Machine not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create machine
router.post('/', async (req, res) => {
  try {
    const { name, serial_number, location } = req.body;
    const [result] = await db.query(
      'INSERT INTO machines (name, serial_number, location) VALUES (?, ?, ?)',
      [name, serial_number, location]
    );
    res.status(201).json({ id: result.insertId, name, serial_number, location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update machine
router.put('/:id', async (req, res) => {
  try {
    const { name, serial_number, location } = req.body;
    const updates = [];
    const values = [];
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (serial_number !== undefined) { updates.push('serial_number = ?'); values.push(serial_number); }
    if (location !== undefined) { updates.push('location = ?'); values.push(location); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);
    await db.query(`UPDATE machines SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Machine updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE machine
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM machines WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Machine not found' });
    res.json({ message: 'Machine deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
