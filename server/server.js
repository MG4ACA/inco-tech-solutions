const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const botMetaInjector = require('./middleware/botMetaInjector');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── STATIC FILES ───
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve compiled Vue SPA from client/dist (used by bot renderer + production fallback)
const DIST_DIR = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(DIST_DIR));

// ─── BOT META INJECTOR (must be before API routes — bots only) ───
app.use(botMetaInjector);

// ─── ROUTES ───
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const repairRoutes = require('./routes/repairs');
const authRoutes = require('./routes/auth');
const seoRoutes = require('./routes/seo');
const sitemapRouter = require('./routes/sitemap');
const settingsRoutes = require('./routes/settings');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/settings', settingsRoutes);

// ─── SITEMAP & ROBOTS (root-level, no /api prefix) ───
app.use('/', sitemapRouter);


// ─── DASHBOARD STATS ───
const pool = require('./config/db');
const { verifyToken, requireAdmin } = require('./middleware/authenticate');

app.get('/api/dashboard/stats', verifyToken, requireAdmin, async (_req, res) => {
  try {
    const [productCount] = await pool.query('SELECT COUNT(*) AS count FROM products');
    const [categoryCount] = await pool.query('SELECT COUNT(*) AS count FROM categories');
    const [repairCount] = await pool.query('SELECT COUNT(*) AS count FROM repair_requests');
    const [inStockCount] = await pool.query(
      "SELECT COUNT(*) AS count FROM products WHERE status = 'in_stock'",
    );
    const [outOfStockCount] = await pool.query(
      "SELECT COUNT(*) AS count FROM products WHERE status = 'out_of_stock'",
    );
    const [soldCount] = await pool.query(
      "SELECT COUNT(*) AS count FROM products WHERE status = 'sold'",
    );
    const [pendingRepairs] = await pool.query(
      "SELECT COUNT(*) AS count FROM repair_requests WHERE status = 'pending'",
    );
    const [totalRevenuePotential] = await pool.query(
      "SELECT SUM(price * quantity) AS total FROM products WHERE status = 'in_stock'",
    );

    res.json({
      success: true,
      data: {
        totalProducts: productCount[0].count,
        totalCategories: categoryCount[0].count,
        totalRepairs: repairCount[0].count,
        inStock: inStockCount[0].count,
        outOfStock: outOfStockCount[0].count,
        sold: soldCount[0].count,
        pendingRepairs: pendingRepairs[0].count,
        inventoryValue: totalRevenuePotential[0].total || 0,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

// ─── HEALTH CHECK ───
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Inco Tech Solutions API',
  });
});

// ─── SPA FALLBACK ─── (must be after all API routes)
// For normal users hitting /product/:slug, /repair/:city, /catalog, etc.
// Bots are already handled above by botMetaInjector.
// express.static serves known files; this catch-all handles Vue Router routes.
app.get('*', (_req, res) => {
  const indexPath = path.join(__dirname, '..', 'client', 'dist', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(503).send('Application is not built yet. Run: cd client && npm run build');
});

// ─── ERROR HANDLING ───
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res
      .status(413)
      .json({ success: false, message: 'File too large. Maximum size is 5MB.' });
  }
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});


// ─── START SERVER ───
app.listen(PORT, () => {
  console.log(`\n🚀 Inco Tech Solutions API Server`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   URL         : http://localhost:${PORT}`);
  console.log(`   Health      : http://localhost:${PORT}/api/health\n`);
});
