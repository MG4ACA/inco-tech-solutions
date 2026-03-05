import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Auth Token Interceptor ───
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth API ───
export const authAPI = {
  login(credentials) {
    return api.post('/auth/login', credentials);
  },
  me() {
    return api.get('/auth/me');
  },
};

// ─── Products ───
export const productAPI = {
  getAll(params = {}) {
    return api.get('/products', { params });
  },
  getOne(idOrSlug) {
    return api.get(`/products/${idOrSlug}`);
  },
  create(formData) {
    return api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update(id, formData) {
    return api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete(id) {
    return api.delete(`/products/${id}`);
  },
  getBrands() {
    return api.get('/products/meta/brands');
  },
};

// ─── Categories ───
export const categoryAPI = {
  getAll() {
    return api.get('/categories');
  },
  getOne(id) {
    return api.get(`/categories/${id}`);
  },
  create(data) {
    return api.post('/categories', data);
  },
  update(id, data) {
    return api.put(`/categories/${id}`, data);
  },
  delete(id) {
    return api.delete(`/categories/${id}`);
  },
};

// ─── Repair Requests ───
export const repairAPI = {
  getAll(params = {}) {
    return api.get('/repairs', { params });
  },
  getOne(id) {
    return api.get(`/repairs/${id}`);
  },
  create(data) {
    return api.post('/repairs', data);
  },
  update(id, data) {
    return api.put(`/repairs/${id}`, data);
  },
  getStats() {
    return api.get('/repairs/meta/stats');
  },
};

// ─── Dashboard ───
export const dashboardAPI = {
  getStats() {
    return api.get('/dashboard/stats');
  },
};

export default api;
