<template>
  <div>
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="text-3xl font-bold mb-1" style="color: var(--inco-text-primary)">
          Category Management
        </h1>
        <p style="color: var(--inco-text-secondary)">
          Manage product categories that appear in the shop
        </p>
      </div>
      <Button label="Add Category" icon="pi pi-plus" class="btn-cyber" @click="openNew" />
    </div>

    <div class="cyber-card">
      <DataTable
        :value="categories"
        :loading="loading"
        dataKey="id"
        stripedRows
        class="p-datatable-sm"
      >
        <template #empty>
          <div class="text-center py-5" style="color: var(--inco-text-secondary)">
            No categories found.
          </div>
        </template>

        <Column field="icon" header="Icon" style="width: 80px">
          <template #body="{ data }">
            <div
              class="flex align-items-center justify-content-center"
              style="
                width: 40px;
                height: 40px;
                border-radius: 10px;
                background: rgba(59, 130, 246, 0.12);
              "
            >
              <i :class="data.icon || 'pi pi-tag'" style="color: var(--inco-primary-light)"></i>
            </div>
          </template>
        </Column>

        <Column field="name" header="Name" sortable>
          <template #body="{ data }">
            <span class="font-semibold" style="color: var(--inco-text-primary)">
              {{ data.name }}
            </span>
          </template>
        </Column>

        <Column field="slug" header="Slug">
          <template #body="{ data }">
            <code class="text-sm" style="color: var(--inco-text-secondary)">{{ data.slug }}</code>
          </template>
        </Column>

        <Column field="description" header="Description">
          <template #body="{ data }">
            <span class="text-sm" style="color: var(--inco-text-secondary)">
              {{
                data.description
                  ? data.description.length > 60
                    ? data.description.slice(0, 60) + '...'
                    : data.description
                  : '-'
              }}
            </span>
          </template>
        </Column>

        <Column field="product_count" header="Products" sortable style="width: 100px">
          <template #body="{ data }">
            <Badge :value="data.product_count || 0" severity="info" />
          </template>
        </Column>

        <Column field="is_active" header="Active" style="width: 90px">
          <template #body="{ data }">
            <InputSwitch v-model="data.is_active" @change="toggleActive(data)" />
          </template>
        </Column>

        <Column field="sort_order" header="Order" sortable style="width: 80px">
          <template #body="{ data }">
            <span class="font-mono text-sm">{{ data.sort_order }}</span>
          </template>
        </Column>

        <Column header="Actions" style="width: 120px">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text p-button-sm"
                @click="editCategory(data)"
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

    <!-- Category Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="isEditing ? 'Edit Category' : 'Add New Category'"
      :modal="true"
      :style="{ width: '500px' }"
      :breakpoints="{ '640px': '95vw' }"
    >
      <form @submit.prevent="saveCategory" class="flex flex-column gap-3 mt-2">
        <div>
          <label class="font-semibold text-sm block mb-1">Category Name *</label>
          <InputText
            v-model="form.name"
            class="w-full"
            placeholder="e.g., Gaming Laptops"
            required
          />
        </div>
        <div>
          <label class="font-semibold text-sm block mb-1">Description</label>
          <Textarea
            v-model="form.description"
            class="w-full"
            rows="3"
            placeholder="Brief category description..."
            autoResize
          />
        </div>
        <div class="grid">
          <div class="col-8">
            <label class="font-semibold text-sm block mb-1">Icon (PrimeIcons class)</label>
            <InputText v-model="form.icon" class="w-full" placeholder="pi pi-tag" />
          </div>
          <div class="col-4">
            <label class="font-semibold text-sm block mb-1">Sort Order</label>
            <InputNumber v-model="form.sort_order" :min="0" class="w-full" inputClass="w-full" />
          </div>
        </div>
        <div v-if="form.icon" class="flex align-items-center gap-2">
          <span class="text-sm" style="color: var(--inco-text-secondary)">Preview:</span>
          <div
            class="flex align-items-center justify-content-center"
            style="
              width: 36px;
              height: 36px;
              border-radius: 8px;
              background: rgba(59, 130, 246, 0.15);
            "
          >
            <i :class="form.icon" style="color: var(--inco-primary-light)"></i>
          </div>
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
          @click="saveCategory"
          :loading="saving"
        />
      </template>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { categoryAPI } from '@/api';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';

const toast = useToast();
const confirm = useConfirm();

const categories = ref([]);
const loading = ref(true);
const saving = ref(false);
const dialogVisible = ref(false);
const isEditing = ref(false);
let editingId = null;

const defaultForm = { name: '', description: '', icon: 'pi pi-tag', sort_order: 0 };
const form = reactive({ ...defaultForm });

function openNew() {
  Object.assign(form, { ...defaultForm });
  editingId = null;
  isEditing.value = false;
  dialogVisible.value = true;
}

function editCategory(cat) {
  Object.assign(form, {
    name: cat.name,
    description: cat.description || '',
    icon: cat.icon || 'pi pi-tag',
    sort_order: cat.sort_order || 0,
  });
  editingId = cat.id;
  isEditing.value = true;
  dialogVisible.value = true;
}

async function saveCategory() {
  if (!form.name.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Validation',
      detail: 'Category name is required',
      life: 3000,
    });
    return;
  }

  saving.value = true;
  try {
    if (isEditing.value) {
      await categoryAPI.update(editingId, { ...form });
      toast.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Category updated',
        life: 3000,
      });
    } else {
      await categoryAPI.create({ ...form });
      toast.add({
        severity: 'success',
        summary: 'Created',
        detail: 'Category created',
        life: 3000,
      });
    }
    dialogVisible.value = false;
    fetchCategories();
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

function confirmDelete(cat) {
  confirm.require({
    message: `Delete "${cat.name}"? This cannot be undone.`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await categoryAPI.delete(cat.id);
        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Category deleted',
          life: 3000,
        });
        fetchCategories();
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

async function toggleActive(cat) {
  try {
    await categoryAPI.update(cat.id, { is_active: cat.is_active });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to toggle status',
      life: 3000,
    });
  }
}

async function fetchCategories() {
  loading.value = true;
  try {
    const res = await categoryAPI.getAll();
    categories.value = res.data.data.map((c) => ({ ...c, is_active: !!c.is_active }));
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Failed to Load',
      detail: err?.response?.data?.message || 'Could not load categories.',
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
}

onMounted(fetchCategories);
</script>
