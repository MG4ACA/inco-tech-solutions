-- Migration: 005_seed_seo_entities.sql
-- Description: Seed SEO corridor cities — Matara to Colombo
-- Created: 2026-03-17
-- Direction: up

INSERT IGNORE INTO seo_entities
  (city_slug, canonical_url, page_title, meta_desc, json_ld, faq_payload)
VALUES

-- 1. Matara
(
  'matara',
  'https://incotechsolutions.lk/repair/matara',
  'Computer & Laptop Repair in Matara | Inco Tech Solutions',
  'Expert computer, laptop & phone repair services in Matara. Fast turnaround, genuine parts, certified technicians. Call Inco Tech Solutions today!',
  '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Inco Tech Solutions — Matara","image":"https://incotechsolutions.lk/og-image.jpg","url":"https://incotechsolutions.lk/repair/matara","telephone":"+94-XX-XXXXXXX","address":{"@type":"PostalAddress","streetAddress":"Main Street","addressLocality":"Matara","addressRegion":"Southern Province","postalCode":"81000","addressCountry":"LK"},"geo":{"@type":"GeoCoordinates","latitude":5.9549,"longitude":80.5550},"areaServed":{"@type":"City","name":"Matara"},"priceRange":"LKR 500 – LKR 25000","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/incotechsolutions"]}',
  '[{"question":"How long does a laptop repair take in Matara?","answer":"Most repairs in Matara are completed within 24–48 hours. Screen replacements and keyboard fixes are often done same-day."},{"question":"Do you offer a warranty on repairs in Matara?","answer":"Yes. All repairs carried out at our Matara service centre come with a 30-day parts and labour warranty."},{"question":"Can you recover data from a crashed hard drive in Matara?","answer":"Yes. We offer professional data recovery services for HDD and SSD drives in Matara with a no-data-no-fee policy."}]'
),

-- 2. Weligama
(
  'weligama',
  'https://incotechsolutions.lk/repair/weligama',
  'Computer & Laptop Repair in Weligama | Inco Tech Solutions',
  'Trusted computer and laptop repair in Weligama. Screen replacements, virus removal, data recovery & more. Inco Tech Solutions serves the whole Southern coast.',
  '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Inco Tech Solutions — Weligama","image":"https://incotechsolutions.lk/og-image.jpg","url":"https://incotechsolutions.lk/repair/weligama","telephone":"+94-XX-XXXXXXX","address":{"@type":"PostalAddress","streetAddress":"Bypass Road","addressLocality":"Weligama","addressRegion":"Southern Province","postalCode":"81700","addressCountry":"LK"},"geo":{"@type":"GeoCoordinates","latitude":5.9752,"longitude":80.4297},"areaServed":{"@type":"City","name":"Weligama"},"priceRange":"LKR 500 – LKR 25000","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/incotechsolutions"]}',
  '[{"question":"Is there a computer repair shop near Weligama?","answer":"Yes. Inco Tech Solutions serves Weligama with on-site and remote repair services for laptops, desktops, and mobile devices."},{"question":"What brands do you repair in Weligama?","answer":"We repair all major brands including Dell, HP, Lenovo, Asus, Acer, Apple MacBook, and more in the Weligama area."},{"question":"Do you fix phone screens in Weligama?","answer":"Yes, we repair cracked and unresponsive screens for smartphones in Weligama. Most phone screen repairs are done within 1–2 hours."}]'
),

-- 3. Galle
(
  'galle',
  'https://incotechsolutions.lk/repair/galle',
  'Computer & Laptop Repair in Galle | Inco Tech Solutions',
  'Professional computer, laptop & phone repair in Galle. Certified technicians, genuine parts, fast service. Serving all areas of Galle district — Inco Tech Solutions.',
  '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Inco Tech Solutions — Galle","image":"https://incotechsolutions.lk/og-image.jpg","url":"https://incotechsolutions.lk/repair/galle","telephone":"+94-XX-XXXXXXX","address":{"@type":"PostalAddress","streetAddress":"Gamini Mawatha","addressLocality":"Galle","addressRegion":"Southern Province","postalCode":"80000","addressCountry":"LK"},"geo":{"@type":"GeoCoordinates","latitude":6.0535,"longitude":80.2210},"areaServed":{"@type":"City","name":"Galle"},"priceRange":"LKR 500 – LKR 25000","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/incotechsolutions"]}',
  '[{"question":"Where can I get my laptop repaired in Galle?","answer":"Inco Tech Solutions provides expert laptop repair in Galle, covering screen replacement, motherboard repair, RAM upgrades, and more."},{"question":"How much does laptop repair cost in Galle?","answer":"Laptop repair prices in Galle start from LKR 500 for minor fixes such as cleaning. Screen replacements typically range from LKR 8,000 to LKR 25,000 depending on the model."},{"question":"Do you offer home visits for computer repair in Galle?","answer":"Yes, we offer on-site repair visits in Galle for businesses and home users who cannot transport their equipment."}]'
),

-- 4. Hikkaduwa
(
  'hikkaduwa',
  'https://incotechsolutions.lk/repair/hikkaduwa',
  'Computer & Laptop Repair in Hikkaduwa | Inco Tech Solutions',
  'Laptop, desktop & phone repair services in Hikkaduwa. Quick fixes, data recovery, and upgrades. Inco Tech Solutions — your local IT partner on the Southern coast.',
  '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Inco Tech Solutions — Hikkaduwa","image":"https://incotechsolutions.lk/og-image.jpg","url":"https://incotechsolutions.lk/repair/hikkaduwa","telephone":"+94-XX-XXXXXXX","address":{"@type":"PostalAddress","streetAddress":"Galle Road","addressLocality":"Hikkaduwa","addressRegion":"Southern Province","postalCode":"80240","addressCountry":"LK"},"geo":{"@type":"GeoCoordinates","latitude":6.1395,"longitude":80.1067},"areaServed":{"@type":"City","name":"Hikkaduwa"},"priceRange":"LKR 500 – LKR 25000","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/incotechsolutions"]}',
  '[{"question":"Is there a laptop repair service in Hikkaduwa?","answer":"Yes. Inco Tech Solutions provides laptop and computer repair in Hikkaduwa with same-day service for common issues."},{"question":"Can you fix a water-damaged laptop in Hikkaduwa?","answer":"Yes, we handle liquid damage repair for laptops in Hikkaduwa. Bring your device in as soon as possible after the incident for the best recovery outcome."},{"question":"Do you sell refurbished laptops in Hikkaduwa?","answer":"Yes, we stock a range of quality-tested refurbished laptops suitable for students and professionals in the Hikkaduwa area."}]'
),

-- 5. Ambalangoda
(
  'ambalangoda',
  'https://incotechsolutions.lk/repair/ambalangoda',
  'Computer & Laptop Repair in Ambalangoda | Inco Tech Solutions',
  'Fast and affordable computer, laptop & phone repair in Ambalangoda. Virus removal, upgrades, screen fixes — Inco Tech Solutions has you covered.',
  '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Inco Tech Solutions — Ambalangoda","image":"https://incotechsolutions.lk/og-image.jpg","url":"https://incotechsolutions.lk/repair/ambalangoda","telephone":"+94-XX-XXXXXXX","address":{"@type":"PostalAddress","streetAddress":"Main Street","addressLocality":"Ambalangoda","addressRegion":"Southern Province","postalCode":"80300","addressCountry":"LK"},"geo":{"@type":"GeoCoordinates","latitude":6.2336,"longitude":80.0573},"areaServed":{"@type":"City","name":"Ambalangoda"},"priceRange":"LKR 500 – LKR 25000","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/incotechsolutions"]}',
  '[{"question":"Where can I get a computer repaired in Ambalangoda?","answer":"Inco Tech Solutions offers comprehensive computer and laptop repair services in Ambalangoda, including hardware diagnostics and software troubleshooting."},{"question":"Do you install operating systems in Ambalangoda?","answer":"Yes, we install and configure Windows 10, Windows 11, and Linux on laptops and desktops in Ambalangoda. Data backup is included."},{"question":"Can you remove viruses from my PC in Ambalangoda?","answer":"Absolutely. We provide deep virus and malware removal services in Ambalangoda, restoring your computer to peak performance."}]'
),

-- 6. Bentota
(
  'bentota',
  'https://incotechsolutions.lk/repair/bentota',
  'Computer & Laptop Repair in Bentota | Inco Tech Solutions',
  'Expert IT repair services in Bentota — laptop screen replacement, software fixes, data recovery & more. Inco Tech Solutions serves Bentota and surrounding areas.',
  '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Inco Tech Solutions — Bentota","image":"https://incotechsolutions.lk/og-image.jpg","url":"https://incotechsolutions.lk/repair/bentota","telephone":"+94-XX-XXXXXXX","address":{"@type":"PostalAddress","streetAddress":"Galle Road","addressLocality":"Bentota","addressRegion":"Southern Province","postalCode":"80500","addressCountry":"LK"},"geo":{"@type":"GeoCoordinates","latitude":6.4248,"longitude":79.9966},"areaServed":{"@type":"City","name":"Bentota"},"priceRange":"LKR 500 – LKR 25000","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/incotechsolutions"]}',
  '[{"question":"Is there a computer repair shop near Bentota?","answer":"Yes. Inco Tech Solutions offers laptop and computer repair services in and around Bentota, including pick-up and drop-off options."},{"question":"Can you upgrade my laptop RAM in Bentota?","answer":"Yes, we perform RAM and SSD upgrades for all laptop brands in Bentota, significantly improving performance and boot speed."},{"question":"Do you offer network setup services in Bentota?","answer":"Yes, we set up home and business Wi-Fi networks, fix connectivity issues, and install network equipment in Bentota."}]'
),

-- 7. Aluthgama
(
  'aluthgama',
  'https://incotechsolutions.lk/repair/aluthgama',
  'Computer & Laptop Repair in Aluthgama | Inco Tech Solutions',
  'Reliable laptop, desktop & smartphone repair in Aluthgama. Inco Tech Solutions — serving the Southern and Western coastal corridor with expert tech support.',
  '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Inco Tech Solutions — Aluthgama","image":"https://incotechsolutions.lk/og-image.jpg","url":"https://incotechsolutions.lk/repair/aluthgama","telephone":"+94-XX-XXXXXXX","address":{"@type":"PostalAddress","streetAddress":"Station Road","addressLocality":"Aluthgama","addressRegion":"Western Province","postalCode":"12080","addressCountry":"LK"},"geo":{"@type":"GeoCoordinates","latitude":6.4329,"longitude":79.9942},"areaServed":{"@type":"City","name":"Aluthgama"},"priceRange":"LKR 500 – LKR 25000","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/incotechsolutions"]}',
  '[{"question":"Where can I get a laptop screen fixed in Aluthgama?","answer":"Inco Tech Solutions provides laptop screen replacement in Aluthgama for all major brands. Original and compatible panels are available."},{"question":"Do you buy second-hand laptops in Aluthgama?","answer":"Yes, we purchase used laptops in Aluthgama. Bring your device for a free assessment and we will offer you a fair market price."},{"question":"Can you fix a slow computer in Aluthgama?","answer":"Yes, we diagnose and fix slow computers in Aluthgama through SSD upgrades, RAM additions, OS reinstalls, and malware removal."}]'
),

-- 8. Kalutara
(
  'kalutara',
  'https://incotechsolutions.lk/repair/kalutara',
  'Computer & Laptop Repair in Kalutara | Inco Tech Solutions',
  'Professional computer repair services in Kalutara. Laptop, desktop, and phone repairs with warranty. Inco Tech Solutions — Kalutara''s trusted IT specialists.',
  '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Inco Tech Solutions — Kalutara","image":"https://incotechsolutions.lk/og-image.jpg","url":"https://incotechsolutions.lk/repair/kalutara","telephone":"+94-XX-XXXXXXX","address":{"@type":"PostalAddress","streetAddress":"Galle Road","addressLocality":"Kalutara","addressRegion":"Western Province","postalCode":"12000","addressCountry":"LK"},"geo":{"@type":"GeoCoordinates","latitude":6.5854,"longitude":79.9607},"areaServed":{"@type":"City","name":"Kalutara"},"priceRange":"LKR 500 – LKR 25000","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/incotechsolutions"]}',
  '[{"question":"What computer repair services are available in Kalutara?","answer":"In Kalutara we offer laptop and desktop repairs, screen replacements, data recovery, virus removal, RAM and SSD upgrades, and network setup."},{"question":"How quickly can you repair my laptop in Kalutara?","answer":"Standard repairs in Kalutara are completed within 24 hours. Express same-day service is available for an additional fee."},{"question":"Do you service Apple MacBooks in Kalutara?","answer":"Yes, our certified technicians in Kalutara service Apple MacBook Pro and MacBook Air models, including logic board repair and battery replacement."}]'
),

-- 9. Panadura
(
  'panadura',
  'https://incotechsolutions.lk/repair/panadura',
  'Computer & Laptop Repair in Panadura | Inco Tech Solutions',
  'Expert laptop, desktop & phone repair in Panadura. Fast diagnostics, genuine parts, 30-day warranty. Inco Tech Solutions — Panadura''s go-to IT repair centre.',
  '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Inco Tech Solutions — Panadura","image":"https://incotechsolutions.lk/og-image.jpg","url":"https://incotechsolutions.lk/repair/panadura","telephone":"+94-XX-XXXXXXX","address":{"@type":"PostalAddress","streetAddress":"Galle Road","addressLocality":"Panadura","addressRegion":"Western Province","postalCode":"12500","addressCountry":"LK"},"geo":{"@type":"GeoCoordinates","latitude":6.7131,"longitude":79.9056},"areaServed":{"@type":"City","name":"Panadura"},"priceRange":"LKR 500 – LKR 25000","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/incotechsolutions"]}',
  '[{"question":"Is there a reliable computer repair shop in Panadura?","answer":"Yes. Inco Tech Solutions is a trusted computer and laptop repair centre in Panadura with certified technicians and genuine spare parts."},{"question":"Can you fix a laptop that won''t turn on in Panadura?","answer":"Yes, we diagnose and fix laptops that fail to power on in Panadura. Issues often include faulty charging ports, dead batteries, or power IC failures."},{"question":"Do you offer CCTV installation in Panadura?","answer":"Yes, we provide CCTV camera installation and network setup services for homes and businesses in Panadura."}]'
),

-- 10. Colombo
(
  'colombo',
  'https://incotechsolutions.lk/repair/colombo',
  'Computer & Laptop Repair in Colombo | Inco Tech Solutions',
  'Top-rated computer, laptop & phone repair in Colombo. Serving all districts — Colombo 1 to 15. Certified technicians, fast turnaround, genuine parts. Book your repair today!',
  '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Inco Tech Solutions — Colombo","image":"https://incotechsolutions.lk/og-image.jpg","url":"https://incotechsolutions.lk/repair/colombo","telephone":"+94-XX-XXXXXXX","address":{"@type":"PostalAddress","streetAddress":"Bauddhaloka Mawatha","addressLocality":"Colombo","addressRegion":"Western Province","postalCode":"00300","addressCountry":"LK"},"geo":{"@type":"GeoCoordinates","latitude":6.9271,"longitude":79.8612},"areaServed":{"@type":"City","name":"Colombo"},"priceRange":"LKR 500 – LKR 25000","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/incotechsolutions"]}',
  '[{"question":"Where is the best laptop repair shop in Colombo?","answer":"Inco Tech Solutions is a highly rated laptop and computer repair centre serving all Colombo districts with fast, professional service."},{"question":"How much does phone repair cost in Colombo?","answer":"Phone repair costs in Colombo vary by model and issue. Screen replacements start from LKR 4,500. Battery replacements start from LKR 2,500."},{"question":"Do you offer corporate IT support in Colombo?","answer":"Yes. We provide corporate IT support packages in Colombo including monthly maintenance contracts, emergency callouts, and network management."}]'
);
