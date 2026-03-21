<template>
  <div class="admin-page-container">
    <!-- Header -->
    <div class="flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="text-2xl font-bold m-0" style="color: var(--inco-text-primary)">
          Hero Settings
        </h1>
        <p class="text-sm mt-1 mb-0" style="color: var(--inco-text-secondary)">
          Manage the images and labels shown in the home page hero section
        </p>
      </div>
      <Button
        label="Save Changes"
        icon="pi pi-save"
        class="btn-cyber"
        :loading="saving"
        @click="saveSettings"
      />
    </div>

    <div
      v-if="loading"
      class="flex justify-content-center align-items-center"
      style="height: 300px"
    >
      <i class="pi pi-spin pi-spinner text-4xl" style="color: var(--inco-primary)"></i>
    </div>

    <div v-else class="grid">
      <!-- Main Hero Image -->
      <div class="col-12">
        <div class="admin-card p-4 mb-3">
          <h3 class="text-lg font-semibold mb-3 mt-0" style="color: var(--inco-text-primary)">
            <i class="pi pi-image mr-2" style="color: var(--inco-primary)"></i>
            Main Hero Image
          </h3>
          <div class="flex align-items-start gap-4 flex-wrap">
            <!-- Preview -->
            <div class="hero-img-preview-main">
              <img
                :src="resolveUrl(previews.main || form.hero_main_image_url)"
                alt="Main hero preview"
                class="hero-img-preview-img"
              />
              <div class="hero-img-preview-label">Current</div>
            </div>
            <!-- Controls -->
            <div class="flex flex-column gap-3 flex-1" style="min-width: 260px">
              <div>
                <label
                  class="block text-sm font-medium mb-1"
                  style="color: var(--inco-text-secondary)"
                >
                  Upload new image
                </label>
                <input
                  id="main-upload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="(e) => onFileChange(e, 'main')"
                />
                <label for="main-upload" class="upload-btn cursor-pointer">
                  <i class="pi pi-upload mr-2"></i>
                  Choose File
                </label>
                <span
                  v-if="files.main"
                  class="ml-3 text-sm"
                  style="color: var(--inco-primary-light)"
                >
                  {{ files.main.name }}
                </span>
              </div>
              <div>
                <label
                  class="block text-sm font-medium mb-1"
                  style="color: var(--inco-text-secondary)"
                >
                  Or paste image URL
                </label>
                <InputText
                  v-model="form.hero_main_image_url"
                  placeholder="https://..."
                  class="w-full"
                  :disabled="!!files.main"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 1 -->
      <div class="col-12 md:col-6">
        <div class="admin-card p-4 mb-3">
          <h3 class="text-lg font-semibold mb-3 mt-0" style="color: var(--inco-text-primary)">
            <i class="pi pi-window-maximize mr-2" style="color: #f59e0b"></i>
            Floating Card 1
            <span class="text-sm font-normal" style="color: var(--inco-text-secondary)">
              (top right)
            </span>
          </h3>
          <div class="flex align-items-start gap-3 flex-wrap">
            <div class="hero-img-preview-card">
              <img
                :src="resolveUrl(previews.card1 || form.hero_card1_image_url)"
                alt="Card 1 preview"
                class="hero-img-preview-img"
              />
            </div>
            <div class="flex flex-column gap-3 flex-1" style="min-width: 200px">
              <div>
                <label
                  class="block text-sm font-medium mb-1"
                  style="color: var(--inco-text-secondary)"
                >
                  Upload image
                </label>
                <input
                  id="card1-upload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="(e) => onFileChange(e, 'card1')"
                />
                <label for="card1-upload" class="upload-btn cursor-pointer">
                  <i class="pi pi-upload mr-2"></i>
                  Choose File
                </label>
                <span
                  v-if="files.card1"
                  class="block text-sm mt-1"
                  style="color: var(--inco-primary-light)"
                >
                  {{ files.card1.name }}
                </span>
              </div>
              <div>
                <label
                  class="block text-sm font-medium mb-1"
                  style="color: var(--inco-text-secondary)"
                >
                  Or paste URL
                </label>
                <InputText
                  v-model="form.hero_card1_image_url"
                  placeholder="https://..."
                  class="w-full"
                  :disabled="!!files.card1"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium mb-1"
                  style="color: var(--inco-text-secondary)"
                >
                  Label
                </label>
                <InputText
                  v-model="form.hero_card1_label"
                  placeholder="e.g. ThinkPad X1"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="col-12 md:col-6">
        <div class="admin-card p-4 mb-3">
          <h3 class="text-lg font-semibold mb-3 mt-0" style="color: var(--inco-text-primary)">
            <i class="pi pi-window-maximize mr-2" style="color: #06b6d4"></i>
            Floating Card 2
            <span class="text-sm font-normal" style="color: var(--inco-text-secondary)">
              (bottom left)
            </span>
          </h3>
          <div class="flex align-items-start gap-3 flex-wrap">
            <div class="hero-img-preview-card">
              <img
                :src="resolveUrl(previews.card2 || form.hero_card2_image_url)"
                alt="Card 2 preview"
                class="hero-img-preview-img"
              />
            </div>
            <div class="flex flex-column gap-3 flex-1" style="min-width: 200px">
              <div>
                <label
                  class="block text-sm font-medium mb-1"
                  style="color: var(--inco-text-secondary)"
                >
                  Upload image
                </label>
                <input
                  id="card2-upload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="(e) => onFileChange(e, 'card2')"
                />
                <label for="card2-upload" class="upload-btn cursor-pointer">
                  <i class="pi pi-upload mr-2"></i>
                  Choose File
                </label>
                <span
                  v-if="files.card2"
                  class="block text-sm mt-1"
                  style="color: var(--inco-primary-light)"
                >
                  {{ files.card2.name }}
                </span>
              </div>
              <div>
                <label
                  class="block text-sm font-medium mb-1"
                  style="color: var(--inco-text-secondary)"
                >
                  Or paste URL
                </label>
                <InputText
                  v-model="form.hero_card2_image_url"
                  placeholder="https://..."
                  class="w-full"
                  :disabled="!!files.card2"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium mb-1"
                  style="color: var(--inco-text-secondary)"
                >
                  Label
                </label>
                <InputText
                  v-model="form.hero_card2_label"
                  placeholder="e.g. MacBook Pro"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Live preview hint -->
      <div class="col-12">
        <div
          class="flex align-items-center gap-2 p-3 border-round"
          style="background: rgba(59, 130, 246, 0.07); border: 1px solid rgba(59, 130, 246, 0.18)"
        >
          <i class="pi pi-info-circle" style="color: var(--inco-primary-light)"></i>
          <span class="text-sm" style="color: var(--inco-text-secondary)">
            After saving, the hero section on the home page will immediately show the updated
            images.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { settingsAPI } from '@/api';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';

const toast = useToast();
const loading = ref(true);
const saving = ref(false);

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const form = reactive({
  hero_main_image_url: '',
  hero_card1_image_url: '',
  hero_card1_label: '',
  hero_card2_image_url: '',
  hero_card2_label: '',
});

// local blob previews for newly selected files
const previews = reactive({ main: null, card1: null, card2: null });
const files = reactive({ main: null, card1: null, card2: null });

function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url}`;
}

function onFileChange(event, slot) {
  const file = event.target.files[0];
  if (!file) return;
  files[slot] = file;
  previews[slot] = URL.createObjectURL(file);
}

async function loadSettings() {
  try {
    const res = await settingsAPI.getHero();
    const data = res.data.data;
    form.hero_main_image_url = data.hero_main_image_url || '';
    form.hero_card1_image_url = data.hero_card1_image_url || '';
    form.hero_card1_label = data.hero_card1_label || '';
    form.hero_card2_image_url = data.hero_card2_image_url || '';
    form.hero_card2_label = data.hero_card2_label || '';
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load hero settings',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

async function saveSettings() {
  saving.value = true;
  try {
    const fd = new FormData();
    // Append uploaded files
    if (files.main) fd.append('hero_main_image', files.main);
    if (files.card1) fd.append('hero_card1_image', files.card1);
    if (files.card2) fd.append('hero_card2_image', files.card2);

    // Append URL fields (only used when no file uploaded for that slot)
    if (!files.main) fd.append('hero_main_image_url', form.hero_main_image_url);
    if (!files.card1) fd.append('hero_card1_image_url', form.hero_card1_image_url);
    if (!files.card2) fd.append('hero_card2_image_url', form.hero_card2_image_url);

    fd.append('hero_card1_label', form.hero_card1_label);
    fd.append('hero_card2_label', form.hero_card2_label);

    const res = await settingsAPI.updateHero(fd);
    const data = res.data.data;

    // Refresh form with saved values
    form.hero_main_image_url = data.hero_main_image_url || '';
    form.hero_card1_image_url = data.hero_card1_image_url || '';
    form.hero_card1_label = data.hero_card1_label || '';
    form.hero_card2_image_url = data.hero_card2_image_url || '';
    form.hero_card2_label = data.hero_card2_label || '';

    // Clear file selections
    files.main = files.card1 = files.card2 = null;
    previews.main = previews.card1 = previews.card2 = null;

    toast.add({
      severity: 'success',
      summary: 'Saved',
      detail: 'Hero settings updated!',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save hero settings',
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
}

onMounted(loadSettings);
</script>

<style scoped>
.admin-page-container {
  padding: 1.5rem;
}

.admin-card {
  background: var(--inco-surface);
  border: 1px solid var(--inco-border);
  border-radius: 12px;
}

.hidden {
  display: none;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: var(--inco-primary-light);
  background: rgba(59, 130, 246, 0.08);
  font-size: 0.875rem;
  font-weight: 500;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.upload-btn:hover {
  background: rgba(59, 130, 246, 0.16);
  border-color: rgba(59, 130, 246, 0.6);
}

/* Image preview containers */
.hero-img-preview-main {
  position: relative;
  width: 220px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--inco-border);
}

.hero-img-preview-card {
  position: relative;
  width: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--inco-border);
}

.hero-img-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  min-height: 70px;
}

.hero-img-preview-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2px 6px;
  font-size: 0.65rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
}
</style>
