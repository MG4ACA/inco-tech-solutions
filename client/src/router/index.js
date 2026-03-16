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
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/AdminLogin.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { requiresAuth: true, adminOnly: true },
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/ProductManagement.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/CategoryManagement.vue'),
        meta: { requiresAuth: true, adminOnly: true },
      },
      {
        path: 'repairs',
        name: 'AdminRepairs',
        component: () => import('@/views/admin/RepairRequests.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'seo',
        name: 'AdminSeo',
        component: () => import('@/views/admin/SeoManagement.vue'),
        meta: { requiresAuth: true, adminOnly: true },
      },
    ],
  },
  // ─── SEO / AEO / GEO Discovery Pages ───
  {
    path: '/repair/:city',
    name: 'DiscoveryPage',
    component: () => import('@/views/DiscoveryPage.vue'),
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

// ─── Navigation Guard ───
router.beforeEach((to, _from, next) => {
  if (!to.meta.requiresAuth) return next();

  const token = localStorage.getItem('admin_token');
  const user = JSON.parse(localStorage.getItem('admin_user') || 'null');

  if (!token || !user) {
    return next({ name: 'AdminLogin' });
  }

  // Cashier cannot access admin-only pages
  if (to.meta.adminOnly && user.role !== 'admin') {
    return next({ name: 'AdminProducts' });
  }

  next();
});

export default router;
