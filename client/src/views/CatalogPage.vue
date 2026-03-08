<template>
  <div style="padding-top: 80px; min-height: 100vh; background: var(--inco-surface-dark)">
    <div class="section-container py-3">
      <!-- Header -->
      <div class="flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <!-- <h1 class="section-title text-3xl">Product Catalog</h1> -->
          <p class="section-subtitle mb-0">
            Showing {{ products.length }} of {{ totalProducts }} products
          </p>
        </div>
        <div class="flex gap-2 align-items-center">
          <Select
            v-model="sortBy"
            :options="sortOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Sort by"
            class="w-12rem"
          />
          <div
            class="flex border-round overflow-hidden"
            style="border: 1px solid var(--inco-border)"
          >
            <Button
              :icon="layout === 'grid' ? 'pi pi-th-large' : 'pi pi-th-large'"
              :class="layout === 'grid' ? '' : 'p-button-text'"
              size="small"
              @click="layout = 'grid'"
            />
            <Button
              icon="pi pi-list"
              :class="layout === 'list' ? '' : 'p-button-text'"
              size="small"
              @click="layout = 'list'"
            />
          </div>
        </div>
      </div>

      <div class="grid">
        <!-- Filters Sidebar -->
        <div class="col-12 lg:col-3">
          <div class="cyber-card p-4 sticky" style="top: 100px">
            <h3 class="font-bold text-lg mb-4" style="color: var(--inco-text-primary)">
              <i class="pi pi-filter mr-2" style="color: var(--inco-primary-light)"></i>
              Filters
            </h3>

            <!-- Search -->
            <div class="mb-4">
              <label class="font-semibold text-sm block mb-2">Search</label>
              <InputText
                v-model="filters.search"
                placeholder="Search products..."
                class="w-full"
                @input="debouncedFetch"
              />
            </div>

            <!-- Category Filter -->
            <div class="mb-4">
              <label class="font-semibold text-sm block mb-2">Category</label>
              <div class="flex flex-column gap-2">
                <div
                  v-for="cat in categories"
                  :key="cat.slug"
                  class="flex align-items-center gap-2 p-2 border-round cursor-pointer"
                  :style="
                    filters.category === cat.slug
                      ? 'background: rgba(59, 130, 246, 0.15); color: var(--inco-primary-light);'
                      : 'color: var(--inco-text-secondary);'
                  "
                  @click="toggleFilter('category', cat.slug)"
                >
                  <i :class="cat.icon || 'pi pi-tag'" class="text-sm"></i>
                  <span class="text-sm font-medium">{{ cat.name }}</span>
                  <Badge :value="cat.product_count || 0" class="ml-auto" severity="secondary" />
                </div>
              </div>
            </div>

            <!-- Condition Filter -->
            <div class="mb-4">
              <label class="font-semibold text-sm block mb-2">Condition</label>
              <div class="flex gap-2">
                <Tag
                  value="New"
                  class="cursor-pointer px-3 py-2"
                  :class="filters.condition === 'new' ? 'tag-new' : ''"
                  :severity="filters.condition === 'new' ? undefined : 'secondary'"
                  @click="toggleFilter('condition', 'new')"
                />
                <Tag
                  value="Refurbished"
                  class="cursor-pointer px-3 py-2"
                  :class="filters.condition === 'refurbished' ? 'tag-refurbished' : ''"
                  :severity="filters.condition === 'refurbished' ? undefined : 'secondary'"
                  @click="toggleFilter('condition', 'refurbished')"
                />
              </div>
            </div>

            <!-- Status Filter -->
            <div class="mb-4">
              <label class="font-semibold text-sm block mb-2">Availability</label>
              <div class="flex flex-wrap gap-2">
                <Tag
                  value="In Stock"
                  class="cursor-pointer px-3 py-2"
                  :class="filters.status === 'in_stock' ? 'tag-in-stock' : ''"
                  :severity="filters.status === 'in_stock' ? undefined : 'secondary'"
                  @click="toggleFilter('status', 'in_stock')"
                />
                <Tag
                  value="Out of Stock"
                  class="cursor-pointer px-3 py-2"
                  :class="filters.status === 'out_of_stock' ? 'tag-out-of-stock' : ''"
                  :severity="filters.status === 'out_of_stock' ? undefined : 'secondary'"
                  @click="toggleFilter('status', 'out_of_stock')"
                />
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-4">
              <label class="font-semibold text-sm block mb-2">Price Range</label>
              <div class="flex gap-2 align-items-center">
                <InputNumber
                  v-model="filters.min_price"
                  placeholder="Min"
                  mode="currency"
                  currency="LKR"
                  :min="0"
                  class="w-full"
                  inputClass="w-full"
                  @blur="fetchProducts"
                />
                <span style="color: var(--inco-text-secondary)">-</span>
                <InputNumber
                  v-model="filters.max_price"
                  placeholder="Max"
                  mode="currency"
                  currency="LKR"
                  :min="0"
                  class="w-full"
                  inputClass="w-full"
                  @blur="fetchProducts"
                />
              </div>
            </div>

            <!-- Clear Filters -->
            <Button
              label="Clear All Filters"
              icon="pi pi-filter-slash"
              class="w-full p-button-outlined p-button-sm"
              @click="clearFilters"
            />
          </div>
        </div>

        <!-- Products Grid -->
        <div class="col-12 lg:col-9">
          <!-- Loading -->
          <div v-if="loading" class="grid">
            <div v-for="i in 6" :key="i" class="col-12 sm:col-6 xl:col-4">
              <ProductSkeleton />
            </div>
          </div>

          <!-- Products -->
          <div v-else-if="products.length" class="grid">
            <div
              v-for="product in products"
              :key="product.id"
              :class="layout === 'grid' ? 'col-12 sm:col-6 xl:col-4' : 'col-12'"
              style="display: flex"
            >
              <ProductCard :product="product" />
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <i class="pi pi-search text-5xl mb-3" style="color: var(--inco-text-secondary)"></i>
            <h3 class="font-bold text-xl mb-2" style="color: var(--inco-text-primary)">
              No Products Found
            </h3>
            <p style="color: var(--inco-text-secondary)">
              Try adjusting your filters or search terms
            </p>
            <Button
              label="Clear Filters"
              icon="pi pi-filter-slash"
              class="mt-3 btn-outline-cyber"
              @click="clearFilters"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-content-center mt-5 gap-2">
            <Button
              icon="pi pi-chevron-left"
              class="p-button-outlined p-button-sm"
              :disabled="currentPage <= 1"
              @click="goToPage(currentPage - 1)"
            />
            <Button
              v-for="p in visiblePages"
              :key="p"
              :label="String(p)"
              class="p-button-sm"
              :class="p === currentPage ? '' : 'p-button-outlined'"
              @click="goToPage(p)"
            />
            <Button
              icon="pi pi-chevron-right"
              class="p-button-outlined p-button-sm"
              :disabled="currentPage >= totalPages"
              @click="goToPage(currentPage + 1)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { categoryAPI, productAPI } from '@/api';
import ProductCard from '@/components/ProductCard.vue';
import ProductSkeleton from '@/components/ProductSkeleton.vue';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const layout = ref('grid');
const currentPage = ref(1);
const totalProducts = ref(0);
const totalPages = ref(0);
const limit = 12;

const sortBy = ref('created_at:DESC');
const sortOptions = [
  { label: 'Newest First', value: 'created_at:DESC' },
  { label: 'Price: Low to High', value: 'price:ASC' },
  { label: 'Price: High to Low', value: 'price:DESC' },
  { label: 'Name A-Z', value: 'name:ASC' },
];

const filters = reactive({
  search: '',
  category: '',
  condition: '',
  status: '',
  min_price: null,
  max_price: null,
});

let debounceTimer = null;
function debouncedFetch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => fetchProducts(), 400);
}

function toggleFilter(key, value) {
  filters[key] = filters[key] === value ? '' : value;
  currentPage.value = 1;
  fetchProducts();
}

function clearFilters() {
  Object.assign(filters, {
    search: '',
    category: '',
    condition: '',
    status: '',
    min_price: null,
    max_price: null,
  });
  currentPage.value = 1;
  fetchProducts();
}

async function fetchProducts() {
  loading.value = true;
  try {
    const [sort, order] = sortBy.value.split(':');
    const params = {
      page: currentPage.value,
      limit,
      sort,
      order,
      ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== undefined),
      ),
    };

    const res = await productAPI.getAll(params);
    products.value = res.data.data;
    totalProducts.value = res.data.pagination.total;
    totalPages.value = res.data.pagination.pages;
  } catch (err) {
    console.error('Failed to fetch products:', err);
  } finally {
    loading.value = false;
  }
}

function goToPage(page) {
  currentPage.value = page;
  fetchProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

watch(sortBy, () => {
  currentPage.value = 1;
  fetchProducts();
});

onMounted(async () => {
  // Read initial filters from query params
  if (route.query.category) filters.category = route.query.category;
  if (route.query.condition) filters.condition = route.query.condition;
  if (route.query.search) filters.search = route.query.search;

  try {
    const catRes = await categoryAPI.getAll();
    categories.value = catRes.data.data;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }

  fetchProducts();
});
</script>
