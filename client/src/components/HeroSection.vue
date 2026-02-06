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
          <div class="float-animation" style="position: relative">
            <!-- Decorative Laptop Shape -->
            <div
              class="pulse-glow"
              style="
                width: 400px;
                height: 280px;
                background: linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.8));
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 1rem;
              "
            >
              <i class="pi pi-desktop" style="font-size: 4rem; color: var(--inco-primary)"></i>
              <span class="font-bold text-xl" style="color: var(--inco-text-primary)">
                Inco Tech Solutions
              </span>
              <span class="text-sm" style="color: var(--inco-text-secondary)">
                Retail • Repair • Refurbish
              </span>

              <!-- Floating Badges -->
              <div style="position: absolute; top: -15px; right: -15px">
                <Tag value="New Arrivals" severity="success" class="font-bold" />
              </div>
              <div style="position: absolute; bottom: -15px; left: -15px">
                <Tag value="Expert Repairs" severity="info" class="font-bold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Button from 'primevue/button';
import Tag from 'primevue/tag';

defineEmits(['openRepair']);
</script>
