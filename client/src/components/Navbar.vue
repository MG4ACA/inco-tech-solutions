<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="section-container">
      <div class="flex align-items-center justify-content-between py-3">
        <!-- Logo -->
        <router-link to="/" class="flex align-items-center gap-2 no-underline">
          <i class="pi pi-desktop text-2xl" style="color: var(--inco-primary)"></i>
          <span class="text-xl font-bold" style="color: var(--inco-text-primary)">
            Inco
            <span style="color: var(--inco-primary)">Tech</span>
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex align-items-center gap-4">
          <router-link to="/" class="nav-link" active-class="nav-active">
            <i class="pi pi-home mr-1"></i>
            Home
          </router-link>
          <router-link to="/catalog" class="nav-link" active-class="nav-active">
            <i class="pi pi-shopping-bag mr-1"></i>
            Shop
          </router-link>
          <Button
            label="Repair My Device"
            icon="pi pi-wrench"
            class="btn-cyber"
            size="small"
            @click="$emit('openRepair')"
          />
          <router-link to="/admin" class="nav-link" active-class="nav-active">
            <i class="pi pi-cog mr-1"></i>
            Admin
          </router-link>
          <Button
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            class="p-button-text p-button-rounded"
            @click="$emit('toggleTheme')"
            v-tooltip.bottom="isDark ? 'Light Mode' : 'Dark Mode'"
          />
        </div>

        <!-- Mobile Menu Toggle -->
        <Button
          icon="pi pi-bars"
          class="md:hidden p-button-text"
          @click="mobileOpen = !mobileOpen"
        />
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-down">
        <div v-if="mobileOpen" class="md:hidden pb-4">
          <div class="flex flex-column gap-2">
            <router-link to="/" class="nav-link" @click="mobileOpen = false">
              <i class="pi pi-home mr-2"></i>
              Home
            </router-link>
            <router-link to="/catalog" class="nav-link" @click="mobileOpen = false">
              <i class="pi pi-shopping-bag mr-2"></i>
              Shop
            </router-link>
            <router-link to="/admin" class="nav-link" @click="mobileOpen = false">
              <i class="pi pi-cog mr-2"></i>
              Admin
            </router-link>
            <Button
              label="Repair My Device"
              icon="pi pi-wrench"
              class="btn-cyber mt-2"
              size="small"
              @click="
                mobileOpen = false;
                $emit('openRepair');
              "
            />
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import Button from 'primevue/button';
import { onMounted, onUnmounted, ref } from 'vue';

defineProps({
  isDark: Boolean,
});

defineEmits(['toggleTheme', 'openRepair']);

const isScrolled = ref(false);
const mobileOpen = ref(false);

function handleScroll() {
  isScrolled.value = window.scrollY > 20;
}

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
.nav-link {
  color: var(--inco-text-secondary);
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: var(--inco-transition);
  font-size: 0.95rem;
}

.nav-link:hover,
.nav-active {
  color: var(--inco-primary-light);
  background: rgba(59, 130, 246, 0.1);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
