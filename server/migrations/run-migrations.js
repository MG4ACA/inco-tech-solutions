/**
 * Migration Runner
 * Executes pending migrations in sequence and tracks them
 * Usage: node migrations/run-migrations.js OR npm run migrate
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Load .env from server directory (parent of migrations folder)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const MIGRATIONS_DIR = path.join(__dirname);

// Database connection config
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('💡 Make sure .env file exists in the server directory');
  process.exit(1);
}

async function runMigrations() {
  let connection;

  try {
    console.log('🔧 Database Configuration:');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Port: ${dbConfig.port || 3306}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Database: ${dbConfig.database}\n`);

    // Create connection to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database:', process.env.DB_NAME);

    // Create migrations tracking table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Migrations tracking table ready');

    // Get list of migration files (excluding this runner script)
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('ℹ️  No migration files found');
      return;
    }

    // Get list of already applied migrations
    const [applied] = await connection.query('SELECT name FROM migrations');
    const appliedNames = new Set(applied.map((m) => m.name));

    console.log(`\n📋 Found ${files.length} migration file(s)`);
    console.log(`✔️  Already applied: ${appliedNames.size}`);
    console.log(`⏳ Pending: ${files.length - appliedNames.size}\n`);

    // Run pending migrations
    let executed = 0;
    for (const file of files) {
      if (appliedNames.has(file)) {
        console.log(`⊘ ${file} (already applied)`);
        continue;
      }

      try {
        const filePath = path.join(MIGRATIONS_DIR, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        // Remove comment lines and split by semicolon
        const cleanSql = sql
          .split('\n')
          .filter((line) => !line.trim().startsWith('--'))
          .join('\n');

        // Split statements by semicolon and clean up
        const statements = cleanSql
          .split(';')
          .map((stmt) => stmt.trim())
          .filter((stmt) => stmt.length > 0);

        // Execute each statement
        for (const statement of statements) {
          if (statement) {
            await connection.query(statement);
          }
        }

        // Track migration as applied
        await connection.query('INSERT INTO migrations (name) VALUES (?)', [file]);
        console.log(`✓ ${file}`);
        executed++;
      } catch (err) {
        console.error(`✗ ${file} - ERROR:`, err.message);
        throw err;
      }
    }

    console.log(`\n✅ Migration complete! ${executed} migration(s) executed`);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run migrations
runMigrations();
