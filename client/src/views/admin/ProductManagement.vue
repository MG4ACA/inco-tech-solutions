<template>
  <div>
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="text-3xl font-bold mb-1" style="color: var(--inco-text-primary)">
          Product Management
        </h1>
        <p style="color: var(--inco-text-secondary)">Manage your product inventory</p>
      </div>
      <Button label="Add Product" icon="pi pi-plus" class="btn-cyber" @click="openNew" />
    </div>

    <!-- Data Table -->
    <div class="cyber-card">
      <DataTable
        :value="products"
        :loading="loading"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        dataKey="id"
        filterDisplay="row"
        v-model:filters="tableFilters"
        stripedRows
        removableSort
        class="p-datatable-sm"
      >
        <template #header>
          <div class="flex flex-wrap justify-content-between gap-2">
            <span class="text-lg font-bold" style="color: var(--inco-text-primary)">Products</span>
            <InputText
              v-model="tableFilters['global'].value"
              placeholder="Search products..."
              class="w-20rem"
            />
          </div>
        </template>

        <template #empty>
          <div class="text-center py-5" style="color: var(--inco-text-secondary)">
            No products found.
          </div>
        </template>

        <Column field="image_url" header="Image" style="width: 80px">
          <template #body="{ data }">
            <div
              style="
                width: 50px;
                height: 50px;
                border-radius: 8px;
                overflow: hidden;
                background: var(--inco-secondary);
              "
              class="flex align-items-center justify-content-center"
            >
              <img
                v-if="data.image_url"
                :src="data.image_url"
                :alt="data.name"
                style="width: 100%; height: 100%; object-fit: cover"
              />
              <i v-else class="pi pi-desktop" style="color: var(--inco-text-secondary)"></i>
            </div>
          </template>
        </Column>

        <Column field="name" header="Product Name" sortable style="min-width: 200px">
          <template #body="{ data }">
            <div>
              <div class="font-semibold" style="color: var(--inco-text-primary)">
                {{ data.name }}
              </div>
              <div class="text-xs" style="color: var(--inco-text-secondary)">
                {{ data.brand }} {{ data.model }}
              </div>
            </div>
          </template>
        </Column>

        <Column field="category_name" header="Category" sortable>
          <template #body="{ data }">
            <Tag :value="data.category_name || 'N/A'" severity="info" class="text-xs" />
          </template>
        </Column>

        <Column field="condition_type" header="Condition" sortable style="width: 120px">
          <template #body="{ data }">
            <Tag
              :value="data.condition_type === 'new' ? 'New' : 'Refurbished'"
              :class="data.condition_type === 'new' ? 'tag-new' : 'tag-refurbished'"
              class="text-xs"
            />
          </template>
        </Column>

        <Column field="price" header="Price" sortable style="width: 120px">
          <template #body="{ data }">
            <span class="font-bold" style="color: var(--inco-primary-light)">
              Rs. {{ formatPrice(data.price) }}
            </span>
          </template>
        </Column>

        <Column field="quantity" header="Qty" sortable style="width: 80px">
          <template #body="{ data }">
            <span :style="{ color: data.quantity > 0 ? '#10b981' : '#ef4444' }" class="font-bold">
              {{ data.quantity }}
            </span>
          </template>
        </Column>

        <Column field="status" header="Status" style="width: 150px">
          <template #body="{ data }">
            <Select
              v-model="data.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full p-inputtext-sm"
              @change="updateStatus(data)"
            />
          </template>
        </Column>

        <Column field="featured" header="Featured" style="width: 90px">
          <template #body="{ data }">
            <InputSwitch v-model="data.featured" @change="toggleFeatured(data)" />
          </template>
        </Column>

        <Column header="Actions" style="width: 120px">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text p-button-sm"
                @click="editProduct(data)"
                v-tooltip.top="'Edit'"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-danger p-button-sm"
                @click="confirmDelete(data)"
                v-tooltip.top="'Delete'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Product Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="isEditing ? 'Edit Product' : 'Add New Product'"
      :modal="true"
      :style="{ width: '700px' }"
      :breakpoints="{ '768px': '95vw' }"
    >
      <form @submit.prevent="saveProduct" class="grid gap-3 mt-2">
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">Product Name *</label>
          <InputText v-model="form.name" class="w-full" placeholder="Product name" required />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">Category *</label>
          <Select
            v-model="form.category_id"
            :options="categories"
            optionLabel="name"
            optionValue="id"
            placeholder="Select category"
            class="w-full"
            required
          />
        </div>
        <div class="col-12 md:col-4">
          <label class="font-semibold text-sm block mb-1">Price *</label>
          <InputNumber
            v-model="form.price"
            mode="currency"
            currency="LKR"
            class="w-full"
            inputClass="w-full"
            required
          />
        </div>
        <div class="col-12 md:col-4">
          <label class="font-semibold text-sm block mb-1">Original Price</label>
          <InputNumber
            v-model="form.original_price"
            mode="currency"
            currency="LKR"
            class="w-full"
            inputClass="w-full"
          />
        </div>
        <div class="col-12 md:col-4">
          <label class="font-semibold text-sm block mb-1">Quantity</label>
          <InputNumber v-model="form.quantity" :min="0" class="w-full" inputClass="w-full" />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">Brand</label>
          <InputText v-model="form.brand" class="w-full" placeholder="e.g., Dell, HP" />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">Model</label>
          <InputText v-model="form.model" class="w-full" placeholder="e.g., XPS 15 9530" />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">Condition</label>
          <Select
            v-model="form.condition_type"
            :options="conditionOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">Status</label>
          <Select
            v-model="form.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>

        <!-- Specs -->
        <div class="col-12">
          <div class="font-bold text-sm" style="color: var(--inco-primary-light)">
            Technical Specifications
          </div>
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">CPU</label>
          <InputText v-model="form.cpu" class="w-full" placeholder="e.g., Intel Core i7-13700H" />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">RAM</label>
          <InputText v-model="form.ram" class="w-full" placeholder="e.g., 16GB DDR5" />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">Storage</label>
          <InputText v-model="form.storage" class="w-full" placeholder="e.g., 512GB NVMe SSD" />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">GPU</label>
          <InputText v-model="form.gpu" class="w-full" placeholder="e.g., NVIDIA RTX 4060" />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">Display</label>
          <InputText v-model="form.display_spec" class="w-full" placeholder='e.g., 15.6" FHD IPS' />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">OS</label>
          <InputText v-model="form.os" class="w-full" placeholder="e.g., Windows 11 Pro" />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">Battery</label>
          <InputText
            v-model="form.battery"
            class="w-full"
            placeholder="e.g., 57Wh, up to 10 hours"
          />
        </div>
        <div class="col-12 md:col-6">
          <label class="font-semibold text-sm block mb-1">Warranty</label>
          <InputText
            v-model="form.warranty"
            class="w-full"
            placeholder="e.g., 1 Year Manufacturer"
          />
        </div>
        <div class="col-12">
          <label class="font-semibold text-sm block mb-1">Description</label>
          <Textarea
            v-model="form.description"
            class="w-full"
            rows="3"
            placeholder="Product description..."
            autoResize
          />
        </div>

        <!-- Image Management -->
        <div class="col-12">
          <label class="font-semibold text-sm block mb-2">Product Images</label>

          <!-- Existing images (editing mode) -->
          <div v-if="existingImages.length > 0" class="mb-3">
            <p class="text-xs mb-2" style="color: var(--inco-text-secondary)">
              Current Images — click
              <i class="pi pi-times"></i>
              to remove:
            </p>
            <div class="flex flex-wrap gap-2">
              <div v-for="(url, idx) in existingImages" :key="url" class="img-thumb-wrapper">
                <img :src="url" :alt="`Image ${idx + 1}`" class="img-thumb" />
                <button
                  type="button"
                  class="img-remove-btn"
                  @click="removeExistingImage(idx)"
                  title="Remove"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- New images preview -->
          <div v-if="newImageFiles.length > 0" class="mb-3">
            <p class="text-xs mb-2" style="color: var(--inco-text-secondary)">Images to Upload:</p>
            <div class="flex flex-wrap gap-2">
              <div v-for="(preview, idx) in newImagePreviews" :key="idx" class="img-thumb-wrapper">
                <img :src="preview" :alt="`New ${idx + 1}`" class="img-thumb" />
                <button
                  type="button"
                  class="img-remove-btn"
                  @click="removeNewImage(idx)"
                  title="Remove"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- File picker -->
          <div class="flex align-items-center gap-3 flex-wrap">
            <input
              ref="imageFileInput"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              style="display: none"
              @change="onImagesSelected"
            />
            <Button
              type="button"
              :label="
                existingImages.length + newImageFiles.length > 0
                  ? 'Add More Images'
                  : 'Choose Images'
              "
              icon="pi pi-images"
              class="p-button-outlined p-button-secondary"
              @click="triggerFileInput"
            />
            <small class="text-xs" style="color: var(--inco-text-secondary)">
              Max 5 MB each &middot; JPEG, PNG or WebP &middot; up to 10 images
            </small>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-content-between w-full">
          <Button
            v-if="!isEditing"
            label="Fill Sample Data"
            icon="pi pi-bolt"
            class="p-button-outlined p-button-secondary"
            @click="populateSampleData"
            v-tooltip.top="'Populate form with sample product data'"
          />
          <div class="flex gap-2 ml-auto">
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-text"
              @click="dialogVisible = false"
            />
            <Button
              :label="isEditing ? 'Update' : 'Create'"
              icon="pi pi-check"
              class="btn-cyber"
              @click="saveProduct"
              :loading="saving"
            />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { categoryAPI, productAPI } from '@/api';
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref, watch } from 'vue';

const toast = useToast();
const confirm = useConfirm();

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const saving = ref(false);
const dialogVisible = ref(false);
const isEditing = ref(false);

// Image management
const imageFileInput = ref(null);
const existingImages = ref([]); // current saved URLs when editing
const newImageFiles = ref([]); // File objects staged for upload
const newImagePreviews = ref([]); // Object URLs for previewing staged files

function triggerFileInput() {
  imageFileInput.value?.click();
}

function onImagesSelected(event) {
  const files = Array.from(event.target.files);
  for (const file of files) {
    newImageFiles.value.push(file);
    newImagePreviews.value.push(URL.createObjectURL(file));
  }
  event.target.value = ''; // allow re-selecting same file
}

function removeExistingImage(idx) {
  existingImages.value.splice(idx, 1);
}

function removeNewImage(idx) {
  URL.revokeObjectURL(newImagePreviews.value[idx]);
  newImagePreviews.value.splice(idx, 1);
  newImageFiles.value.splice(idx, 1);
}

function clearImageState() {
  newImagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
  newImagePreviews.value = [];
  newImageFiles.value = [];
  existingImages.value = [];
}

// Clean up object URLs whenever the dialog is closed
watch(dialogVisible, (visible) => {
  if (!visible) clearImageState();
});

const tableFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const statusOptions = [
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
  { label: 'Sold', value: 'sold' },
];

const conditionOptions = [
  { label: 'Brand New', value: 'new' },
  { label: 'Refurbished', value: 'refurbished' },
];

const defaultForm = {
  name: '',
  description: '',
  price: null,
  original_price: null,
  category_id: null,
  condition_type: 'new',
  status: 'in_stock',
  brand: '',
  model: '',
  cpu: '',
  ram: '',
  storage: '',
  gpu: '',
  display_spec: '',
  os: '',
  battery: '',
  warranty: '',
  featured: false,
  quantity: 0,
};

const form = reactive({ ...defaultForm });
let editingId = null;
let sampleDataIndex = 0;

const sampleProducts = [
  {
    name: 'Dell XPS 15 9530',
    description:
      'Premium 15.6" laptop with Intel 13th Gen processor, perfect for professionals and creatives. Features a stunning OLED display and long battery life.',
    price: 385000,
    original_price: 420000,
    condition_type: 'new',
    status: 'in_stock',
    brand: 'Dell',
    model: 'XPS 15 9530',
    cpu: 'Intel Core i7-13700H',
    ram: '16GB DDR5 4800MHz',
    storage: '512GB NVMe SSD',
    gpu: 'NVIDIA GeForce RTX 4060 8GB',
    display_spec: '15.6" OLED 3.5K Touch 120Hz',
    os: 'Windows 11 Home',
    battery: '86Wh, up to 13 hours',
    warranty: '1 Year Manufacturer Warranty',
    quantity: 5,
    featured: true,
  },
  {
    name: 'HP EliteBook 840 G10',
    description:
      'Business-class 14" laptop designed for corporate use. Military-grade durability with AI-powered noise cancellation and enterprise security features.',
    price: 295000,
    original_price: 320000,
    condition_type: 'new',
    status: 'in_stock',
    brand: 'HP',
    model: 'EliteBook 840 G10',
    cpu: 'Intel Core i5-1335U',
    ram: '16GB DDR5',
    storage: '256GB NVMe SSD',
    gpu: 'Intel Iris Xe Graphics',
    display_spec: '14" FHD IPS Anti-Glare',
    os: 'Windows 11 Pro',
    battery: '51Wh, up to 12 hours',
    warranty: '3 Years HP Care Pack',
    quantity: 8,
    featured: false,
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    description:
      'Ultra-lightweight 14" business flagship weighing just 1.12kg. Iconic ThinkPad keyboard with MIL-SPEC durability and all-day battery.',
    price: 445000,
    original_price: null,
    condition_type: 'new',
    status: 'in_stock',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 11',
    cpu: 'Intel Core i7-1365U vPro',
    ram: '32GB LPDDR5',
    storage: '1TB NVMe SSD',
    gpu: 'Intel Iris Xe Graphics',
    display_spec: '14" 2.8K OLED 90Hz',
    os: 'Windows 11 Pro',
    battery: '57Wh, up to 15 hours',
    warranty: '3 Years Lenovo Premier Support',
    quantity: 3,
    featured: true,
  },
  {
    name: 'ASUS ROG Strix G16 2024',
    description:
      'High-performance gaming laptop with AMD Ryzen 9 processor and RTX 4070. Designed for serious gamers with advanced cooling and RGB lighting.',
    price: 520000,
    original_price: 560000,
    condition_type: 'new',
    status: 'in_stock',
    brand: 'ASUS',
    model: 'ROG Strix G16 G614',
    cpu: 'AMD Ryzen 9 7945HX',
    ram: '16GB DDR5 4800MHz',
    storage: '1TB NVMe SSD PCIe 4.0',
    gpu: 'NVIDIA GeForce RTX 4070 8GB',
    display_spec: '16" QHD+ 240Hz IPS',
    os: 'Windows 11 Home',
    battery: '90Wh',
    warranty: '2 Years ASUS Warranty',
    quantity: 4,
    featured: true,
  },
  {
    name: 'Apple MacBook Pro 14" M3',
    description:
      'Supercharged by the M3 chip, the MacBook Pro delivers exceptional performance for developers and creative professionals in a compact 14" form.',
    price: 650000,
    original_price: null,
    condition_type: 'new',
    status: 'in_stock',
    brand: 'Apple',
    model: 'MacBook Pro 14 M3',
    cpu: 'Apple M3 (8-core CPU)',
    ram: '8GB Unified Memory',
    storage: '512GB SSD',
    gpu: 'Apple M3 10-core GPU',
    display_spec: '14.2" Liquid Retina XDR 120Hz',
    os: 'macOS Sonoma',
    battery: '70Wh, up to 18 hours',
    warranty: '1 Year Apple Limited Warranty',
    quantity: 6,
    featured: false,
  },
  {
    name: 'Acer Aspire 5 A515 Refurbished',
    description:
      'Professionally refurbished mid-range laptop in excellent condition. Great value for students and everyday computing needs.',
    price: 95000,
    original_price: 145000,
    condition_type: 'refurbished',
    status: 'in_stock',
    brand: 'Acer',
    model: 'Aspire 5 A515-56',
    cpu: 'Intel Core i5-1135G7',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    gpu: 'Intel Iris Xe Graphics',
    display_spec: '15.6" FHD IPS',
    os: 'Windows 11 Home',
    battery: '48Wh, up to 8 hours',
    warranty: '6 Months Inco Tech Warranty',
    quantity: 2,
    featured: false,
  },
];

function populateSampleData() {
  const sample = sampleProducts[sampleDataIndex % sampleProducts.length];
  sampleDataIndex++;
  const categoryMatch = categories.value.find((c) =>
    sample.brand === 'Apple'
      ? c.name?.toLowerCase().includes('mac')
      : c.name?.toLowerCase().includes('laptop'),
  );
  Object.assign(form, {
    ...sample,
    category_id: categoryMatch?.id ?? form.category_id,
  });
}

function openNew() {
  Object.assign(form, { ...defaultForm });
  editingId = null;
  isEditing.value = false;
  clearImageState();
  dialogVisible.value = true;
}

function editProduct(product) {
  Object.assign(form, {
    name: product.name,
    description: product.description,
    price: parseFloat(product.price),
    original_price: product.original_price ? parseFloat(product.original_price) : null,
    category_id: product.category_id,
    condition_type: product.condition_type,
    status: product.status,
    brand: product.brand,
    model: product.model,
    cpu: product.cpu,
    ram: product.ram,
    storage: product.storage,
    gpu: product.gpu,
    display_spec: product.display_spec,
    os: product.os,
    battery: product.battery,
    warranty: product.warranty,
    featured: !!product.featured,
    quantity: product.quantity,
  });
  editingId = product.id;
  isEditing.value = true;

  // Populate existing images
  const imgs = Array.isArray(product.images)
    ? product.images
    : product.images
      ? JSON.parse(product.images)
      : [];
  existingImages.value = imgs.length > 0 ? [...imgs] : product.image_url ? [product.image_url] : [];
  newImageFiles.value = [];
  newImagePreviews.value = [];

  dialogVisible.value = true;
}

async function saveProduct() {
  if (!form.name || !form.price || !form.category_id) {
    toast.add({
      severity: 'warn',
      summary: 'Validation',
      detail: 'Name, price, and category are required',
      life: 3000,
    });
    return;
  }

  saving.value = true;
  try {
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== '') {
        formData.append(key, val);
      }
    });
    // Attach new image files
    newImageFiles.value.forEach((file) => formData.append('images', file));
    // Tell the server which existing images to keep (editing only)
    if (isEditing.value) {
      formData.append('keep_images', JSON.stringify(existingImages.value));
    }

    if (isEditing.value) {
      await productAPI.update(editingId, formData);
      toast.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Product updated successfully',
        life: 3000,
      });
    } else {
      await productAPI.create(formData);
      toast.add({
        severity: 'success',
        summary: 'Created',
        detail: 'Product created successfully',
        life: 3000,
      });
    }

    dialogVisible.value = false;
    fetchProducts();
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.response?.data?.message || 'Operation failed',
      life: 4000,
    });
  } finally {
    saving.value = false;
  }
}

function confirmDelete(product) {
  confirm.require({
    message: `Are you sure you want to delete "${product.name}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await productAPI.delete(product.id);
        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Product deleted successfully',
          life: 3000,
        });
        fetchProducts();
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: err.response?.data?.message || 'Delete failed',
          life: 4000,
        });
      }
    },
  });
}

async function updateStatus(product) {
  try {
    const formData = new FormData();
    formData.append('status', product.status);
    await productAPI.update(product.id, formData);
    toast.add({
      severity: 'info',
      summary: 'Status Updated',
      detail: `${product.name} → ${product.status.replace('_', ' ')}`,
      life: 2000,
    });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update status',
      life: 3000,
    });
  }
}

async function toggleFeatured(product) {
  try {
    const formData = new FormData();
    formData.append('featured', product.featured);
    await productAPI.update(product.id, formData);
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to toggle featured',
      life: 3000,
    });
  }
}

function formatPrice(val) {
  return Number(val).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function fetchProducts() {
  loading.value = true;
  try {
    const res = await productAPI.getAll({ limit: 1000 });
    products.value = res.data.data.map((p) => ({
      ...p,
      featured: !!p.featured,
    }));
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Failed to Load',
      detail: err?.response?.data?.message || 'Could not load products.',
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    const catRes = await categoryAPI.getAll();
    categories.value = catRes.data.data;
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Failed to Load',
      detail: err?.response?.data?.message || 'Could not load categories.',
      life: 4000,
    });
  }
  fetchProducts();
});
</script>

<style scoped>
.img-thumb-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.img-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  border: 2px solid var(--inco-border, #334155);
}

.img-remove-btn {
  position: absolute;
  top: -7px;
  right: -7px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ef4444;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  transition: background 0.15s;
}

.img-remove-btn:hover {
  background: #b91c1c;
}
</style>
