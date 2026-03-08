<template>
  <div class="login-page">
    <div class="login-card cyber-card">
      <!-- Logo -->
      <div class="text-center mb-5">
        <div class="flex align-items-center justify-content-center gap-2 mb-2">
          <i class="pi pi-desktop text-3xl" style="color: var(--inco-primary)"></i>
          <span class="text-2xl font-bold" style="color: var(--inco-text-primary)">
            Inco
            <span style="color: var(--inco-primary)">Tech</span>
          </span>
        </div>
        <p class="text-sm" style="color: var(--inco-text-secondary)">Admin Panel — Sign In</p>
      </div>

      <!-- Error -->
      <Message v-if="errorMsg" severity="error" class="mb-4" :closable="false">
        {{ errorMsg }}
      </Message>

      <!-- Form -->
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="font-semibold text-sm block mb-2" style="color: var(--inco-text-primary)">
            Username
          </label>
          <InputText
            v-model="form.username"
            placeholder="Enter username"
            class="w-full"
            autocomplete="username"
            :disabled="loading"
            required
          />
        </div>

        <div class="mb-5">
          <label class="font-semibold text-sm block mb-2" style="color: var(--inco-text-primary)">
            Password
          </label>
          <Password
            v-model="form.password"
            placeholder="Enter password"
            :feedback="false"
            toggleMask
            inputClass="w-full"
            class="w-full"
            autocomplete="current-password"
            :disabled="loading"
            required
          />
        </div>

        <Button
          type="submit"
          label="Sign In"
          icon="pi pi-sign-in"
          class="w-full"
          :loading="loading"
        />
      </form>

      <div class="text-center mt-4">
        <router-link to="/" class="text-sm no-underline" style="color: var(--inco-primary-light)">
          <i class="pi pi-arrow-left mr-1"></i>
          Back to Site
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();

const form = ref({ username: '', password: '' });
const loading = ref(false);
const errorMsg = ref(
  route.query.reason === 'session_expired' ? 'Your session has expired. Please sign in again.' : '',
);

async function handleLogin() {
  errorMsg.value = '';
  loading.value = true;
  try {
    await login(form.value.username, form.value.password);
    router.push('/admin');
  } catch (err) {
    errorMsg.value =
      err?.response?.data?.message || 'Login failed. Check your credentials and try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--inco-bg-primary);
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
}
</style>
