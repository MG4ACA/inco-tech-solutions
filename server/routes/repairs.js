const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ─── GET ALL REPAIR REQUESTS (with filtering) ───
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, urgency, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = ['1=1'];
    let params = [];

    if (status) {
      where.push('status = ?');
      params.push(status);
    }
    if (urgency) {
      where.push('urgency = ?');
      params.push(urgency);
    }
    if (search) {
      where.push(
        '(user_name LIKE ? OR email LIKE ? OR device_model LIKE ? OR issue_description LIKE ?)',
      );
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const whereClause = where.join(' AND ');

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM repair_requests WHERE ${whereClause}`,
      params,
    );

    const [requests] = await pool.query(
      `SELECT * FROM repair_requests WHERE ${whereClause} ORDER BY
        CASE urgency WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
        created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    );

    res.json({
      success: true,
      data: requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countRows[0].total,
        pages: Math.ceil(countRows[0].total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get repair requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch repair requests' });
  }
});

// ─── GET SINGLE REPAIR REQUEST ───
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM repair_requests WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Repair request not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get repair request error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch repair request' });
  }
});

// ─── CREATE REPAIR REQUEST (public form) ───
router.post('/', async (req, res) => {
  try {
    const {
      user_name,
      email,
      phone,
      device_type,
      device_brand,
      device_model,
      issue_description,
      urgency,
    } = req.body;

    // Validation
    if (!user_name || !email || !device_model || !issue_description) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, device model, and issue description are required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const [result] = await pool.query(
      `INSERT INTO repair_requests (user_name, email, phone, device_type, device_brand, device_model, issue_description, urgency)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_name,
        email,
        phone || null,
        device_type || 'laptop',
        device_brand || null,
        device_model,
        issue_description,
        urgency || 'medium',
      ],
    );

    const [newRequest] = await pool.query('SELECT * FROM repair_requests WHERE id = ?', [
      result.insertId,
    ]);

    res.status(201).json({
      success: true,
      data: newRequest[0],
      message: 'Repair request submitted successfully. We will contact you shortly!',
    });
  } catch (error) {
    console.error('Create repair request error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit repair request' });
  }
});

// ─── UPDATE REPAIR REQUEST (admin) ───
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, estimated_cost, admin_notes, urgency } = req.body;

    const [existing] = await pool.query('SELECT * FROM repair_requests WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Repair request not found' });
    }

    const updates = [];
    const values = [];

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (estimated_cost !== undefined) {
      updates.push('estimated_cost = ?');
      values.push(parseFloat(estimated_cost));
    }
    if (admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      values.push(admin_notes);
    }
    if (urgency !== undefined) {
      updates.push('urgency = ?');
      values.push(urgency);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    await pool.query(`UPDATE repair_requests SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query('SELECT * FROM repair_requests WHERE id = ?', [id]);

    res.json({ success: true, data: updated[0], message: 'Repair request updated successfully' });
  } catch (error) {
    console.error('Update repair request error:', error);
    res.status(500).json({ success: false, message: 'Failed to update repair request' });
  }
});

// ─── GET REPAIR STATS (admin dashboard) ───
router.get('/meta/stats', async (_req, res) => {
  try {
    const [statusCounts] = await pool.query(
      `SELECT status, COUNT(*) AS count FROM repair_requests GROUP BY status`,
    );
    const [urgencyCounts] = await pool.query(
      `SELECT urgency, COUNT(*) AS count FROM repair_requests GROUP BY urgency`,
    );
    const [total] = await pool.query('SELECT COUNT(*) AS total FROM repair_requests');

    res.json({
      success: true,
      data: {
        total: total[0].total,
        byStatus: statusCounts,
        byUrgency: urgencyCounts,
      },
    });
  } catch (error) {
    console.error('Get repair stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch repair stats' });
  }
});

module.exports = router;
