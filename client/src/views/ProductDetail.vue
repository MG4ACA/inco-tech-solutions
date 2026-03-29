<template>
  <div style="padding-top: 80px; min-height: 100vh; background: var(--inco-surface-dark)">
    <div class="section-container py-5">
      <!-- Loading State -->
      <div v-if="loading" class="grid">
        <div class="col-12 md:col-6">
          <div class="skeleton-shimmer" style="height: 400px; border-radius: 12px"></div>
        </div>
        <div class="col-12 md:col-6">
          <Skeleton width="50%" height="1rem" class="mb-2" />
          <Skeleton width="80%" height="2rem" class="mb-3" />
          <Skeleton width="30%" height="1.5rem" class="mb-4" />
          <Skeleton width="100%" height="4rem" class="mb-3" />
          <div class="flex gap-2 mb-3">
            <Skeleton width="80px" height="2rem" borderRadius="16px" />
            <Skeleton width="80px" height="2rem" borderRadius="16px" />
            <Skeleton width="80px" height="2rem" borderRadius="16px" />
          </div>
        </div>
      </div>

      <!-- Product Detail -->
      <div v-else-if="product">
        <!-- Breadcrumb -->
        <div class="mb-4">
          <div
            class="flex align-items-center gap-2 text-sm"
            style="color: var(--inco-text-secondary)"
          >
            <router-link to="/" style="color: var(--inco-text-secondary)">Home</router-link>
            <i class="pi pi-chevron-right text-xs"></i>
            <router-link to="/catalog" style="color: var(--inco-text-secondary)">
              Catalog
            </router-link>
            <i class="pi pi-chevron-right text-xs"></i>
            <span style="color: var(--inco-primary-light)">{{ product.name }}</span>
          </div>
        </div>

        <div class="grid">
          <!-- Image Gallery -->
          <div class="col-12 md:col-6">
            <div class="cyber-card overflow-hidden">
              <!-- Main image -->
              <div class="product-image-wrapper" style="aspect-ratio: 4/3">
                <img v-if="activeImage" :src="activeImage" :alt="product.name" />
                <div v-else class="product-no-image">
                  <i class="pi pi-desktop" style="font-size: 5rem"></i>
                </div>
              </div>

              <!-- Thumbnails (only shown when there is more than one image) -->
              <div v-if="productImages.length > 1" class="flex gap-2 p-3 flex-wrap">
                <div
                  v-for="(url, idx) in productImages"
                  :key="idx"
                  class="product-thumb"
                  :class="{ 'product-thumb--active': activeImage === url }"
                  @click="activeImage = url"
                >
                  <img :src="url" :alt="`Image ${idx + 1}`" class="product-thumb-img" />
                </div>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="col-12 md:col-6">
            <div class="flex flex-column gap-3">
              <!-- Category & Condition -->
              <div class="flex gap-2 align-items-center">
                <Tag :value="product.category_name" severity="info" class="text-xs" />
                <Tag
                  :value="product.condition_type === 'new' ? 'Brand New' : 'Refurbished'"
                  :class="product.condition_type === 'new' ? 'tag-new' : 'tag-refurbished'"
                  class="text-xs"
                />
                <Tag :value="statusLabel" :class="statusClass" class="text-xs" />
              </div>

              <!-- Title -->
              <h1
                class="text-3xl font-bold"
                style="color: var(--inco-text-primary); line-height: 1.2"
              >
                {{ product.name }}
              </h1>

              <!-- Brand & Model -->
              <div class="text-sm" style="color: var(--inco-text-secondary)">
                {{ product.brand }} {{ product.model ? `• ${product.model}` : '' }}
              </div>

              <!-- Price -->
              <div class="flex align-items-center gap-2 flex-wrap">
                <span
                  class="font-bold"
                  style="color: var(--inco-primary-light); font-size: clamp(1.75rem, 4vw, 2.25rem)"
                >
                  Rs. {{ formatPrice(product.price) }}
                </span>
                <span
                  v-if="product.original_price && product.original_price > product.price"
                  class="text-xl line-through"
                  style="color: var(--inco-text-secondary)"
                >
                  Rs. {{ formatPrice(product.original_price) }}
                </span>
                <Tag
                  v-if="discountPercent > 0"
                  :value="`Save ${discountPercent}%`"
                  severity="danger"
                  class="font-bold"
                />
              </div>

              <!-- Description -->
              <p class="text-sm" style="color: var(--inco-text-secondary); line-height: 1.8">
                {{ product.description }}
              </p>

              <!-- Stock Info -->
              <!-- <div class="flex align-items-center gap-2">
                <i class="pi pi-box" style="color: var(--inco-primary-light)"></i>
                <span class="text-sm font-medium">
                  {{
                    product.quantity > 0 ? `${product.quantity} units available` : 'Out of stock'
                  }}
                </span>
              </div> -->

              <!-- Warranty -->
              <div v-if="product.warranty" class="flex align-items-center gap-2">
                <i class="pi pi-shield" style="color: #10b981"></i>
                <span class="text-sm font-medium">{{ product.warranty }}</span>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 mt-2">
                <Button
                  label="Contact to Purchase"
                  icon="pi pi-phone"
                  class="btn-cyber flex-1 py-3"
                  :disabled="product.status !== 'in_stock'"
                  @click="initiateCall"
                />
                <Button
                  icon="pi pi-heart"
                  class="p-button-outlined p-button-rounded py-3"
                  v-tooltip.top="'Add to Wishlist'"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Specifications -->
        <div v-if="specs.length" class="mt-6">
          <div class="cyber-card p-4">
            <h2 class="text-xl font-bold mb-4" style="color: var(--inco-text-primary)">
              <i class="pi pi-microchip mr-2" style="color: var(--inco-primary-light)"></i>
              Technical Specifications
            </h2>

            <div class="grid">
              <div v-for="spec in specs" :key="spec.label" class="col-12 sm:col-6 lg:col-4">
                <div
                  class="flex align-items-center gap-3 p-3 border-round mb-2"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--inco-surface-card) 60%,
                      var(--inco-surface-dark)
                    );
                    border: 1px solid var(--inco-border);
                  "
                >
                  <div
                    class="flex align-items-center justify-content-center"
                    style="
                      width: 40px;
                      height: 40px;
                      border-radius: 10px;
                      background: rgba(59, 130, 246, 0.12);
                    "
                  >
                    <i :class="spec.icon" style="color: var(--inco-primary-light)"></i>
                  </div>
                  <div>
                    <div class="text-xs" style="color: var(--inco-text-secondary)">
                      {{ spec.label }}
                    </div>
                    <div class="font-semibold text-sm" style="color: var(--inco-text-primary)">
                      {{ spec.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div v-if="product.related && product.related.length" class="mt-6">
          <h2 class="section-title text-2xl mb-4">Related Products</h2>
          <div class="grid">
            <div
              v-for="rp in product.related"
              :key="rp.id"
              class="col-12 sm:col-6 lg:col-3"
              style="display: flex"
            >
              <ProductCard :product="rp" />
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-8">
        <i
          class="pi pi-exclamation-circle text-5xl mb-3"
          style="color: var(--inco-text-secondary)"
        ></i>
        <h2 class="font-bold text-2xl mb-2" style="color: var(--inco-text-primary)">
          Product Not Found
        </h2>
        <p class="mb-4" style="color: var(--inco-text-secondary)">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <router-link to="/catalog">
          <Button label="Browse Catalog" icon="pi pi-arrow-left" class="btn-cyber" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { productAPI } from '@/api';
import ProductCard from '@/components/ProductCard.vue';
import { canonicalUrl, useSeoHead } from '@/composables/useSeoHead';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const activeImage = ref(null);

// All image URLs for this product (falls back to image_url for legacy records)
const productImages = computed(() => {
  if (!product.value) return [];
  if (Array.isArray(product.value.images) && product.value.images.length > 0) {
    return product.value.images;
  }
  return product.value.image_url ? [product.value.image_url] : [];
});

const statusLabel = computed(() => {
  if (!product.value) return '';
  const map = { in_stock: 'In Stock', out_of_stock: 'Out of Stock', sold: 'Sold' };
  return map[product.value.status] || '';
});

const statusClass = computed(() => {
  if (!product.value) return '';
  const map = { in_stock: 'tag-in-stock', out_of_stock: 'tag-out-of-stock', sold: 'tag-sold' };
  return map[product.value.status] || '';
});

const discountPercent = computed(() => {
  if (!product.value) return 0;
  if (product.value.original_price && product.value.original_price > product.value.price) {
    return Math.round((1 - product.value.price / product.value.original_price) * 100);
  }
  return 0;
});

const specs = computed(() => {
  if (!product.value) return [];
  const specMap = [
    { key: 'cpu', label: 'Processor', icon: 'pi pi-microchip' },
    { key: 'ram', label: 'Memory (RAM)', icon: 'pi pi-server' },
    { key: 'storage', label: 'Storage', icon: 'pi pi-database' },
    { key: 'gpu', label: 'Graphics Card', icon: 'pi pi-desktop' },
    { key: 'display_spec', label: 'Display', icon: 'pi pi-eye' },
    { key: 'os', label: 'Operating System', icon: 'pi pi-microsoft' },
    { key: 'battery', label: 'Battery', icon: 'pi pi-bolt' },
    { key: 'warranty', label: 'Warranty', icon: 'pi pi-shield' },
  ];
  return specMap
    .filter((s) => product.value[s.key])
    .map((s) => ({
      ...s,
      value: product.value[s.key],
    }));
});

function formatPrice(val) {
  return Number(val).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function initiateCall() {
  // Opens phone dialer on mobile, or shows tel: handler dialog on desktop
  window.location.href = 'tel:+94777402124';
}

async function loadProduct(slug) {
  loading.value = true;
  product.value = null;
  activeImage.value = null;
  try {
    const res = await productAPI.getOne(slug);
    product.value = res.data.data;

    // ── SEO: inject unique head tags for this product ──
    const p = product.value;
    const condition = p.condition_type === 'new' ? 'Brand New' : 'Refurbished';
    const priceStr = `Rs. ${Number(p.price).toLocaleString('en-LK')}`;
    useSeoHead({
      title: `${p.name} | ${condition} | Inco Tech Solutions`,
      description: p.description
        ? p.description.slice(0, 155)
        : `${condition} ${p.brand || ''} ${p.name} at ${priceStr}. Buy from Inco Tech Solutions — Sri Lanka's trusted computer store.`,
      canonical: canonicalUrl(`/product/${p.slug}`),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        description: p.description || '',
        image: p.image_url ? `https://incotechsolutions.com${p.image_url}` : undefined,
        brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'LKR',
          price: p.price,
          availability:
            p.status === 'in_stock'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          url: canonicalUrl(`/product/${p.slug}`),
          seller: { '@type': 'Organization', name: 'Inco Tech Solutions' },
        },
      },
    });

    // Set initial active image after product is loaded
    const imgs =
      Array.isArray(product.value.images) && product.value.images.length > 0
        ? product.value.images
        : product.value.image_url
          ? [product.value.image_url]
          : [];
    activeImage.value = imgs.length > 0 ? imgs[0] : null;
  } catch (err) {
    console.error('Failed to load product:', err);
    // ── SEO: noindex missing/deleted products (stops Soft 404) ──
    useSeoHead({ noindex: true });
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.params.slug,
  (slug) => {
    if (slug) loadProduct(slug);
  },
);

onMounted(() => {
  if (route.params.slug) loadProduct(route.params.slug);
});
</script>

<style scoped>
.product-thumb {
  width: 68px;
  height: 68px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s;
}

.product-thumb:hover {
  border-color: var(--inco-primary-light, #60a5fa);
}

.product-thumb--active {
  border-color: var(--inco-primary-light, #60a5fa);
}

.product-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
