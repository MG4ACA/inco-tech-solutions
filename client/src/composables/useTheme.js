import { ref, watch } from 'vue';

const isDark = ref(true);

export function useTheme() {
  // Initialize from localStorage or default to dark
  const stored = localStorage.getItem('inco-theme');
  isDark.value = stored ? stored === 'dark' : true;
  applyTheme();

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value;
    localStorage.setItem('inco-theme', isDark.value ? 'dark' : 'light');
    applyTheme();
  }

  watch(isDark, applyTheme);

  return { isDark, toggleTheme };
}
