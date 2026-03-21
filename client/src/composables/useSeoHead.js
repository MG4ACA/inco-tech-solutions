/**
 * useSeoHead.js
 * ─────────────────────────────────────────────────────────────────
 * Dynamically injects <title>, <meta name="description">,
 * <link rel="canonical">, Open Graph tags, and optional JSON-LD
 * schema into document.head on every route.
 *
 * Zero dependencies — pure DOM manipulation.
 * Cleans up injected tags on component unmount.
 *
 * Usage:
 *   import { useSeoHead } from '@/composables/useSeoHead';
 *
 *   useSeoHead({
 *     title:       'Dell XPS 15 Refurbished | Inco Tech Solutions',
 *     description: 'Buy this refurbished Dell XPS 15...',
 *     canonical:   'https://incotechsolutions.com/product/dell-xps-15-...',
 *     jsonLd:      { "@type": "Product", ... }   // optional
 *   });
 * ─────────────────────────────────────────────────────────────────
 */

import { onUnmounted } from 'vue';

const BASE_URL = 'https://incotechsolutions.com';

/**
 * Set or create a <meta> tag identified by its `name` attribute.
 * Returns the element so it can be removed on unmount.
 */
function setMeta(name, content) {
  if (!content) return null;
  let el = document.querySelector(`meta[name="${name}"]`);
  const created = !el;
  if (created) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return created ? el : null; // only return if we CREATED it (so we can remove it)
}

/**
 * Set or create a <meta property="og:*"> tag.
 */
function setOgMeta(property, content) {
  if (!content) return null;
  let el = document.querySelector(`meta[property="${property}"]`);
  const created = !el;
  if (created) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return created ? el : null;
}

/**
 * Set or create <link rel="canonical">.
 */
function setCanonical(href) {
  if (!href) return null;
  let el = document.querySelector('link[rel="canonical"]');
  const created = !el;
  if (created) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  return created ? el : null;
}

/**
 * Inject a <script type="application/ld+json"> block.
 */
function injectJsonLd(data) {
  if (!data) return null;
  const el = document.createElement('script');
  el.setAttribute('type', 'application/ld+json');
  el.textContent = JSON.stringify(data);
  document.head.appendChild(el);
  return el;
}

/**
 * Set <meta name="robots"> — used to signal noindex for missing content.
 */
function setRobots(content) {
  return setMeta('robots', content);
}

// ─── Main composable ─────────────────────────────────────────────

export function useSeoHead({ title, description, canonical, jsonLd, noindex = false } = {}) {
  const createdEls = [];

  // ── Title ──
  const prevTitle = document.title;
  if (title) document.title = title;

  // ── Description ──
  const descEl = setMeta('description', description);
  if (descEl) createdEls.push(descEl);

  // ── Robots (noindex for missing/sold products) ──
  if (noindex) {
    const robotsEl = setMeta('robots', 'noindex, nofollow');
    if (robotsEl) createdEls.push(robotsEl);
  } else {
    // Make sure robots is set to index (reset if previously noindex)
    let robotsEl = document.querySelector('meta[name="robots"]');
    if (robotsEl) robotsEl.setAttribute('content', 'index, follow');
  }

  // ── Canonical ──
  const canonEl = setCanonical(canonical);
  if (canonEl) createdEls.push(canonEl);

  // ── Open Graph ──
  const ogTitle = setOgMeta('og:title', title);
  if (ogTitle) createdEls.push(ogTitle);
  const ogDesc = setOgMeta('og:description', description);
  if (ogDesc) createdEls.push(ogDesc);
  const ogUrl = setOgMeta('og:url', canonical);
  if (ogUrl) createdEls.push(ogUrl);

  // ── JSON-LD ──
  const ldEl = injectJsonLd(jsonLd);
  if (ldEl) createdEls.push(ldEl);

  // ── Cleanup on unmount ──
  onUnmounted(() => {
    document.title = prevTitle;
    for (const el of createdEls) {
      el?.parentNode?.removeChild(el);
    }
    // Reset canonical to base URL
    const canon = document.querySelector('link[rel="canonical"]');
    if (canon) canon.setAttribute('href', BASE_URL + '/');
  });
}

/**
 * Convenience: build a canonical URL from a path.
 */
export function canonicalUrl(path) {
  return `${BASE_URL}${path}`;
}
