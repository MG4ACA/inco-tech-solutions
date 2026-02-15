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
              ${{ formatPrice(data.price) }}
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
            currency="USD"
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
            currency="USD"
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

        <!-- Image Upload -->
        <div class="col-12">
          <label class="font-semibold text-sm block mb-1">Product Image</label>
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="5000000"
            chooseLabel="Choose Image"
            class="w-full"
            @select="onImageSelect"
          />
          <small class="text-xs" style="color: var(--inco-text-secondary)">
            Max 5MB. JPEG, PNG, or WebP.
          </small>
        </div>
      </form>

      <template #footer>
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
      </template>
    </Dialog>

    <!-- Confirm Delete -->
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { categoryAPI, productAPI } from '@/api';
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';

const toast = useToast();
const confirm = useConfirm();

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const saving = ref(false);
const dialogVisible = ref(false);
const isEditing = ref(false);
const selectedImage = ref(null);

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

function openNew() {
  Object.assign(form, { ...defaultForm });
  editingId = null;
  isEditing.value = false;
  selectedImage.value = null;
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
  selectedImage.value = null;
  dialogVisible.value = true;
}

function onImageSelect(event) {
  selectedImage.value = event.files[0];
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
    if (selectedImage.value) {
      formData.append('image', selectedImage.value);
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
  return Number(val).toLocaleString('en-US', {
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
    console.error('Failed to fetch products:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    const catRes = await categoryAPI.getAll();
    categories.value = catRes.data.data;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
  fetchProducts();
});
</script>
