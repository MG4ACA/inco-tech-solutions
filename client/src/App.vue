<template>
  <div class="app-container" :class="{ 'app-dark': isDark }">
    <Toast position="top-right" />
    <ConfirmDialog />
    <Navbar v-if="!isAdminRoute" @toggle-theme="toggleTheme" :is-dark="isDark" />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/Navbar.vue';
import { useTheme } from '@/composables/useTheme';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { isDark, toggleTheme } = useTheme();

const isAdminRoute = computed(() => route.path.startsWith('/admin'));
</script>

<style scoped>
.main-content {
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
