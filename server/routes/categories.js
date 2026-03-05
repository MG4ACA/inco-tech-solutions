const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const slugify = require('slugify');
const { verifyToken, requireAdmin } = require('../middleware/authenticate');

// ─── GET ALL CATEGORIES ───
router.get('/', async (_req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT c.*, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id
       GROUP BY c.id
       ORDER BY c.sort_order ASC, c.name ASC`,
    );
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// ─── GET SINGLE CATEGORY ───
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const isSlug = isNaN(id);

    const [rows] = await pool.query(
      `SELECT c.*, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id
       WHERE ${isSlug ? 'c.slug = ?' : 'c.id = ?'}
       GROUP BY c.id`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
});

// ─── CREATE CATEGORY ───
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, icon, sort_order } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Check for duplicate slug
    const [existing] = await pool.query('SELECT id FROM categories WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: 'A category with this name already exists' });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, slug, description || null, icon || 'pi pi-tag', sort_order || 0],
    );

    const [newCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [
      result.insertId,
    ]);

    res
      .status(201)
      .json({ success: true, data: newCategory[0], message: 'Category created successfully' });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// ─── UPDATE CATEGORY ───
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, is_active, sort_order } = req.body;

    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?', 'slug = ?');
      values.push(name, slugify(name, { lower: true, strict: true }));
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (icon !== undefined) {
      updates.push('icon = ?');
      values.push(icon);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active ? 1 : 0);
    }
    if (sort_order !== undefined) {
      updates.push('sort_order = ?');
      values.push(parseInt(sort_order));
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    await pool.query(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query(
      `SELECT c.*, COUNT(p.id) AS product_count
       FROM categories c LEFT JOIN products p ON c.id = p.category_id
       WHERE c.id = ? GROUP BY c.id`,
      [id],
    );

    res.json({ success: true, data: updated[0], message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// ─── DELETE CATEGORY ───
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check for products in this category
    const [products] = await pool.query(
      'SELECT COUNT(*) AS count FROM products WHERE category_id = ?',
      [id],
    );
    if (products[0].count > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete category with ${products[0].count} associated product(s). Remove or reassign products first.`,
      });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

module.exports = router;
