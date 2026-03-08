const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const upload = require('../middleware/upload');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/authenticate');

// Delete a single image file from disk (silently ignores missing files)
function deleteImageFile(imageUrl) {
  if (!imageUrl) return;
  const filename = path.basename(imageUrl);
  const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
  const filepath = path.join(uploadDir, filename);
  fs.unlink(filepath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Failed to delete image file:', filepath, err.message);
    }
  });
}

// Extract all image URLs stored on a product row
function getProductImages(product) {
  if (product.images) {
    const arr = Array.isArray(product.images) ? product.images : JSON.parse(product.images);
    return arr.filter(Boolean);
  }
  return product.image_url ? [product.image_url] : [];
}

// ─── GET ALL PRODUCTS (with filtering, search, pagination) ───
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      condition,
      status,
      brand,
      search,
      sort = 'created_at',
      order = 'DESC',
      featured,
      min_price,
      max_price,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    let params = [];

    if (category) {
      where.push('c.slug = ?');
      params.push(category);
    }
    if (condition) {
      where.push('p.condition_type = ?');
      params.push(condition);
    }
    if (status) {
      where.push('p.status = ?');
      params.push(status);
    }
    if (brand) {
      where.push('p.brand = ?');
      params.push(brand);
    }
    if (featured === 'true') {
      where.push('p.featured = TRUE');
    }
    if (min_price) {
      where.push('p.price >= ?');
      params.push(parseFloat(min_price));
    }
    if (max_price) {
      where.push('p.price <= ?');
      params.push(parseFloat(max_price));
    }
    if (search) {
      where.push('(p.name LIKE ? OR p.brand LIKE ? OR p.model LIKE ? OR p.description LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const allowedSort = ['price', 'name', 'created_at', 'quantity'];
    const sortCol = allowedSort.includes(sort) ? `p.${sort}` : 'p.created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClause = where.join(' AND ');

    // Count total
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE ${whereClause}`,
      params,
    );
    const total = countRows[0].total;

    // Fetch products
    const [products] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ${whereClause}
       ORDER BY ${sortCol} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset],
    );

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// ─── GET SINGLE PRODUCT ───
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const isSlug = isNaN(id);

    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ${isSlug ? 'p.slug = ?' : 'p.id = ?'}`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get related products from same category
    const product = rows[0];
    const [related] = await pool.query(
      `SELECT p.*, c.name AS category_name FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.id != ? AND p.status = 'in_stock'
       ORDER BY RAND() LIMIT 4`,
      [product.category_id, product.id],
    );

    res.json({
      success: true,
      data: { ...product, related },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

// ─── CREATE PRODUCT ───
router.post('/', verifyToken, upload.array('images', 10), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      original_price,
      category_id,
      condition_type,
      status,
      brand,
      model,
      cpu,
      ram,
      storage,
      gpu,
      display_spec,
      os,
      battery,
      warranty,
      featured,
      quantity,
    } = req.body;

    if (!name || !price || !category_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Name, price, and category are required' });
    }

    const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
    const uploadedUrls = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const image_url = uploadedUrls.length > 0 ? uploadedUrls[0] : null;
    const images = uploadedUrls.length > 0 ? JSON.stringify(uploadedUrls) : null;

    const [result] = await pool.query(
      `INSERT INTO products (name, slug, description, price, original_price, category_id,
        condition_type, status, brand, model, cpu, ram, storage, gpu, display_spec, os,
        battery, warranty, image_url, images, featured, quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        description || null,
        parseFloat(price),
        original_price ? parseFloat(original_price) : null,
        parseInt(category_id),
        condition_type || 'new',
        status || 'in_stock',
        brand || null,
        model || null,
        cpu || null,
        ram || null,
        storage || null,
        gpu || null,
        display_spec || null,
        os || null,
        battery || null,
        warranty || null,
        image_url,
        images,
        featured === 'true' || featured === true ? 1 : 0,
        parseInt(quantity) || 0,
      ],
    );

    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);

    res
      .status(201)
      .json({ success: true, data: newProduct[0], message: 'Product created successfully' });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});

// ─── UPDATE PRODUCT ───
router.put('/:id', verifyToken, upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const fields = { ...req.body };

    // Check product exists
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Handle image updates
    const newFiles = req.files || [];
    if (newFiles.length > 0 || fields.keep_images !== undefined) {
      // Parse which existing images to retain
      let keepImages;
      if (fields.keep_images !== undefined) {
        try {
          keepImages = JSON.parse(fields.keep_images);
        } catch {
          keepImages = [];
        }
      } else {
        keepImages = getProductImages(existing[0]);
      }

      // Delete image files that were removed by the admin
      const currentImages = getProductImages(existing[0]);
      for (const url of currentImages) {
        if (!keepImages.includes(url)) deleteImageFile(url);
      }

      // Merge retained images with newly uploaded ones
      const newUrls = newFiles.map((f) => `/uploads/${f.filename}`);
      const allImages = [...keepImages, ...newUrls];
      fields.image_url = allImages.length > 0 ? allImages[0] : null;
      fields.images = allImages.length > 0 ? JSON.stringify(allImages) : null;
    }

    delete fields.keep_images;

    if (fields.name && fields.name !== existing[0].name) {
      fields.slug = slugify(fields.name, { lower: true, strict: true }) + '-' + Date.now();
    }

    // Build dynamic update
    const allowedFields = [
      'name',
      'slug',
      'description',
      'price',
      'original_price',
      'category_id',
      'condition_type',
      'status',
      'brand',
      'model',
      'cpu',
      'ram',
      'storage',
      'gpu',
      'display_spec',
      'os',
      'battery',
      'warranty',
      'image_url',
      'images',
      'featured',
      'quantity',
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (fields[field] !== undefined) {
        updates.push(`${field} = ?`);
        let val = fields[field];
        if (field === 'featured') val = val === 'true' || val === true ? 1 : 0;
        if (['price', 'original_price'].includes(field)) val = val ? parseFloat(val) : null;
        if (['category_id', 'quantity'].includes(field)) val = parseInt(val);
        values.push(val);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    await pool.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query(
      `SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`,
      [id],
    );

    res.json({ success: true, data: updated[0], message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

// ─── DELETE PRODUCT ───
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete all associated image files from disk before removing the DB record
    const imageUrls = getProductImages(existing[0]);
    for (const url of imageUrls) {
      deleteImageFile(url);
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

// ─── GET BRANDS ───
router.get('/meta/brands', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL ORDER BY brand',
    );
    res.json({ success: true, data: rows.map((r) => r.brand) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch brands' });
  }
});

module.exports = router;
