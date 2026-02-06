<template>
  <div class="flex">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <!-- Logo -->
      <div class="px-4 py-3 mb-3" style="border-bottom: 1px solid var(--inco-border)">
        <router-link to="/" class="flex align-items-center gap-2 no-underline">
          <i class="pi pi-desktop text-xl" style="color: var(--inco-primary)"></i>
          <span class="sidebar-text font-bold text-lg" style="color: var(--inco-text-primary)">
            Inco
            <span style="color: var(--inco-primary)">Tech</span>
          </span>
        </router-link>
        <div class="sidebar-text text-xs mt-1" style="color: var(--inco-text-secondary)">
          Admin Panel
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex flex-column">
        <router-link
          v-for="item in menuItems"
          :key="item.route"
          :to="item.route"
          class="sidebar-link no-underline"
          :class="{ active: isActive(item.route) }"
        >
          <i :class="item.icon" class="text-lg"></i>
          <span class="sidebar-text">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Back to Site -->
      <div
        class="mt-auto px-3 py-4"
        style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          border-top: 1px solid var(--inco-border);
        "
      >
        <router-link to="/" class="sidebar-link no-underline">
          <i class="pi pi-arrow-left text-lg"></i>
          <span class="sidebar-text">Back to Site</span>
        </router-link>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="admin-content flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const menuItems = [
  { label: 'Dashboard', icon: 'pi pi-chart-bar', route: '/admin' },
  { label: 'Products', icon: 'pi pi-box', route: '/admin/products' },
  { label: 'Categories', icon: 'pi pi-tags', route: '/admin/categories' },
  { label: 'Repair Requests', icon: 'pi pi-wrench', route: '/admin/repairs' },
];

function isActive(path) {
  if (path === '/admin') return route.path === '/admin';
  return route.path.startsWith(path);
}
</script>
