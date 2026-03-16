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

      <!-- User Info -->
      <div
        class="sidebar-text px-4 py-2 mb-2 flex align-items-center gap-2"
        style="border-bottom: 1px solid var(--inco-border)"
      >
        <i class="pi pi-user text-sm" style="color: var(--inco-primary-light)"></i>
        <div>
          <div class="text-sm font-semibold" style="color: var(--inco-text-primary)">
            {{ user?.username }}
          </div>
          <div class="text-xs capitalize" style="color: var(--inco-text-secondary)">
            {{ user?.role }}
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex flex-column">
        <router-link
          v-for="item in visibleMenuItems"
          :key="item.route"
          :to="item.route"
          class="sidebar-link no-underline"
          :class="{ active: isActive(item.route) }"
        >
          <i :class="item.icon" class="text-lg"></i>
          <span class="sidebar-text">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Bottom actions -->
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
        <router-link to="/" class="sidebar-link no-underline mb-1">
          <i class="pi pi-arrow-left text-lg"></i>
          <span class="sidebar-text">Back to Site</span>
        </router-link>
        <button
          class="sidebar-link w-full text-left border-none bg-transparent cursor-pointer"
          @click="handleLogout"
        >
          <i class="pi pi-sign-out text-lg" style="color: #ff6b6b"></i>
          <span class="sidebar-text" style="color: #ff6b6b">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="admin-content flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { user, isAdmin, logout } = useAuth();

const allMenuItems = [
  { label: 'Dashboard',      icon: 'pi pi-chart-bar', route: '/admin',          adminOnly: true  },
  { label: 'Products',       icon: 'pi pi-box',        route: '/admin/products', adminOnly: false },
  { label: 'Categories',     icon: 'pi pi-tags',       route: '/admin/categories', adminOnly: true },
  { label: 'Repair Requests',icon: 'pi pi-wrench',     route: '/admin/repairs',  adminOnly: false },
  { label: 'SEO Manager',    icon: 'pi pi-globe',      route: '/admin/seo',      adminOnly: true  },
];

const visibleMenuItems = computed(() =>
  allMenuItems.filter((item) => !item.adminOnly || isAdmin.value),
);

function isActive(path) {
  if (path === '/admin') return route.path === '/admin';
  return route.path.startsWith(path);
}

function handleLogout() {
  logout();
  router.push('/admin/login');
}
</script>
