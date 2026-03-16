/**
 * SeoController.js
 * ─────────────────────────────────────────────────────────────────
 * Handles SEO/AEO/GEO entity lookups for the Matara→Colombo corridor.
 *
 * Features:
 *  • City-slug whitelist guard → 404 for unknown cities
 *  • In-memory Map cache (TTL: 10 minutes) to reduce DB load
 *  • Returns full SEO payload: title, meta, JSON-LD, FAQ
 * ─────────────────────────────────────────────────────────────────
 */

const pool = require('../config/db');

// ── Whitelist ────────────────────────────────────────────────────
const SERVICE_CORRIDOR = new Set([
  'matara',
  'weligama',
  'galle',
  'hikkaduwa',
  'ambalangoda',
  'bentota',
  'aluthgama',
  'kalutara',
  'panadura',
  'colombo',
]);

// ── In-memory cache ──────────────────────────────────────────────
// Structure: Map<citySlug, { data: Object, expiresAt: number }>
const seoCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached(slug) {
  const entry = seoCache.get(slug);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    seoCache.delete(slug);
    return null;
  }
  return entry.data;
}

function setCache(slug, data) {
  seoCache.set(slug, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

// ── Controller ───────────────────────────────────────────────────

/**
 * GET /api/seo/:citySlug
 *
 * Returns the SEO entity payload for a given city.
 * 404 if the city is not in the service corridor or not yet seeded.
 */
async function getSeoByCity(req, res) {
  try {
    const citySlug = req.params.citySlug?.toLowerCase().trim();

    // 1. Whitelist guard
    if (!citySlug || !SERVICE_CORRIDOR.has(citySlug)) {
      return res.status(404).json({
        success: false,
        message: `City "${citySlug}" is not in the Inco Tech service corridor.`,
        corridor: [...SERVICE_CORRIDOR],
      });
    }

    // 2. Cache hit
    const cached = getCached(citySlug);
    if (cached) {
      return res.json({ success: true, source: 'cache', data: cached });
    }

    // 3. DB lookup
    const [rows] = await pool.query(
      'SELECT * FROM seo_entities WHERE city_slug = ? LIMIT 1',
      [citySlug],
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `SEO data for "${citySlug}" has not been seeded yet.`,
      });
    }

    const entity = rows[0];

    // 4. Parse stored fields
    const payload = {
      id:           entity.id,
      citySlug:     entity.city_slug,
      canonicalUrl: entity.canonical_url,
      pageTitle:    entity.page_title,
      metaDesc:     entity.meta_desc,
      // json_ld is stored as a raw JSON string — parse it for the response
      jsonLd:       safeParseJson(entity.json_ld, {}),
      // faq_payload is stored as MySQL JSON — already an object from mysql2
      faqPayload:   Array.isArray(entity.faq_payload)
                      ? entity.faq_payload
                      : safeParseJson(entity.faq_payload, []),
      updatedAt:    entity.updated_at,
    };

    // 5. Cache and respond
    setCache(citySlug, payload);
    return res.json({ success: true, source: 'db', data: payload });

  } catch (error) {
    console.error('[SeoController] getSeoByCity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve SEO data.',
    });
  }
}

/**
 * GET /api/seo
 *
 * Returns a list of all cities in the service corridor.
 * Useful for the Admin Dashboard "city list" panel.
 */
async function listCities(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, city_slug, page_title, canonical_url, updated_at FROM seo_entities ORDER BY id ASC',
    );

    return res.json({
      success: true,
      corridor: [...SERVICE_CORRIDOR],
      seeded: rows,
    });
  } catch (error) {
    console.error('[SeoController] listCities error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to list SEO cities.',
    });
  }
}

/**
 * POST /api/seo
 *
 * Creates or updates (upserts) an SEO entity for a given city.
 * Protected by JWT middleware in the route layer.
 */
async function upsertSeoEntity(req, res) {
  try {
    const { citySlug, canonicalUrl, pageTitle, metaDesc, jsonLd, faqPayload } = req.body;

    if (!citySlug || !SERVICE_CORRIDOR.has(citySlug.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `"${citySlug}" is not in the service corridor.`,
        corridor: [...SERVICE_CORRIDOR],
      });
    }

    if (!canonicalUrl || !pageTitle || !metaDesc || !jsonLd) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: canonicalUrl, pageTitle, metaDesc, jsonLd.',
      });
    }

    // Validate jsonLd is parseable
    let jsonLdString;
    if (typeof jsonLd === 'object') {
      jsonLdString = JSON.stringify(jsonLd);
    } else if (typeof jsonLd === 'string') {
      JSON.parse(jsonLd); // throws if invalid
      jsonLdString = jsonLd;
    } else {
      return res.status(400).json({ success: false, message: 'jsonLd must be a JSON object or string.' });
    }

    const faqString = typeof faqPayload === 'string' ? faqPayload : JSON.stringify(faqPayload || []);

    await pool.query(
      `INSERT INTO seo_entities (city_slug, canonical_url, page_title, meta_desc, json_ld, faq_payload)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         canonical_url = VALUES(canonical_url),
         page_title    = VALUES(page_title),
         meta_desc     = VALUES(meta_desc),
         json_ld       = VALUES(json_ld),
         faq_payload   = VALUES(faq_payload),
         updated_at    = CURRENT_TIMESTAMP`,
      [citySlug.toLowerCase(), canonicalUrl, pageTitle, metaDesc, jsonLdString, faqString],
    );

    // Invalidate cache for this city
    seoCache.delete(citySlug.toLowerCase());

    return res.json({ success: true, message: `SEO entity for "${citySlug}" saved successfully.` });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(400).json({ success: false, message: 'Invalid JSON in jsonLd field.' });
    }
    console.error('[SeoController] upsertSeoEntity error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save SEO entity.' });
  }
}

// ── Helpers ──────────────────────────────────────────────────────
function safeParseJson(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value; // already parsed by mysql2
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

module.exports = { getSeoByCity, listCities, upsertSeoEntity };
