# Database Migrations Guide

Migrations are organized SQL files that manage incremental database schema changes. This system tracks applied migrations and prevents re-execution.

## 📁 Structure

```
server/
├── migrations/
│   ├── 001_initial_schema.sql       # Creates tables
│   ├── 002_seed_initial_data.sql    # Inserts seed data
│   ├── run-migrations.js            # Migration runner
│   └── (future migrations here)
└── MIGRATIONS.md                    # This file
```

## 🚀 Running Migrations

### First time (initialize database):

```powershell
# Drop existing database and start fresh
mysql -u root -p -e "DROP DATABASE IF EXISTS inco_tech_solutions;"

# Run migrations
node server/migrations/run-migrations.js
```

### Running pending migrations:

```powershell
node server/migrations/run-migrations.js
```

The runner:

- ✅ Automatically tracks applied migrations
- ✅ Skips already-applied migrations
- ✅ Executes pending migrations in order
- ✅ Displays status for each migration

## 📝 Creating New Migrations

1. **Name the file** with pattern: `XXX_description_of_change.sql`
   - Example: `003_add_user_reviews.sql`

2. **Write SQL statements** (one per line, separated by `;`):

   ```sql
   -- Migration: 003_add_user_reviews.sql
   -- Description: Add product reviews table
   -- Created: 2026-02-06
   -- Direction: up

   CREATE TABLE product_reviews (
     id INT AUTO_INCREMENT PRIMARY KEY,
     product_id INT NOT NULL,
     user_name VARCHAR(100),
     rating INT CHECK (rating >= 1 AND rating <= 5),
     comment TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
   );
   ```

3. **Run migration**:
   ```powershell
   node server/migrations/run-migrations.js
   ```

## 📊 Tracking Table

The `migrations` table stores which migrations have been applied:

```sql
SELECT * FROM migrations;
```

Output:

```
| id | name                    | applied_at          |
|----|-------------------------|---------------------|
| 1  | 001_initial_schema.sql  | 2026-02-06 10:30:00 |
| 2  | 002_seed_initial_data.sql | 2026-02-06 10:30:01 |
```

## ✅ Best Practices

1. **Name clearly** - Use descriptive names reflecting the change
2. **Separate concerns** - Schema creation vs. data seeding
3. **Test locally first** - Always verify migrations work
4. **Keep it simple** - Avoid complex logic in migrations
5. **Version control** - Commit migration files with your code
6. **Never modify** - Don't edit already-applied migrations
7. **Document changes** - Add comments explaining the why

## 🔄 Workflow Example

**Deploy new feature with database changes:**

```powershell
# On development machine
git pull origin main

# Run migrations (automatically applies new ones)
node server/migrations/run-migrations.js

# Restart server
npm run dev
```

## 📋 Current Migrations

| #   | Name                      | Description                                         |
| --- | ------------------------- | --------------------------------------------------- |
| 1   | 001_initial_schema.sql    | Create categories, products, repair_requests tables |
| 2   | 002_seed_initial_data.sql | Insert 4 categories and 14 products with images     |

## 🛑 Troubleshooting

**"Migration failed: duplicate key error"**

- A migration with that name already exists in the migrations table
- Edit migration content or use a new file number

**"Connection failed"**

- Check `.env` file has correct DB credentials
- Ensure MySQL is running

**"Syntax error in migration"**

- Verify SQL syntax is valid
- Check for unclosed quotes or missing semicolons

## 🚀 Continuous Integration

The migration runner can be integrated into CI/CD pipelines:

```yaml
# Example: GitHub Actions
- name: Run Database Migrations
  run: node server/migrations/run-migrations.js
```

This ensures database schema is always up-to-date on deployment.
