const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all domaines
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM domaine');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET domaine by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM domaine WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Domaine not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create domaine
router.post('/', async (req, res) => {
  try {
    const { nom } = req.body;
    const [result] = await db.query('INSERT INTO domaine (nom) VALUES (?)', [nom]);
    res.status(201).json({ id: result.insertId, nom });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update domaine
router.put('/:id', async (req, res) => {
  try {
    const { nom } = req.body;
    if (nom === undefined) return res.status(400).json({ error: 'No fields to update' });

    const [result] = await db.query('UPDATE domaine SET nom = ? WHERE id = ?', [nom, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Domaine not found' });

    res.json({ message: 'Domaine updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE domaine
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM domaine WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Domaine not found' });
    res.json({ message: 'Domaine deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
