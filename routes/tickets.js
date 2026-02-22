const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all tickets (optional filters: status_id, priority_id, machine_id, assigned_to, created_by)
router.get('/', async (req, res) => {
  try {
    const { status_id, priority_id, machine_id, assigned_to, created_by } = req.query;
    let query = `
      SELECT t.*, s.name as status_name, p.name as priority_name, m.name as machine_name,
        u1.name as created_by_name, u2.name as assigned_to_name
      FROM tickets t
      LEFT JOIN statuses s ON t.status_id = s.id
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN machines m ON t.machine_id = m.id
      LEFT JOIN users u1 ON t.created_by = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
    `;
    const params = [];
    const conditions = [];
    if (status_id) { conditions.push('t.status_id = ?'); params.push(status_id); }
    if (priority_id) { conditions.push('t.priority_id = ?'); params.push(priority_id); }
    if (machine_id) { conditions.push('t.machine_id = ?'); params.push(machine_id); }
    if (assigned_to) { conditions.push('t.assigned_to = ?'); params.push(assigned_to); }
    if (created_by) { conditions.push('t.created_by = ?'); params.push(created_by); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ticket by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, s.name as status_name, p.name as priority_name, pr.title as problem_title,
        m.name as machine_name, o.name as organe_name, pi.name as piece_name,
        u1.name as created_by_name, u2.name as assigned_to_name
      FROM tickets t
      LEFT JOIN statuses s ON t.status_id = s.id
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN problems pr ON t.problem_id = pr.id
      LEFT JOIN machines m ON t.machine_id = m.id
      LEFT JOIN organes o ON t.organe_id = o.id
      LEFT JOIN pieces pi ON t.piece_id = pi.id
      LEFT JOIN users u1 ON t.created_by = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      WHERE t.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create ticket
router.post('/', async (req, res) => {
  try {
    const {
      title, description, status_id, priority_id, problem_id,
      machine_id, organe_id, piece_id, created_by, assigned_to
    } = req.body;
    const [result] = await db.query(
      `INSERT INTO tickets (title, description, status_id, priority_id, problem_id, machine_id, organe_id, piece_id, created_by, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, status_id, priority_id, problem_id || null, machine_id, organe_id || null, piece_id || null, created_by || null, assigned_to || null]
    );
    res.status(201).json({
      id: result.insertId,
      title, description, status_id, priority_id, problem_id,
      machine_id, organe_id, piece_id, created_by, assigned_to
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update ticket
router.put('/:id', async (req, res) => {
  try {
    const {
      title, description, status_id, priority_id, problem_id,
      machine_id, organe_id, piece_id, assigned_to
    } = req.body;
    const updates = ['updated_at = NOW()'];
    const values = [];
    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (status_id !== undefined) { updates.push('status_id = ?'); values.push(status_id); }
    if (priority_id !== undefined) { updates.push('priority_id = ?'); values.push(priority_id); }
    if (problem_id !== undefined) { updates.push('problem_id = ?'); values.push(problem_id); }
    if (machine_id !== undefined) { updates.push('machine_id = ?'); values.push(machine_id); }
    if (organe_id !== undefined) { updates.push('organe_id = ?'); values.push(organe_id); }
    if (piece_id !== undefined) { updates.push('piece_id = ?'); values.push(piece_id); }
    if (assigned_to !== undefined) { updates.push('assigned_to = ?'); values.push(assigned_to); }
    values.push(req.params.id);
    const [result] = await db.query(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ message: 'Ticket updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ticket
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM tickets WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
