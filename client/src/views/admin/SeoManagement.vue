<template>
  <div class="p-4">
    <!-- Page Header -->
    <div class="flex align-items-center justify-content-between mb-5">
      <div>
        <h1 class="text-2xl font-bold m-0" style="color: var(--inco-text-primary)">
          <i class="pi pi-globe mr-2" style="color: var(--inco-primary-light)" />
          SEO Manager
        </h1>
        <p class="text-sm mt-1 m-0" style="color: var(--inco-text-secondary)">
          Manage corridor city metadata, JSON-LD schema, and FAQ payloads
        </p>
      </div>
      <div class="flex gap-2">
        <Button
          label="Add City"
          icon="pi pi-plus"
          class="btn-cyber"
          @click="openAddDialog"
        />
      </div>
    </div>

    <!-- City Cards Grid -->
    <div v-if="listLoading" class="grid">
      <div v-for="i in 4" :key="i" class="col-12 md:col-6 lg:col-4">
        <Skeleton height="9rem" borderRadius="12px" />
      </div>
    </div>

    <div v-else class="grid">
      <div
        v-for="city in seededCities"
        :key="city.city_slug"
        class="col-12 md:col-6 lg:col-4"
      >
        <div class="cyber-card p-4 h-full city-card">
          <div class="flex align-items-center justify-content-between mb-3">
            <div class="flex align-items-center gap-2">
              <div class="stat-icon" style="background: rgba(59,130,246,0.15); color: var(--inco-primary-light); width: 40px; height: 40px; font-size: 1rem">
                <i class="pi pi-map-marker" />
              </div>
              <div>
                <p class="font-bold m-0 capitalize" style="color: var(--inco-text-primary)">
                  {{ city.city_slug }}
                </p>
                <p class="text-xs m-0" style="color: var(--inco-text-secondary)">
                  Updated {{ formatDate(city.updated_at) }}
                </p>
              </div>
            </div>
            <div class="flex gap-1">
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                size="small"
                @click="openEditDialog(city.city_slug)"
                v-tooltip.top="'Edit'"
              />
              <Button
                icon="pi pi-eye"
                severity="info"
                text
                rounded
                size="small"
                @click="previewCity(city.city_slug)"
                v-tooltip.top="'Preview JSON-LD'"
              />
              <Button
                icon="pi pi-external-link"
                text
                rounded
                size="small"
                @click="openLivePage(city.city_slug)"
                v-tooltip.top="'View Live Page'"
              />
            </div>
          </div>
          <p class="text-xs m-0 truncate-2" style="color: var(--inco-text-secondary)">
            {{ city.page_title }}
          </p>
        </div>
      </div>

      <!-- Unseeded cities -->
      <div
        v-for="city in unseededCities"
        :key="city.slug"
        class="col-12 md:col-6 lg:col-4"
      >
        <div class="cyber-card p-4 h-full city-card city-card--empty">
          <div class="flex align-items-center gap-2 mb-2">
            <div class="stat-icon" style="background: rgba(245,158,11,0.1); color: #f59e0b; width: 40px; height: 40px; font-size: 1rem">
              <i class="pi pi-exclamation-triangle" />
            </div>
            <p class="font-bold m-0 capitalize" style="color: var(--inco-text-secondary)">
              {{ city.label }}
            </p>
          </div>
          <p class="text-xs mb-3" style="color: var(--inco-text-secondary)">
            Not yet seeded in database
          </p>
          <Button
            label="Add Now"
            icon="pi pi-plus"
            size="small"
            severity="warning"
            outlined
            @click="openAddDialogForCity(city.slug)"
          />
        </div>
      </div>
    </div>

    <!-- ── Add / Edit Dialog ──────────────────────────────────── -->
    <Dialog
      v-model:visible="formVisible"
      :header="editMode ? `Edit — ${form.citySlug}` : 'Add City SEO Entity'"
      :modal="true"
      :style="{ width: '860px', maxWidth: '98vw' }"
      :draggable="false"
    >
      <div class="grid">
        <!-- Left: Form Fields -->
        <div class="col-12 lg:col-6">
          <div class="flex flex-column gap-3">

            <!-- City Slug -->
            <div class="flex flex-column gap-1">
              <label class="text-sm font-semibold" style="color: var(--inco-text-primary)">
                City Slug <span style="color: #ef4444">*</span>
              </label>
              <Dropdown
                v-model="form.citySlug"
                :options="corridorCities"
                optionLabel="label"
                optionValue="slug"
                placeholder="Select a city"
                :disabled="editMode"
                class="w-full"
              />
            </div>

            <!-- Canonical URL -->
            <div class="flex flex-column gap-1">
              <label class="text-sm font-semibold" style="color: var(--inco-text-primary)">
                Canonical URL <span style="color: #ef4444">*</span>
              </label>
              <InputText
                v-model="form.canonicalUrl"
                placeholder="https://incotechsolutions.lk/repair/galle"
                class="w-full"
              />
            </div>

            <!-- Page Title -->
            <div class="flex flex-column gap-1">
              <label class="text-sm font-semibold" style="color: var(--inco-text-primary)">
                Page Title <span style="color: #ef4444">*</span>
              </label>
              <InputText
                v-model="form.pageTitle"
                placeholder="Computer & Laptop Repair in Galle | Inco Tech Solutions"
                class="w-full"
              />
              <small :class="form.pageTitle.length > 65 ? 'text-red-400' : 'text-400'">
                {{ form.pageTitle.length }}/65 chars
              </small>
            </div>

            <!-- Meta Description -->
            <div class="flex flex-column gap-1">
              <label class="text-sm font-semibold" style="color: var(--inco-text-primary)">
                Meta Description <span style="color: #ef4444">*</span>
              </label>
              <Textarea
                v-model="form.metaDesc"
                rows="3"
                placeholder="Professional computer repair in Galle..."
                class="w-full"
                auto-resize
              />
              <small :class="form.metaDesc.length > 160 ? 'text-red-400' : 'text-400'">
                {{ form.metaDesc.length }}/160 chars
              </small>
            </div>

            <!-- FAQ Payload -->
            <div class="flex flex-column gap-1">
              <label class="text-sm font-semibold" style="color: var(--inco-text-primary)">
                FAQ Payload (JSON Array)
              </label>
              <Textarea
                v-model="form.faqRaw"
                rows="5"
                placeholder='[{"question":"...","answer":"..."}]'
                class="w-full font-mono text-sm"
                auto-resize
              />
              <small v-if="faqError" class="text-red-400">{{ faqError }}</small>
            </div>

          </div>
        </div>

        <!-- Right: JSON-LD Editor + Live Preview -->
        <div class="col-12 lg:col-6">
          <div class="flex flex-column gap-3 h-full">

            <div class="flex align-items-center justify-content-between">
              <label class="text-sm font-semibold" style="color: var(--inco-text-primary)">
                JSON-LD Schema <span style="color: #ef4444">*</span>
              </label>
              <div class="flex gap-2">
                <Button
                  label="Auto-Generate"
                  icon="pi pi-magic"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="autoGenerateJsonLd"
                />
                <Button
                  label="Preview"
                  icon="pi pi-eye"
                  size="small"
                  class="btn-cyber"
                  @click="showPreview = !showPreview"
                />
              </div>
            </div>

            <!-- JSON-LD Raw Editor -->
            <Textarea
              v-if="!showPreview"
              v-model="form.jsonLdRaw"
              rows="18"
              class="w-full font-mono text-xs"
              style="resize: vertical; min-height: 300px"
              placeholder='{"@context":"https://schema.org","@type":"LocalBusiness",...}'
              @input="validateJsonLd"
            />

            <!-- Schema Previewer -->
            <div
              v-else
              class="schema-preview"
              style="min-height: 300px; max-height: 420px; overflow-y: auto"
            >
              <div
                v-if="jsonLdError"
                class="p-3 border-round"
                style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3)"
              >
                <i class="pi pi-times-circle text-red-400 mr-2" />
                <span class="text-sm text-red-400">{{ jsonLdError }}</span>
              </div>
              <div v-else>
                <div class="flex align-items-center gap-2 mb-3">
                  <i class="pi pi-check-circle text-xl" style="color: #10b981" />
                  <span class="text-sm font-semibold" style="color: #10b981">Valid JSON-LD</span>
                </div>

                <!-- Structured preview cards -->
                <div
                  v-if="parsedJsonLd"
                  class="flex flex-column gap-2"
                >
                  <div
                    v-for="(val, key) in flatPreview"
                    :key="key"
                    class="preview-row"
                  >
                    <span class="preview-key">{{ key }}</span>
                    <span class="preview-val">{{ val }}</span>
                  </div>
                </div>

                <!-- Raw JSON display -->
                <pre class="schema-raw mt-3">{{ prettyJsonLd }}</pre>
              </div>
            </div>

            <small v-if="jsonLdError && !showPreview" class="text-red-400">
              {{ jsonLdError }}
            </small>

          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button label="Cancel" severity="secondary" outlined @click="formVisible = false" />
          <Button
            :label="editMode ? 'Update' : 'Save'"
            icon="pi pi-save"
            class="btn-cyber"
            :loading="saveLoading"
            :disabled="!!jsonLdError || !!faqError"
            @click="saveEntity"
          />
        </div>
      </template>
    </Dialog>

    <!-- ── JSON-LD Quick Preview Dialog ──────────────────────── -->
    <Dialog
      v-model:visible="previewVisible"
      header="JSON-LD Schema Preview"
      :modal="true"
      :style="{ width: '700px', maxWidth: '98vw' }"
    >
      <div v-if="previewData">
        <div class="flex align-items-center gap-2 mb-3">
          <i class="pi pi-check-circle text-xl" style="color: #10b981" />
          <span class="font-bold" style="color: var(--inco-text-primary)">
            {{ previewData.citySlug }} — LocalBusiness Schema
          </span>
        </div>

        <div class="grid mb-3">
          <div class="col-12 sm:col-6">
            <div class="p-3 border-round" style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2)">
              <p class="text-xs font-bold mb-1" style="color: var(--inco-primary-light)">LATITUDE</p>
              <p class="font-mono m-0" style="color: var(--inco-text-primary)">
                {{ previewData.jsonLd?.geo?.latitude ?? 'N/A' }}
              </p>
            </div>
          </div>
          <div class="col-12 sm:col-6">
            <div class="p-3 border-round" style="background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.2)">
              <p class="text-xs font-bold mb-1" style="color: #06b6d4">LONGITUDE</p>
              <p class="font-mono m-0" style="color: var(--inco-text-primary)">
                {{ previewData.jsonLd?.geo?.longitude ?? 'N/A' }}
              </p>
            </div>
          </div>
          <div class="col-12 mt-2">
            <div class="p-3 border-round" style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2)">
              <p class="text-xs font-bold mb-1" style="color: #10b981">AREA SERVED</p>
              <p class="font-mono m-0 capitalize" style="color: var(--inco-text-primary)">
                {{ previewData.jsonLd?.areaServed?.name ?? previewData.citySlug }}
              </p>
            </div>
          </div>
        </div>

        <pre class="schema-raw" style="max-height: 320px; overflow-y: auto">{{ JSON.stringify(previewData.jsonLd, null, 2) }}</pre>
      </div>
      <div v-else class="text-center py-4">
        <ProgressSpinner style="width: 40px; height: 40px" />
      </div>
    </Dialog>

  </div>
</template>

<script setup>
import api from '@/api';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
import Skeleton from 'primevue/skeleton';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, reactive, ref } from 'vue';

const toast = useToast();

// ── State ───────────────────────────────────────────────────────
const listLoading   = ref(true);
const saveLoading   = ref(false);
const formVisible   = ref(false);
const previewVisible = ref(false);
const editMode      = ref(false);
const showPreview   = ref(false);
const jsonLdError   = ref('');
const faqError      = ref('');
const seededCities  = ref([]);
const corridor      = ref([]);
const previewData   = ref(null);

const corridorCities = [
  { slug: 'matara',      label: 'Matara' },
  { slug: 'weligama',    label: 'Weligama' },
  { slug: 'galle',       label: 'Galle' },
  { slug: 'hikkaduwa',   label: 'Hikkaduwa' },
  { slug: 'ambalangoda', label: 'Ambalangoda' },
  { slug: 'bentota',     label: 'Bentota' },
  { slug: 'aluthgama',   label: 'Aluthgama' },
  { slug: 'kalutara',    label: 'Kalutara' },
  { slug: 'panadura',    label: 'Panadura' },
  { slug: 'colombo',     label: 'Colombo' },
];

const form = reactive({
  citySlug:     '',
  canonicalUrl: '',
  pageTitle:    '',
  metaDesc:     '',
  jsonLdRaw:    '',
  faqRaw:       '',
});

// ── Computed ────────────────────────────────────────────────────
const seededSlugs = computed(() => new Set(seededCities.value.map((c) => c.city_slug)));

const unseededCities = computed(() =>
  corridorCities.filter((c) => !seededSlugs.value.has(c.slug)),
);

const parsedJsonLd = computed(() => {
  try {
    return JSON.parse(form.jsonLdRaw);
  } catch {
    return null;
  }
});

const prettyJsonLd = computed(() => {
  if (!parsedJsonLd.value) return '';
  return JSON.stringify(parsedJsonLd.value, null, 2);
});

const flatPreview = computed(() => {
  const obj = parsedJsonLd.value;
  if (!obj) return {};
  return {
    '@type':       obj['@type'] ?? '—',
    'name':        obj.name ?? '—',
    'addressLocality': obj.address?.addressLocality ?? '—',
    'postalCode':  obj.address?.postalCode ?? '—',
    'latitude':    obj.geo?.latitude ?? '—',
    'longitude':   obj.geo?.longitude ?? '—',
    'areaServed':  obj.areaServed?.name ?? '—',
    'priceRange':  obj.priceRange ?? '—',
  };
});

// ── Lifecycle ────────────────────────────────────────────────────
onMounted(fetchList);

async function fetchList() {
  try {
    listLoading.value = true;
    const res = await api.get('/seo');
    seededCities.value  = res.data.seeded || [];
    corridor.value       = res.data.corridor || [];
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load SEO city list', life: 3000 });
  } finally {
    listLoading.value = false;
  }
}

// ── Dialog controls ─────────────────────────────────────────────
function openAddDialog() {
  resetForm();
  editMode.value   = false;
  formVisible.value = true;
}

function openAddDialogForCity(slug) {
  resetForm();
  form.citySlug     = slug;
  form.canonicalUrl = `https://incotechsolutions.lk/repair/${slug}`;
  editMode.value    = false;
  formVisible.value = true;
  autoGenerateJsonLd();
}

async function openEditDialog(slug) {
  resetForm();
  editMode.value = true;
  try {
    const res = await api.get(`/seo/${slug}`);
    const d = res.data.data;
    form.citySlug     = d.citySlug;
    form.canonicalUrl = d.canonicalUrl;
    form.pageTitle    = d.pageTitle;
    form.metaDesc     = d.metaDesc;
    form.jsonLdRaw    = JSON.stringify(d.jsonLd, null, 2);
    form.faqRaw       = JSON.stringify(d.faqPayload, null, 2);
    formVisible.value = true;
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load city data', life: 3000 });
  }
}

async function previewCity(slug) {
  previewData.value   = null;
  previewVisible.value = true;
  try {
    const res = await api.get(`/seo/${slug}`);
    previewData.value = res.data.data;
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load preview data', life: 3000 });
    previewVisible.value = false;
  }
}

function openLivePage(slug) {
  window.open(`/repair/${slug}`, '_blank');
}

function resetForm() {
  Object.assign(form, { citySlug: '', canonicalUrl: '', pageTitle: '', metaDesc: '', jsonLdRaw: '', faqRaw: '' });
  jsonLdError.value = '';
  faqError.value    = '';
  showPreview.value = false;
}

// ── Validation ───────────────────────────────────────────────────
function validateJsonLd() {
  if (!form.jsonLdRaw.trim()) { jsonLdError.value = ''; return; }
  try {
    JSON.parse(form.jsonLdRaw);
    jsonLdError.value = '';
  } catch (e) {
    jsonLdError.value = `Invalid JSON: ${e.message}`;
  }
}

// ── Auto-generate skeleton JSON-LD ──────────────────────────────
const cityGeo = {
  matara:      { lat: 5.9549,  lng: 80.5550, postal: '81000', region: 'Southern Province' },
  weligama:    { lat: 5.9752,  lng: 80.4297, postal: '81700', region: 'Southern Province' },
  galle:       { lat: 6.0535,  lng: 80.2210, postal: '80000', region: 'Southern Province' },
  hikkaduwa:   { lat: 6.1395,  lng: 80.1067, postal: '80240', region: 'Southern Province' },
  ambalangoda: { lat: 6.2336,  lng: 80.0573, postal: '80300', region: 'Southern Province' },
  bentota:     { lat: 6.4248,  lng: 79.9966, postal: '80500', region: 'Southern Province' },
  aluthgama:   { lat: 6.4329,  lng: 79.9942, postal: '12080', region: 'Western Province' },
  kalutara:    { lat: 6.5854,  lng: 79.9607, postal: '12000', region: 'Western Province' },
  panadura:    { lat: 6.7131,  lng: 79.9056, postal: '12500', region: 'Western Province' },
  colombo:     { lat: 6.9271,  lng: 79.8612, postal: '00300', region: 'Western Province' },
};

function autoGenerateJsonLd() {
  const slug = form.citySlug;
  if (!slug) { toast.add({ severity: 'warn', summary: 'Select a city first', life: 2000 }); return; }
  const geo   = cityGeo[slug] ?? { lat: 0, lng: 0, postal: '', region: '' };
  const label = corridorCities.find((c) => c.slug === slug)?.label ?? slug;
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'LocalBusiness',
    name:       `Inco Tech Solutions — ${label}`,
    image:      'https://incotechsolutions.lk/og-image.jpg',
    url:        form.canonicalUrl || `https://incotechsolutions.lk/repair/${slug}`,
    telephone:  '+94-XX-XXXXXXX',
    address: {
      '@type':         'PostalAddress',
      streetAddress:   'Main Street',
      addressLocality: label,
      addressRegion:   geo.region,
      postalCode:      geo.postal,
      addressCountry:  'LK',
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:   geo.lat,
      longitude:  geo.lng,
    },
    areaServed: { '@type': 'City', name: label },
    priceRange: 'LKR 500 – LKR 25000',
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '18:00' },
    ],
    sameAs: ['https://www.facebook.com/incotechsolutions'],
  };
  form.jsonLdRaw  = JSON.stringify(schema, null, 2);
  jsonLdError.value = '';
}

// ── Save ─────────────────────────────────────────────────────────
async function saveEntity() {
  validateJsonLd();
  if (jsonLdError.value) return;

  // Validate FAQ JSON
  let parsedFaq = [];
  if (form.faqRaw.trim()) {
    try {
      parsedFaq = JSON.parse(form.faqRaw);
      faqError.value = '';
    } catch (e) {
      faqError.value = `Invalid FAQ JSON: ${e.message}`;
      return;
    }
  }

  try {
    saveLoading.value = true;
    await api.post('/seo', {
        citySlug:     form.citySlug,
        canonicalUrl: form.canonicalUrl,
        pageTitle:    form.pageTitle,
        metaDesc:     form.metaDesc,
        jsonLd:       JSON.parse(form.jsonLdRaw),
        faqPayload:   parsedFaq,
      });
    toast.add({ severity: 'success', summary: 'Saved!', detail: `SEO entity for "${form.citySlug}" updated.`, life: 3000 });
    formVisible.value = false;
    fetchList();
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Save Failed', detail: err.response?.data?.message || 'Server error', life: 4000 });
  } finally {
    saveLoading.value = false;
  }
}

// ── Helpers ──────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>

<style scoped>
.city-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.city-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.12);
}
.city-card--empty {
  border-color: rgba(245, 158, 11, 0.25) !important;
  opacity: 0.85;
}

.schema-raw {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.72rem;
  color: #a5f3fc;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
  line-height: 1.5;
}

.schema-preview {
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
}

.preview-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.preview-key {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--inco-primary-light);
  min-width: 130px;
  font-family: monospace;
}
.preview-val {
  font-size: 0.8rem;
  color: var(--inco-text-primary);
  word-break: break-all;
}

.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
