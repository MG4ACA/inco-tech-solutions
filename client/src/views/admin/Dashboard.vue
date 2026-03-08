<template>
  <div>
    <h1 class="text-3xl font-bold mb-1" style="color: var(--inco-text-primary)">Dashboard</h1>
    <p class="mb-5" style="color: var(--inco-text-secondary)">Overview of your store performance</p>

    <!-- Stats Cards -->
    <div v-if="loading" class="grid mb-5">
      <div v-for="i in 4" :key="i" class="col-12 sm:col-6 lg:col-3">
        <div class="stat-card">
          <Skeleton width="60%" height="1rem" class="mb-2" />
          <Skeleton width="40%" height="2rem" />
        </div>
      </div>
    </div>

    <div v-else class="grid mb-5">
      <div v-for="(stat, i) in statCards" :key="i" class="col-12 sm:col-6 lg:col-3">
        <div class="stat-card">
          <div class="flex justify-content-between align-items-start">
            <div>
              <div class="text-sm font-medium mb-2" style="color: var(--inco-text-secondary)">
                {{ stat.label }}
              </div>
              <div class="text-3xl font-bold" style="color: var(--inco-text-primary)">
                {{ stat.value }}
              </div>
            </div>
            <div class="stat-icon" :style="{ background: stat.bg, color: stat.color }">
              <i :class="stat.icon"></i>
            </div>
          </div>
          <div class="mt-3 text-xs" style="color: var(--inco-text-secondary)">{{ stat.hint }}</div>
        </div>
      </div>
    </div>

    <!-- Secondary Stats -->
    <div class="grid">
      <div class="col-12 lg:col-8">
        <div class="cyber-card p-4">
          <h3 class="font-bold text-lg mb-4" style="color: var(--inco-text-primary)">
            <i class="pi pi-chart-bar mr-2" style="color: var(--inco-primary-light)"></i>
            Inventory Overview
          </h3>
          <div class="grid">
            <div v-for="(inv, i) in inventoryStats" :key="i" class="col-12 sm:col-4">
              <div
                class="text-center p-3 border-round"
                style="
                  background: color-mix(
                    in srgb,
                    var(--inco-surface-card) 60%,
                    var(--inco-surface-dark)
                  );
                "
              >
                <div class="text-2xl font-bold mb-1" :style="{ color: inv.color }">
                  {{ inv.value }}
                </div>
                <div class="text-sm" style="color: var(--inco-text-secondary)">{{ inv.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-4">
        <div class="cyber-card p-4 h-full">
          <h3 class="font-bold text-lg mb-4" style="color: var(--inco-text-primary)">
            <i class="pi pi-bolt mr-2" style="color: #f59e0b"></i>
            Quick Actions
          </h3>
          <div class="flex flex-column gap-2">
            <router-link to="/admin/products">
              <Button
                label="Add New Product"
                icon="pi pi-plus"
                class="w-full btn-cyber"
                size="small"
              />
            </router-link>
            <router-link to="/admin/categories">
              <Button
                label="Manage Categories"
                icon="pi pi-tags"
                class="w-full p-button-outlined"
                size="small"
              />
            </router-link>
            <router-link to="/admin/repairs">
              <Button
                label="View Repair Requests"
                icon="pi pi-wrench"
                class="w-full p-button-outlined"
                size="small"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dashboardAPI } from '@/api';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const toast = useToast();

const loading = ref(true);
const stats = ref({});

const statCards = computed(() => [
  {
    label: 'Total Products',
    value: stats.value.totalProducts || 0,
    icon: 'pi pi-box',
    bg: 'rgba(59, 130, 246, 0.15)',
    color: '#3b82f6',
    hint: 'Across all categories',
  },
  {
    label: 'Categories',
    value: stats.value.totalCategories || 0,
    icon: 'pi pi-tags',
    bg: 'rgba(139, 92, 246, 0.15)',
    color: '#8b5cf6',
    hint: 'Active product categories',
  },
  {
    label: 'Repair Requests',
    value: stats.value.totalRepairs || 0,
    icon: 'pi pi-wrench',
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#f59e0b',
    hint: `${stats.value.pendingRepairs || 0} pending`,
  },
  {
    label: 'Inventory Value',
    value: `LKR${Number(stats.value.inventoryValue || 0).toLocaleString()}`,
    icon: 'pi pi-dollar',
    bg: 'rgba(16, 185, 129, 0.15)',
    color: '#10b981',
    hint: 'Total stock value',
  },
]);

const inventoryStats = computed(() => [
  { label: 'In Stock', value: stats.value.inStock || 0, color: '#10b981' },
  { label: 'Out of Stock', value: stats.value.outOfStock || 0, color: '#ef4444' },
  { label: 'Sold', value: stats.value.sold || 0, color: '#8b5cf6' },
]);

onMounted(async () => {
  try {
    const res = await dashboardAPI.getStats();
    stats.value = res.data.data;
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Failed to Load',
      detail: err?.response?.data?.message || 'Could not load dashboard stats.',
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
});
</script>
