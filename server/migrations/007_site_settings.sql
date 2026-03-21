-- Migration: 007_site_settings.sql
-- Description: Site-wide settings table (hero images, labels, etc.)
-- Created: 2026-03-17

CREATE TABLE IF NOT EXISTS site_settings (
  `key`       VARCHAR(100) NOT NULL PRIMARY KEY,
  `value`     TEXT,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed hero section defaults
INSERT INTO site_settings (`key`, `value`) VALUES
  ('hero_main_image_url',  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=350&fit=crop&q=80'),
  ('hero_card1_image_url', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120&h=80&fit=crop&q=80'),
  ('hero_card1_label',     'ThinkPad X1'),
  ('hero_card2_image_url', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120&h=80&fit=crop&q=80'),
  ('hero_card2_label',     'MacBook Pro')
ON DUPLICATE KEY UPDATE `key` = `key`;
