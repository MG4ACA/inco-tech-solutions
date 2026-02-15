-- Migration: 001_initial_schema.sql
-- Description: Initial database schema for Inco Tech Solutions
-- Created: 2026-02-06
-- Direction: up

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'pi pi-tag',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category_id INT NOT NULL,
  condition_type ENUM('new', 'refurbished') DEFAULT 'new',
  status ENUM('in_stock', 'out_of_stock', 'sold') DEFAULT 'in_stock',
  brand VARCHAR(100),
  model VARCHAR(100),
  cpu VARCHAR(150),
  ram VARCHAR(50),
  storage VARCHAR(100),
  gpu VARCHAR(150),
  display_spec VARCHAR(150),
  os VARCHAR(100),
  battery VARCHAR(100),
  warranty VARCHAR(100),
  image_url VARCHAR(500),
  images JSON,
  featured BOOLEAN DEFAULT FALSE,
  quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id),
  INDEX idx_condition (condition_type),
  INDEX idx_status (status),
  INDEX idx_featured (featured),
  INDEX idx_slug (slug)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS repair_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  device_type ENUM('laptop', 'desktop', 'tablet', 'phone', 'other') DEFAULT 'laptop',
  device_brand VARCHAR(100),
  device_model VARCHAR(150) NOT NULL,
  issue_description TEXT NOT NULL,
  urgency ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  status ENUM('pending', 'in_progress', 'diagnosed', 'waiting_parts', 'repaired', 'completed', 'cancelled') DEFAULT 'pending',
  estimated_cost DECIMAL(10, 2),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_urgency (urgency)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;