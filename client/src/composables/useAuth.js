import { authAPI } from '@/api';
import { computed, ref } from 'vue';

const token = ref(localStorage.getItem('admin_token') || null);
const user = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'));

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isCashier = computed(() => user.value?.role === 'cashier');

  async function login(username, password) {
    const { data } = await authAPI.login({ username, password });
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    return data.user;
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isCashier,
    login,
    logout,
  };
}
