<template>
  <section class="hero-section">
    <div class="hero-grid-bg"></div>
    <div class="section-container" style="position: relative; z-index: 1; width: 100%">
      <div class="grid align-items-center">
        <!-- Left Content -->
        <div class="col-12 lg:col-6">
          <div class="slide-up">
            <Tag
              value="🚀 Premium Tech Solutions"
              class="mb-3"
              style="
                background: rgba(59, 130, 246, 0.15);
                color: var(--inco-primary-light);
                border: 1px solid rgba(59, 130, 246, 0.3);
              "
            />

            <h1 class="text-5xl lg:text-7xl font-bold mb-4" style="line-height: 1.1">
              Your Tech,
              <span
                class="block"
                style="
                  background: linear-gradient(135deg, #007bff, #06b6d4);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                "
              >
                Our Expertise
              </span>
            </h1>

            <p
              class="text-lg mb-5"
              style="color: var(--inco-text-secondary); max-width: 500px; line-height: 1.7"
            >
              Premium new &amp; refurbished laptops, accessories, and expert repair services.
              Experience cutting-edge tech at competitive prices.
            </p>

            <div class="flex flex-wrap gap-3 mb-5">
              <router-link to="/catalog">
                <Button
                  label="Shop Now"
                  icon="pi pi-shopping-cart"
                  class="btn-cyber px-5 py-3 text-lg"
                />
              </router-link>
              <Button
                label="Repair My Device"
                icon="pi pi-wrench"
                class="btn-outline-cyber px-5 py-3 text-lg"
                @click="$emit('openRepair')"
              />
            </div>

            <!-- Quick Stats -->
            <div class="flex flex-wrap gap-4 mt-4">
              <div class="flex align-items-center gap-2">
                <div
                  class="flex align-items-center justify-content-center"
                  style="
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: rgba(16, 185, 129, 0.15);
                  "
                >
                  <i class="pi pi-check-circle" style="color: #10b981"></i>
                </div>
                <div>
                  <div class="font-bold text-sm">500+</div>
                  <div class="text-xs" style="color: var(--inco-text-secondary)">Products</div>
                </div>
              </div>
              <div class="flex align-items-center gap-2">
                <div
                  class="flex align-items-center justify-content-center"
                  style="
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: rgba(59, 130, 246, 0.15);
                  "
                >
                  <i class="pi pi-wrench" style="color: #3b82f6"></i>
                </div>
                <div>
                  <div class="font-bold text-sm">2000+</div>
                  <div class="text-xs" style="color: var(--inco-text-secondary)">Repairs Done</div>
                </div>
              </div>
              <div class="flex align-items-center gap-2">
                <div
                  class="flex align-items-center justify-content-center"
                  style="
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: rgba(245, 158, 11, 0.15);
                  "
                >
                  <i class="pi pi-star-fill" style="color: #f59e0b"></i>
                </div>
                <div>
                  <div class="font-bold text-sm">4.9/5</div>
                  <div class="text-xs" style="color: var(--inco-text-secondary)">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Visual -->
        <div class="col-12 lg:col-6 hidden lg:flex justify-content-center">
          <div class="hero-visual-container">
            <!-- Main Featured Image -->
            <div class="hero-main-image float-animation">
              <img :src="heroImages.main" alt="Premium Laptop" class="hero-laptop-img" />
              <!-- Glow ring behind image -->
              <div class="hero-glow-ring"></div>
            </div>

            <!-- Floating Product Cards -->
            <div class="hero-float-card hero-float-card-1">
              <img :src="heroImages.card1" alt="Card 1" class="hero-float-img" />
              <div class="hero-float-info">
                <span class="hero-float-name">{{ heroLabels.card1 }}</span>
              </div>
            </div>

            <div class="hero-float-card hero-float-card-2">
              <img :src="heroImages.card2" alt="Card 2" class="hero-float-img" />
              <div class="hero-float-info">
                <span class="hero-float-name">{{ heroLabels.card2 }}</span>
              </div>
            </div>

            <!-- Floating Badges -->
            <div class="hero-badge hero-badge-top">
              <i class="pi pi-bolt" style="color: #f59e0b"></i>
              <span>New Arrivals</span>
            </div>

            <div class="hero-badge hero-badge-bottom">
              <i class="pi pi-wrench" style="color: #06b6d4"></i>
              <span>Expert Repairs</span>
            </div>

            <!-- Stats Pill -->
            <!-- <div class="hero-stats-pill">
              <div class="hero-stats-dot"></div>
              <span>14 Products In Stock</span>
            </div> -->

            <!-- Decorative Circles -->
            <div class="hero-deco-circle hero-deco-1"></div>
            <div class="hero-deco-circle hero-deco-2"></div>
            <div class="hero-deco-circle hero-deco-3"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { settingsAPI } from '@/api';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { onMounted, reactive } from 'vue';

defineEmits(['openRepair']);

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULTS = {
  main: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=350&fit=crop&q=80',
  card1: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120&h=80&fit=crop&q=80',
  card2: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120&h=80&fit=crop&q=80',
};

function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url}`;
}

const heroImages = reactive({
  main: DEFAULTS.main,
  card1: DEFAULTS.card1,
  card2: DEFAULTS.card2,
});

const heroLabels = reactive({
  card1: 'ThinkPad X1',
  card2: 'MacBook Pro',
});

onMounted(async () => {
  try {
    const res = await settingsAPI.getHero();
    const d = res.data.data;
    if (d.hero_main_image_url) heroImages.main = resolveUrl(d.hero_main_image_url);
    if (d.hero_card1_image_url) heroImages.card1 = resolveUrl(d.hero_card1_image_url);
    if (d.hero_card2_image_url) heroImages.card2 = resolveUrl(d.hero_card2_image_url);
    if (d.hero_card1_label) heroLabels.card1 = d.hero_card1_label;
    if (d.hero_card2_label) heroLabels.card2 = d.hero_card2_label;
  } catch {
    // silently fall back to defaults
  }
});
</script>

<style scoped>
/* ─── Hero Visual Container ─── */
.hero-visual-container {
  position: relative;
  width: 520px;
  height: 440px;
}

/* ─── Main Image ─── */
.hero-main-image {
  position: relative;
  width: 420px;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  margin: 40px auto 0;
  z-index: 2;
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(0, 123, 255, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.hero-laptop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.hero-main-image:hover .hero-laptop-img {
  transform: scale(1.05);
}

.hero-glow-ring {
  position: absolute;
  inset: -3px;
  border-radius: 22px;
  background: linear-gradient(
    135deg,
    rgba(0, 123, 255, 0.4),
    rgba(6, 182, 212, 0.4),
    rgba(99, 102, 241, 0.3)
  );
  z-index: -1;
  filter: blur(8px);
  opacity: 0.6;
  animation: pulse-glow 3s ease-in-out infinite;
}

/* ─── Floating Product Cards ─── */
.hero-float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 14px;
  padding: 8px 12px;
  z-index: 3;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hero-float-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0, 123, 255, 0.2);
}

.hero-float-card-1 {
  top: 15px;
  right: -10px;
  animation: float-card-1 4s ease-in-out infinite;
}

.hero-float-card-2 {
  bottom: 30px;
  left: -20px;
  animation: float-card-2 5s ease-in-out infinite;
}

.hero-float-img {
  width: 60px;
  height: 42px;
  border-radius: 8px;
  object-fit: cover;
}

.hero-float-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero-float-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--inco-text-primary);
}

.hero-float-price {
  font-size: 0.85rem;
  font-weight: 700;
  background: linear-gradient(135deg, #007bff, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Floating Badges ─── */
.hero-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
  z-index: 3;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.hero-badge span {
  color: var(--inco-text-primary);
}

.hero-badge-top {
  top: 0;
  left: 20px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
  border: 1px solid rgba(245, 158, 11, 0.3);
  animation: float-card-2 4.5s ease-in-out infinite;
}

.hero-badge-bottom {
  bottom: 5px;
  right: 10px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(6, 182, 212, 0.05));
  border: 1px solid rgba(6, 182, 212, 0.3);
  animation: float-card-1 5.5s ease-in-out infinite;
}

/* ─── Stats Pill ─── */
.hero-stats-pill {
  position: absolute;
  bottom: 70px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #10b981;
  z-index: 3;
  backdrop-filter: blur(10px);
}

.hero-stats-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: dot-pulse 1.5s ease-in-out infinite;
}

/* ─── Decorative Circles ─── */
.hero-deco-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(59, 130, 246, 0.15);
  pointer-events: none;
}

.hero-deco-1 {
  width: 500px;
  height: 500px;
  top: -40px;
  left: -30px;
  opacity: 0.3;
}

.hero-deco-2 {
  width: 350px;
  height: 350px;
  top: 30px;
  left: 50px;
  border-color: rgba(6, 182, 212, 0.12);
  opacity: 0.4;
}

.hero-deco-3 {
  width: 200px;
  height: 200px;
  top: 100px;
  left: 130px;
  border-color: rgba(99, 102, 241, 0.1);
  opacity: 0.5;
}

/* ─── Animations ─── */
@keyframes float-card-1 {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes float-card-2 {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes dot-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.7);
  }
}
</style>

<!-- Light mode overrides (unscoped so :root selector works) -->
<style>
:root:not(.app-dark) .hero-main-image {
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.12),
    0 0 40px rgba(37, 99, 235, 0.08);
  border-color: rgba(37, 99, 235, 0.2);
}

:root:not(.app-dark) .hero-glow-ring {
  background: linear-gradient(
    135deg,
    rgba(37, 99, 235, 0.2),
    rgba(6, 182, 212, 0.2),
    rgba(99, 102, 241, 0.15)
  );
  opacity: 0.35;
}

:root:not(.app-dark) .hero-float-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.97), rgba(248, 250, 252, 0.97));
  border-color: rgba(226, 232, 240, 0.8);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

:root:not(.app-dark) .hero-float-card:hover {
  box-shadow:
    0 15px 40px rgba(37, 99, 235, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.06);
}

:root:not(.app-dark) .hero-badge-top {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.03));
  border-color: rgba(245, 158, 11, 0.25);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

:root:not(.app-dark) .hero-badge-bottom {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.03));
  border-color: rgba(6, 182, 212, 0.25);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

:root:not(.app-dark) .hero-stats-pill {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

:root:not(.app-dark) .hero-deco-circle {
  border-color: rgba(37, 99, 235, 0.1);
}

:root:not(.app-dark) .hero-deco-2 {
  border-color: rgba(6, 182, 212, 0.08);
}

:root:not(.app-dark) .hero-deco-3 {
  border-color: rgba(99, 102, 241, 0.06);
}
</style>
