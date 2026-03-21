/**
 * routes/settings.js
 * ──────────────────────────────────────────────
 * Public:
 *   GET  /api/settings/hero  → returns hero image URLs & labels
 *
 * Protected (admin JWT):
 *   PUT  /api/settings/hero  → update hero images/labels (supports file upload)
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const upload = require('../middleware/upload');
const { verifyToken, requireAdmin } = require('../middleware/authenticate');

// Keys managed by this endpoint
const HERO_KEYS = [
  'hero_main_image_url',
  'hero_card1_image_url',
  'hero_card1_label',
  'hero_card2_image_url',
  'hero_card2_label',
];

// ─── GET hero settings (public) ───
router.get('/hero', async (_req, res) => {
  try {
    const placeholders = HERO_KEYS.map(() => '?').join(', ');
    const [rows] = await pool.query(
      `SELECT \`key\`, \`value\` FROM site_settings WHERE \`key\` IN (${placeholders})`,
      HERO_KEYS,
    );

    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get hero settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch hero settings' });
  }
});

// ─── UPDATE hero settings (admin only) ───
router.put(
  '/hero',
  verifyToken,
  requireAdmin,
  upload.fields([
    { name: 'hero_main_image', maxCount: 1 },
    { name: 'hero_card1_image', maxCount: 1 },
    { name: 'hero_card2_image', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updates = {};

      // Text/URL fields from body
      if (req.body.hero_card1_label !== undefined) {
        updates['hero_card1_label'] = req.body.hero_card1_label;
      }
      if (req.body.hero_card2_label !== undefined) {
        updates['hero_card2_label'] = req.body.hero_card2_label;
      }

      // Uploaded image files take priority; fallback to URL strings sent in body
      const fileMap = {
        hero_main_image: 'hero_main_image_url',
        hero_card1_image: 'hero_card1_image_url',
        hero_card2_image: 'hero_card2_image_url',
      };

      for (const [fieldName, settingKey] of Object.entries(fileMap)) {
        if (req.files?.[fieldName]?.[0]) {
          updates[settingKey] = `/uploads/${req.files[fieldName][0].filename}`;
        } else if (req.body[settingKey] !== undefined) {
          updates[settingKey] = req.body[settingKey];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: 'No settings to update' });
      }

      // Upsert each key
      for (const [key, value] of Object.entries(updates)) {
        await pool.query(
          `INSERT INTO site_settings (\`key\`, \`value\`) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`,
          [key, value],
        );
      }

      // Return fresh settings
      const placeholders = HERO_KEYS.map(() => '?').join(', ');
      const [rows] = await pool.query(
        `SELECT \`key\`, \`value\` FROM site_settings WHERE \`key\` IN (${placeholders})`,
        HERO_KEYS,
      );
      const settings = {};
      for (const row of rows) {
        settings[row.key] = row.value;
      }

      res.json({ success: true, data: settings, message: 'Hero settings updated successfully' });
    } catch (error) {
      console.error('Update hero settings error:', error);
      res.status(500).json({ success: false, message: 'Failed to update hero settings' });
    }
  },
);

module.exports = router;
