/**
 * routes/seo.js
 * ─────────────────────────────────────────────────
 * Public:
 *   GET  /api/seo            → list all corridor cities + seeded data
 *   GET  /api/seo/:citySlug  → get SEO payload for a single city
 *
 * Protected (admin JWT required):
 *   POST /api/seo            → upsert (create or update) an SEO entity
 * ─────────────────────────────────────────────────
 */

const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authenticate');
const { getSeoByCity, listCities, upsertSeoEntity } = require('../controllers/SeoController');

// ── Public routes ─────────────────────────────────
router.get('/', listCities);
router.get('/:citySlug', getSeoByCity);

// ── Protected routes (Admin only) ─────────────────
router.post('/', verifyToken, requireAdmin, upsertSeoEntity);

module.exports = router;
