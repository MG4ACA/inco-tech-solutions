<template>
  <div>
    <!-- Hero -->
    <HeroSection @open-repair="showRepair = true" />

    <!-- Featured Products -->
    <section class="py-6" style="background: var(--inco-surface-dark)">
      <div class="section-container">
        <div class="text-center mb-5">
          <h2 class="section-title">Featured Products</h2>
          <p class="section-subtitle">Hand-picked top deals on new and refurbished tech</p>
        </div>

        <div v-if="loading" class="grid">
          <div v-for="i in 4" :key="i" class="col-12 sm:col-6 lg:col-3">
            <ProductSkeleton />
          </div>
        </div>

        <div v-else class="grid">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="col-12 sm:col-6 lg:col-3"
          >
            <ProductCard :product="product" />
          </div>
        </div>

        <div class="text-center mt-5">
          <router-link to="/catalog">
            <Button
              label="View All Products"
              icon="pi pi-arrow-right"
              iconPos="right"
              class="btn-outline-cyber px-5 py-3"
            />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section
      class="py-6"
      style="background: linear-gradient(180deg, var(--inco-surface-dark), rgba(15, 23, 42, 0.95))"
    >
      <div class="section-container">
        <div class="text-center mb-5">
          <h2 class="section-title">Browse Categories</h2>
          <p class="section-subtitle">Find exactly what you need</p>
        </div>

        <div class="grid">
          <div v-for="cat in categories" :key="cat.id" class="col-12 sm:col-6 lg:col-3">
            <router-link
              :to="{ path: '/catalog', query: { category: cat.slug } }"
              class="no-underline"
            >
              <div class="cyber-card p-4 text-center h-full">
                <div class="flex justify-content-center mb-3">
                  <div
                    class="stat-icon"
                    style="
                      background: rgba(59, 130, 246, 0.15);
                      color: var(--inco-primary-light);
                      width: 60px;
                      height: 60px;
                      font-size: 1.5rem;
                    "
                  >
                    <i :class="cat.icon || 'pi pi-tag'"></i>
                  </div>
                </div>
                <h3 class="font-bold text-lg mb-2" style="color: var(--inco-text-primary)">
                  {{ cat.name }}
                </h3>
                <p class="text-sm mb-2" style="color: var(--inco-text-secondary)">
                  {{ cat.description }}
                </p>
                <Tag
                  :value="`${cat.product_count || 0} Products`"
                  severity="info"
                  class="text-xs"
                />
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-6" style="background: var(--inco-surface-dark)">
      <div class="section-container">
        <div class="text-center mb-5">
          <h2 class="section-title">Why Choose Inco Tech?</h2>
          <p class="section-subtitle">We go above and beyond for every customer</p>
        </div>

        <div class="grid">
          <div v-for="(feature, i) in features" :key="i" class="col-12 sm:col-6 lg:col-3">
            <div class="cyber-card p-4 text-center h-full">
              <div class="flex justify-content-center mb-3">
                <div
                  class="stat-icon"
                  :style="{
                    background: feature.bg,
                    color: feature.color,
                    width: '56px',
                    height: '56px',
                    fontSize: '1.4rem',
                  }"
                >
                  <i :class="feature.icon"></i>
                </div>
              </div>
              <h4 class="font-bold mb-2" style="color: var(--inco-text-primary)">
                {{ feature.title }}
              </h4>
              <p class="text-sm" style="color: var(--inco-text-secondary); line-height: 1.6">
                {{ feature.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-6"
      style="background: linear-gradient(135deg, rgba(0, 123, 255, 0.08), rgba(6, 182, 212, 0.05))"
    >
      <div class="section-container text-center">
        <h2 class="text-3xl font-bold mb-3" style="color: var(--inco-text-primary)">
          Need Your Device Fixed?
        </h2>
        <p
          class="text-lg mb-4"
          style="color: var(--inco-text-secondary); max-width: 600px; margin: 0 auto"
        >
          Our expert technicians can diagnose and repair laptops, desktops, and more. Book a free
          diagnostic assessment today!
        </p>
        <Button
          label="Book a Repair Now"
          icon="pi pi-wrench"
          class="btn-cyber px-5 py-3 text-lg"
          @click="showRepair = true"
        />
      </div>
    </section>

    <!-- Repair Dialog -->
    <RepairForm v-model="showRepair" />
  </div>
</template>

<script setup>
import { categoryAPI, productAPI } from '@/api';
import HeroSection from '@/components/HeroSection.vue';
import ProductCard from '@/components/ProductCard.vue';
import ProductSkeleton from '@/components/ProductSkeleton.vue';
import RepairForm from '@/components/RepairForm.vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { onMounted, ref } from 'vue';

const featuredProducts = ref([]);
const categories = ref([]);
const loading = ref(true);
const showRepair = ref(false);

const features = [
  {
    icon: 'pi pi-verified',
    title: 'Certified Quality',
    desc: 'Every product is tested and verified before reaching you. 100% quality assured.',
    bg: 'rgba(16, 185, 129, 0.15)',
    color: '#10b981',
  },
  {
    icon: 'pi pi-dollar',
    title: 'Best Prices',
    desc: 'Competitive pricing on new and refurbished devices with exclusive deals.',
    bg: 'rgba(59, 130, 246, 0.15)',
    color: '#3b82f6',
  },
  {
    icon: 'pi pi-wrench',
    title: 'Expert Repairs',
    desc: 'Professional diagnosis and repair by certified technicians with quick turnaround.',
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#f59e0b',
  },
  {
    icon: 'pi pi-shield',
    title: 'Warranty Included',
    desc: 'All products come with warranty. Your purchase is protected and guaranteed.',
    bg: 'rgba(139, 92, 246, 0.15)',
    color: '#8b5cf6',
  },
];

onMounted(async () => {
  try {
    const [prodRes, catRes] = await Promise.all([
      productAPI.getAll({ featured: 'true', limit: 4 }),
      categoryAPI.getAll(),
    ]);
    featuredProducts.value = prodRes.data.data;
    categories.value = catRes.data.data;
  } catch (err) {
    console.error('Failed to load home data:', err);
  } finally {
    loading.value = false;
  }
});
</script>
