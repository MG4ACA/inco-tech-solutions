-- Migration: 002_seed_initial_data.sql
-- Description: Initial seed data for categories and products with images
-- Created: 2026-02-06
-- Direction: up

-- Clear existing data to prevent duplicates (delete in correct order due to foreign keys)
DELETE FROM products;
DELETE FROM repair_requests;
DELETE FROM categories;

INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
('Brand New Laptops', 'new-laptops', 'Latest brand new laptops from top manufacturers with full warranty', 'pi pi-desktop', 1),
('Refurbished Laptops', 'refurbished-laptops', 'Quality tested and certified refurbished laptops at great prices', 'pi pi-refresh', 2),
('Computer Accessories', 'accessories', 'Keyboards, mice, monitors, headsets, and more peripherals', 'pi pi-box', 3),
('Repair Services', 'repair-services', 'Professional computer repair, diagnostic, and maintenance services', 'pi pi-wrench', 4);

INSERT INTO products (name, slug, description, price, original_price, category_id, condition_type, status, brand, model, cpu, ram, storage, gpu, display_spec, os, battery, warranty, image_url, featured, quantity) VALUES
('ASUS ROG Strix G16', 'asus-rog-strix-g16', 'Dominate the battlefield with the ASUS ROG Strix G16. Built for hardcore gaming and content creation with top-tier specs.', 1899.99, 2099.99, 1, 'new', 'in_stock', 'ASUS', 'ROG Strix G16 (2025)', 'Intel Core i9-14900HX', '32GB DDR5 5600MHz', '1TB NVMe PCIe 4.0 SSD', 'NVIDIA GeForce RTX 4070 8GB', '16" QHD+ 240Hz IPS', 'Windows 11 Home', '90Wh, up to 8 hours', '2 Years ASUS Global', 'https://images.unsplash.com/photo-1592286927505-1def25e4be18?w=600&h=400&fit=crop', TRUE, 15),

('Dell XPS 15', 'dell-xps-15', 'The Dell XPS 15 combines stunning InfinityEdge display with powerful performance for professionals and creatives.', 1649.99, 1799.99, 1, 'new', 'in_stock', 'Dell', 'XPS 15 9530', 'Intel Core i7-13700H', '16GB DDR5 4800MHz', '512GB NVMe PCIe 4.0 SSD', 'NVIDIA GeForce RTX 4050 6GB', '15.6" 3.5K OLED Touch', 'Windows 11 Pro', '86Wh, up to 13 hours', '1 Year Dell Premium', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop', TRUE, 10),

('Lenovo ThinkPad X1 Carbon Gen 11', 'lenovo-thinkpad-x1-carbon-gen11', 'The ultimate business ultrabook. Lightweight, powerful, and built to last with legendary ThinkPad reliability.', 1549.99, NULL, 1, 'new', 'in_stock', 'Lenovo', 'ThinkPad X1 Carbon Gen 11', 'Intel Core i7-1365U', '16GB LPDDR5', '512GB PCIe Gen 4 SSD', 'Intel Iris Xe Graphics', '14" 2.8K OLED 400nits', 'Windows 11 Pro', '57Wh, up to 15 hours', '3 Years Lenovo On-Site', 'https://images.unsplash.com/photo-1588872657840-218e412ee62e?w=600&h=400&fit=crop', FALSE, 8),

('HP Spectre x360 16', 'hp-spectre-x360-16', 'A premium 2-in-1 convertible laptop with stunning design and display. Perfect for creative professionals.', 1799.99, 1999.99, 1, 'new', 'in_stock', 'HP', 'Spectre x360 16-f2013dx', 'Intel Core i7-13700H', '16GB DDR4 3200MHz', '1TB PCIe NVMe SSD', 'Intel Arc A370M', '16" 3K+ OLED Touch', 'Windows 11 Home', '83Wh, up to 11 hours', '2 Years HP Care Pack', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop', TRUE, 5),

('MacBook Pro 14" M3 Pro', 'macbook-pro-14-m3-pro', 'Apple MacBook Pro with M3 Pro chip. Unprecedented performance for professionals.', 2199.99, NULL, 1, 'new', 'in_stock', 'Apple', 'MacBook Pro 14" (2024)', 'Apple M3 Pro (12-core CPU)', '18GB Unified Memory', '512GB SSD', 'Apple M3 Pro (18-core GPU)', '14.2" Liquid Retina XDR', 'macOS Sonoma', '70Wh, up to 17 hours', '1 Year AppleCare', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop', TRUE, 12),

('Dell Latitude 5540 (Refurbished)', 'dell-latitude-5540-refurb', 'Certified refurbished Dell Latitude 5540. Thoroughly tested, cleaned, and restored to excellent condition.', 649.99, 1299.99, 2, 'refurbished', 'in_stock', 'Dell', 'Latitude 5540', 'Intel Core i5-1345U', '16GB DDR4', '256GB SSD', 'Intel Iris Xe Graphics', '15.6" FHD IPS', 'Windows 11 Pro', '54Wh, up to 10 hours', '6 Months Store Warranty', 'https://images.unsplash.com/photo-1589939705882-300dad5e8ee7?w=600&h=400&fit=crop', TRUE, 20),

('HP EliteBook 840 G9 (Refurbished)', 'hp-elitebook-840-g9-refurb', 'Premium refurbished HP EliteBook. Grade A condition with minimal cosmetic wear.', 579.99, 1449.99, 2, 'refurbished', 'in_stock', 'HP', 'EliteBook 840 G9', 'Intel Core i5-1245U', '16GB DDR5', '512GB SSD', 'Intel Iris Xe Graphics', '14" FHD IPS', 'Windows 11 Pro', '51Wh, up to 9 hours', '6 Months Store Warranty', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop', FALSE, 15),

('Lenovo ThinkPad T14s (Refurbished)', 'lenovo-thinkpad-t14s-refurb', 'Refurbished ThinkPad T14s in excellent condition. Ideal for business use with robust build quality.', 499.99, 1199.99, 2, 'refurbished', 'in_stock', 'Lenovo', 'ThinkPad T14s Gen 3', 'AMD Ryzen 5 PRO 6650U', '16GB LPDDR5', '256GB SSD', 'AMD Radeon 660M', '14" FHD IPS 300nits', 'Windows 11 Pro', '52.5Wh, up to 12 hours', '6 Months Store Warranty', 'https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=600&h=400&fit=crop', TRUE, 12),

('MacBook Air M1 (Refurbished)', 'macbook-air-m1-refurb', 'Apple Certified Refurbished MacBook Air with M1 chip. Like-new condition with great savings.', 699.99, 999.99, 2, 'refurbished', 'in_stock', 'Apple', 'MacBook Air M1 (2020)', 'Apple M1 (8-core CPU)', '8GB Unified Memory', '256GB SSD', 'Apple M1 (7-core GPU)', '13.3" Retina 2560x1600', 'macOS Sonoma', '49.9Wh, up to 18 hours', '1 Year AppleCare', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop', FALSE, 7),

('Logitech MX Master 3S', 'logitech-mx-master-3s', 'The most advanced ergonomic mouse with MagSpeed scrolling and quiet clicks. Perfect for productivity.', 99.99, NULL, 3, 'new', 'in_stock', 'Logitech', 'MX Master 3S', NULL, NULL, NULL, NULL, NULL, NULL, '500mAh, up to 70 days', '2 Years Logitech', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=400&fit=crop', FALSE, 50),

('Samsung 27" 4K Monitor', 'samsung-27-4k-monitor', 'Samsung 27" UHD 4K IPS monitor with HDR10 and USB-C connectivity. Perfect for professionals.', 349.99, 449.99, 3, 'new', 'in_stock', 'Samsung', 'S27A800UJN', NULL, NULL, NULL, NULL, '27" 4K UHD 3840x2160 IPS', NULL, NULL, '3 Years Samsung', 'https://images.unsplash.com/photo-1599298986391-a30c3f0c47e5?w=600&h=400&fit=crop', TRUE, 25),

('Corsair K70 RGB Pro', 'corsair-k70-rgb-pro', 'Premium mechanical gaming keyboard with Cherry MX switches and per-key RGB lighting.', 159.99, NULL, 3, 'new', 'in_stock', 'Corsair', 'K70 RGB PRO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2 Years Corsair', 'https://images.unsplash.com/photo-1587829212624-fd3afb60cb53?w=600&h=400&fit=crop', FALSE, 30),

('WD Black SN850X 2TB NVMe', 'wd-black-sn850x-2tb', 'Ultra-fast PCIe Gen 4 NVMe SSD. Read speeds up to 7,300 MB/s for gaming and heavy workloads.', 149.99, 199.99, 3, 'new', 'in_stock', 'Western Digital', 'WD_BLACK SN850X', NULL, NULL, '2TB NVMe PCIe Gen 4', NULL, NULL, NULL, NULL, '5 Years WD', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=400&fit=crop', FALSE, 40),

('Kingston Fury Beast 32GB DDR5', 'kingston-fury-beast-32gb-ddr5', 'High-performance DDR5 RAM kit (2x16GB) at 5600MHz. Built for gaming and content creation.', 89.99, 119.99, 3, 'new', 'in_stock', 'Kingston', 'Fury Beast DDR5', NULL, '32GB (2x16GB) DDR5 5600MHz', NULL, NULL, NULL, NULL, NULL, 'Lifetime Kingston', 'https://images.unsplash.com/photo-1587829212624-fd3afb60cb53?w=600&h=400&fit=crop', FALSE, 60);
