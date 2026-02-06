import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// PrimeVue
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import Ripple from 'primevue/ripple';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

// Styles
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './assets/styles/main.css';

// ─── Custom Aura Preset for Inco Tech ───
const IncoPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    colorScheme: {
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
    },
  },
});

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: IncoPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.app-dark',
      cssLayer: false,
    },
  },
  ripple: true,
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(DialogService);

app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);

app.mount('#app');
