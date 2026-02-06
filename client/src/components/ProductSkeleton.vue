<template>
  <div class="cyber-card">
    <div class="skeleton-shimmer" style="height: 200px; width: 100%"></div>
    <div class="p-3 flex flex-column gap-2">
      <Skeleton width="40%" height="0.75rem" />
      <Skeleton width="90%" height="1.1rem" />
      <Skeleton width="60%" height="0.75rem" />
      <div class="flex gap-1 mt-1">
        <Skeleton width="60px" height="1.5rem" borderRadius="16px" />
        <Skeleton width="50px" height="1.5rem" borderRadius="16px" />
        <Skeleton width="55px" height="1.5rem" borderRadius="16px" />
      </div>
      <div class="flex justify-content-between align-items-center mt-2">
        <Skeleton width="100px" height="1.5rem" />
        <Skeleton shape="circle" size="2rem" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
</script>
