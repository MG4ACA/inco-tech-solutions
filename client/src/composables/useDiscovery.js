/**
 * useDiscovery.js
 * ──────────────────────────────────────────────────────────────────
 * Composable for SEO/AEO/GEO discovery pages.
 *
 * Responsibilities:
 *  1. Fetch SEO entity data for the current route city param
 *  2. Update document.title dynamically
 *  3. Inject/update <meta name="description"> and canonical <link>
 *  4. Inject <script type="application/ld+json"> for JSON-LD schema
 *  5. Clean up injected tags on component unmount
 * ──────────────────────────────────────────────────────────────────
 */

import api from '@/api';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// ── Unique tag attribute so we can find & remove our injected tags ─
const TAG_ATTR = 'data-inco-seo';

export function useDiscovery() {
  const route = useRoute();

  const seoData    = ref(null);
  const loading    = ref(true);
  const error      = ref(null);
  const notInZone  = ref(false); // true when city is not in corridor

  // Track injected DOM nodes so we can remove them on unmount
  const injectedNodes = [];

  // ── Helpers ──────────────────────────────────────────────────────

  function setOrCreateMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"][${TAG_ATTR}]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      el.setAttribute(TAG_ATTR, 'true');
      document.head.appendChild(el);
      injectedNodes.push(el);
    }
    el.setAttribute('content', content);
  }

  function setOrCreateLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"][${TAG_ATTR}]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      el.setAttribute(TAG_ATTR, 'true');
      document.head.appendChild(el);
      injectedNodes.push(el);
    }
    el.setAttribute('href', href);
  }

  function injectJsonLd(jsonLdObject) {
    // Remove any previously injected ld+json tag first
    const existing = document.querySelector(`script[type="application/ld+json"][${TAG_ATTR}]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(TAG_ATTR, 'true');
    script.textContent = JSON.stringify(jsonLdObject, null, 2);
    document.head.appendChild(script);
    injectedNodes.push(script);
  }

  function applyHead(data) {
    // 1. Page title
    document.title = data.pageTitle;

    // 2. Meta description
    setOrCreateMeta('description', data.metaDesc);

    // 3. Robots (tell crawlers this is a real indexable page)
    setOrCreateMeta('robots', 'index, follow');

    // 4. Canonical URL
    setOrCreateLink('canonical', data.canonicalUrl);

    // 5. JSON-LD structured data
    if (data.jsonLd && typeof data.jsonLd === 'object') {
      injectJsonLd(data.jsonLd);
    }
  }

  function cleanup() {
    injectedNodes.forEach((node) => {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
    injectedNodes.length = 0;
  }

  // ── Fetch ─────────────────────────────────────────────────────────

  async function fetchDiscovery() {
    const citySlug = (route.params.city || '').toLowerCase().trim();

    if (!citySlug) {
      error.value = 'No city specified.';
      loading.value = false;
      return;
    }

    try {
      loading.value = true;
      error.value   = null;
      notInZone.value = false;

      const response = await api.get(`/seo/${citySlug}`);
      const data = response.data?.data;

      if (!data) throw new Error('Empty response from SEO API.');

      seoData.value = data;
      applyHead(data);

    } catch (err) {
      if (err.response?.status === 404) {
        notInZone.value = true;
        error.value = `We don't currently serve "${citySlug}". Check our service corridor.`;
        document.title = 'City Not in Service Area | Inco Tech Solutions';
      } else {
        error.value = 'Failed to load page data. Please try again.';
        console.error('[useDiscovery] fetch error:', err);
      }
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetchDiscovery);
  onUnmounted(cleanup);

  return {
    seoData,
    loading,
    error,
    notInZone,
    refetch: fetchDiscovery,
  };
}
