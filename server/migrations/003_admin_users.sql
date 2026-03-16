-- Admin users table for JWT authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'cashier') NOT NULL DEFAULT 'cashier',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default users
-- admin / admin123
-- cashier / cashier123
INSERT IGNORE INTO admin_users (username, password_hash, role) VALUES
  ('admin', '$2b$10$63MdNKEkU/HZ5mEaAvTqQ.wTXM8MxkATHMqxkykGgJAySjmiamzf6', 'admin'),
  ('cashier', '$2b$10$LP.Y92FKMtgL7qxKMW/lieeR4SQO7TD6DUXGgr7SEjL1aflfdqU2u', 'cashier');
