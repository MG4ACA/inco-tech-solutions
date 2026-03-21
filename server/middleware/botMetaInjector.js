/**
 * middleware/botMetaInjector.js
 * ────────────────────────────────────────────────────────────────────
 * Intercepts requests from known search-engine crawlers and returns
 * a version of index.html with the correct <title>, <meta>, and
 * <link rel="canonical"> already baked in.
 *
 * Real users receive index.html untouched (normal SPA behaviour).
 * No Puppeteer / headless Chrome required.
 *
 * Supported routes:
 *   /                  → homepage meta
 *   /catalog           → catalog meta
 *   /product/:slug     → per-product meta + Product JSON-LD
 *   /repair/:city      → per-city meta (from seo_entities table)
 * ────────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');
const pool = require('../config/db');

const BASE_URL    = 'https://incotechsolutions.com';
const DIST_INDEX  = path.join(__dirname, '..', '..', 'client', 'dist', 'index.html');

// ── Bot user-agent detection ─────────────────────────────────────
const BOT_PATTERN = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|vkShare|W3C_Validator/i;

function isBot(req) {
  return BOT_PATTERN.test(req.headers['user-agent'] || '');
}

// ── In-memory cache (1-hour TTL per URL) ─────────────────────────
const cache    = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached(url) {
  const hit = cache.get(url);
  if (hit && Date.now() < hit.expiry) return hit.html;
  cache.delete(url);
  return null;
}

function setCached(url, html) {
  cache.set(url, { html, expiry: Date.now() + CACHE_TTL });
}

// ── HTML helper: inject tags into <head> ─────────────────────────
function buildHead({ title, description, canonical, jsonLd }) {
  const tags = [];

  if (title) {
    tags.push(`<title>${escHtml(title)}</title>`);
    tags.push(`<meta property="og:title" content="${escAttr(title)}">`);
  }
  if (description) {
    tags.push(`<meta name="description" content="${escAttr(description)}">`);
    tags.push(`<meta property="og:description" content="${escAttr(description)}">`);
  }
  if (canonical) {
    tags.push(`<link rel="canonical" href="${escAttr(canonical)}">`);
    tags.push(`<meta property="og:url" content="${escAttr(canonical)}">`);
  }
  if (jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
  }

  return tags.join('\n    ');
}

function injectIntoHtml(raw, meta) {
  const injected = buildHead(meta);

  // Replace the existing <title> with our new one (and append the rest)
  return raw
    .replace(/<title>[^<]*<\/title>/, '') // remove static title first
    .replace('</head>', `    ${injected}\n  </head>`);
}

// ── Simple HTML escaping helpers ─────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}

// ── Meta builders per route type ─────────────────────────────────

async function metaForProduct(slug) {
  const [rows] = await pool.query(
    `SELECT p.name, p.description, p.slug, p.price, p.brand, p.condition_type,
            p.image_url, p.status, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ? LIMIT 1`,
    [slug],
  );
  if (!rows.length) return null;

  const p         = rows[0];
  const condition = p.condition_type === 'new' ? 'Brand New' : 'Refurbished';
  const price     = `Rs. ${Number(p.price).toLocaleString('en-LK')}`;
  const desc      = p.description
    ? p.description.slice(0, 155)
    : `${condition} ${p.brand || ''} ${p.name} at ${price}. Buy from Inco Tech Solutions — Sri Lanka\'s trusted computer store.`;

  return {
    title:       `${p.name} | ${condition} | Inco Tech Solutions`,
    description: desc,
    canonical:   `${BASE_URL}/product/${p.slug}`,
    jsonLd: {
      '@context':   'https://schema.org',
      '@type':      'Product',
      name:         p.name,
      description:  p.description || '',
      image:        p.image_url ? `${BASE_URL}${p.image_url}` : undefined,
      brand:        p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
      offers: {
        '@type':        'Offer',
        priceCurrency:  'LKR',
        price:          p.price,
        availability:   p.status === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url:            `${BASE_URL}/product/${p.slug}`,
        seller:         { '@type': 'Organization', name: 'Inco Tech Solutions' },
      },
    },
  };
}

async function metaForCity(citySlug) {
  const [rows] = await pool.query(
    'SELECT city_slug, canonical_url, page_title, meta_desc FROM seo_entities WHERE city_slug = ? LIMIT 1',
    [citySlug],
  );

  const cityLabel = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  if (!rows.length) {
    return {
      title:       `${cityLabel} Computer Repair | Inco Tech Solutions`,
      description: `Computer and laptop repair services in ${cityLabel}, Sri Lanka.`,
      canonical:   `${BASE_URL}/repair/${citySlug}`,
    };
  }

  const s = rows[0];
  return {
    title:       s.page_title || `${cityLabel} Computer & Laptop Repair | Inco Tech Solutions`,
    description: s.meta_desc  || `Expert computer and laptop repair in ${cityLabel}. Fast turnaround, genuine parts, 30-day warranty.`,
    canonical:   s.canonical_url || `${BASE_URL}/repair/${s.city_slug}`,
  };
}


const STATIC_ROUTES = {
  '/': {
    title:       'Inco Tech Solutions | Computer Retail & Repair in Sri Lanka',
    description: "Sri Lanka's trusted source for new and refurbished laptops, computers, and accessories. Expert repair services with fast turnaround and warranty.",
    canonical:    BASE_URL + '/',
  },
  '/catalog': {
    title:       'Product Catalog | New & Refurbished Laptops | Inco Tech Solutions',
    description: 'Browse our full catalog of new and refurbished laptops, desktops, and accessories at Inco Tech Solutions. Best prices in Sri Lanka with warranty.',
    canonical:    BASE_URL + '/catalog',
  },
};

// ── Main middleware ───────────────────────────────────────────────

async function botMetaInjector(req, res, next) {
  // Only intercept GET requests from bots that are NOT API calls
  if (req.method !== 'GET' || req.path.startsWith('/api/') || !isBot(req)) {
    return next();
  }

  try {
    const url = req.path;

    // Check cache first
    const cached = getCached(url);
    if (cached) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-Bot-Cache', 'HIT');
      return res.send(cached);
    }

    // Determine which meta to inject
    let meta = null;

    // Static routes
    if (STATIC_ROUTES[url]) {
      meta = STATIC_ROUTES[url];
    }
    // Product pages: /product/:slug
    else if (/^\/product\/[^/]+$/.test(url)) {
      const slug = url.replace('/product/', '');
      meta = await metaForProduct(slug);
    }
    // City repair pages: /repair/:city
    else if (/^\/repair\/[^/]+$/.test(url)) {
      const city = url.replace('/repair/', '');
      meta = await metaForCity(city);
    }

    // If no meta matched, let normal SPA handling take over
    if (!meta) return next();

    // Read dist/index.html and inject
    if (!fs.existsSync(DIST_INDEX)) {
      console.warn('[BotRenderer] client/dist/index.html not found — skipping injection');
      return next();
    }

    const rawHtml    = fs.readFileSync(DIST_INDEX, 'utf-8');
    const enriched   = injectIntoHtml(rawHtml, meta);

    setCached(url, enriched);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Bot-Cache', 'MISS');
    return res.send(enriched);

  } catch (err) {
    console.error('[BotRenderer] Error:', err.message);
    return next(); // fall through to normal SPA serving on any error
  }
}

module.exports = botMetaInjector;
