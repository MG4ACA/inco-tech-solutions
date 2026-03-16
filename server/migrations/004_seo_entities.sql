-- Migration: 004_seo_entities.sql
-- Description: SEO/AEO/GEO engine — city corridor landing page metadata
-- Created: 2026-03-17
-- Direction: up

CREATE TABLE IF NOT EXISTS seo_entities (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  city_slug     VARCHAR(100)    NOT NULL UNIQUE,
  canonical_url VARCHAR(500)    NOT NULL,
  page_title    VARCHAR(255)    NOT NULL,
  meta_desc     VARCHAR(320)    NOT NULL,
  json_ld       TEXT            NOT NULL,
  faq_payload   JSON            NOT NULL,
  created_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_city_slug (city_slug)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
