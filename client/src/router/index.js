import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: () => import('@/views/CatalogPage.vue'),
  },
  {
    path: '/product/:slug',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue'),
    props: true,
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/ProductManagement.vue'),
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/CategoryManagement.vue'),
      },
      {
        path: 'repairs',
        name: 'AdminRepairs',
        component: () => import('@/views/admin/RepairRequests.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/HomePage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

export default router;
