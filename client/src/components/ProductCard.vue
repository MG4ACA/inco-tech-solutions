<template>
  <div class="cyber-card cursor-pointer card-equal-height" @click="goToProduct">
    <!-- Image -->
    <div class="product-image-wrapper">
      <img v-if="product.image_url" :src="product.image_url" :alt="product.name" loading="lazy" />
      <div v-else class="product-no-image">
        <i class="pi pi-desktop"></i>
      </div>

      <!-- Badges -->
      <div class="absolute top-0 left-0 p-2 flex flex-column gap-1">
        <Tag
          :value="product.condition_type === 'new' ? 'Brand New' : 'Refurbished'"
          :class="product.condition_type === 'new' ? 'tag-new' : 'tag-refurbished'"
          class="font-semibold text-xs"
        />
        <Tag
          v-if="product.featured"
          value="⭐ Featured"
          style="background: rgba(99, 102, 241, 0.9)"
          class="font-semibold text-xs"
        />
      </div>

      <!-- Stock Badge -->
      <div class="absolute top-0 right-0 p-2">
        <Tag :value="statusLabel" :class="statusClass" class="font-semibold text-xs" />
      </div>

      <!-- Discount Badge -->
      <div v-if="discountPercent > 0" class="absolute bottom-0 right-0 p-2">
        <Tag :value="`-${discountPercent}%`" severity="danger" class="font-bold" />
      </div>
    </div>

    <!-- Content -->
    <div class="p-3 card-content">
      <!-- Category -->
      <div class="text-xs font-medium mb-1" style="color: var(--inco-primary-light)">
        {{ product.category_name || 'Uncategorized' }}
      </div>

      <!-- Title -->
      <h3 class="text-base font-bold mb-1 line-clamp-2" style="color: var(--inco-text-primary)">
        {{ product.name }}
      </h3>

      <!-- Brand & Model -->
      <div class="text-xs mb-2" style="color: var(--inco-text-secondary)">
        {{ product.brand }} {{ product.model ? `• ${product.model}` : '' }}
      </div>

      <!-- Key Specs -->
      <div v-if="product.cpu || product.ram || product.storage" class="flex flex-wrap gap-1">
        <Tag v-if="product.cpu" :value="product.cpu" severity="secondary" class="text-xs" />
        <Tag v-if="product.ram" :value="product.ram" severity="secondary" class="text-xs" />
        <Tag v-if="product.storage" :value="product.storage" severity="secondary" class="text-xs" />
      </div>

      <!-- Price -->
      <div class="flex align-items-center justify-content-between mt-auto">
        <div>
          <span class="text-xl font-bold" style="color: var(--inco-primary-light)">
            Rs. {{ formatPrice(product.price) }}
          </span>
          <span
            v-if="product.original_price && product.original_price > product.price"
            class="text-sm ml-2 line-through"
            style="color: var(--inco-text-secondary)"
          >
            Rs. {{ formatPrice(product.original_price) }}
          </span>
        </div>
        <Button
          icon="pi pi-arrow-right"
          class="p-button-rounded p-button-text p-button-sm"
          v-tooltip.top="'View Details'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const statusLabel = computed(() => {
  const map = { in_stock: 'In Stock', out_of_stock: 'Out of Stock', sold: 'Sold' };
  return map[props.product.status] || props.product.status;
});

const statusClass = computed(() => {
  const map = { in_stock: 'tag-in-stock', out_of_stock: 'tag-out-of-stock', sold: 'tag-sold' };
  return map[props.product.status] || '';
});

const discountPercent = computed(() => {
  if (props.product.original_price && props.product.original_price > props.product.price) {
    return Math.round((1 - props.product.price / props.product.original_price) * 100);
  }
  return 0;
});

function formatPrice(val) {
  return Number(val).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function goToProduct() {
  router.push({ name: 'ProductDetail', params: { slug: props.product.slug } });
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Equal-height card layout */
.card-equal-height {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Push price row to the bottom regardless of how many spec tags exist */
.card-content .flex.align-items-center.justify-content-between {
  margin-top: auto;
  padding-top: 0.5rem;
}
</style>
