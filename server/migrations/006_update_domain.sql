-- Migration: 006_update_domain.sql
-- Description: Update seeded domain from incotechsolutions.lk → incotechsolutions.com
-- Created: 2026-03-17
-- Direction: up

-- Fix canonical_url column
UPDATE seo_entities
SET canonical_url = REPLACE(canonical_url, 'incotechsolutions.lk', 'incotechsolutions.com')
WHERE canonical_url LIKE '%incotechsolutions.lk%';

-- Fix json_ld column (stored as TEXT — use string replacement)
UPDATE seo_entities
SET json_ld = REPLACE(json_ld, 'incotechsolutions.lk', 'incotechsolutions.com')
WHERE json_ld LIKE '%incotechsolutions.lk%';
