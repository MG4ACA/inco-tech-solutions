<template>
  <div>
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="text-3xl font-bold mb-1" style="color: var(--inco-text-primary)">
          Repair Requests
        </h1>
        <p style="color: var(--inco-text-secondary)">
          Manage and track all repair diagnostic requests
        </p>
      </div>
      <div class="flex gap-2">
        <Select
          v-model="filterStatus"
          :options="statusFilterOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Filter by Status"
          class="w-12rem"
          @change="fetchRepairs"
        />
      </div>
    </div>

    <div class="cyber-card">
      <DataTable
        :value="repairs"
        :loading="loading"
        :paginator="true"
        :rows="15"
        :rowsPerPageOptions="[10, 15, 25, 50]"
        dataKey="id"
        stripedRows
        removableSort
        class="p-datatable-sm"
      >
        <template #empty>
          <div class="text-center py-5" style="color: var(--inco-text-secondary)">
            No repair requests found.
          </div>
        </template>

        <Column field="id" header="ID" sortable style="width: 60px">
          <template #body="{ data }">
            <span class="font-mono text-sm font-bold" style="color: var(--inco-primary-light)">
              #{{ data.id }}
            </span>
          </template>
        </Column>

        <Column field="user_name" header="Customer" sortable style="min-width: 150px">
          <template #body="{ data }">
            <div>
              <div class="font-semibold" style="color: var(--inco-text-primary)">
                {{ data.user_name }}
              </div>
              <div class="text-xs" style="color: var(--inco-text-secondary)">{{ data.email }}</div>
              <div v-if="data.phone" class="text-xs" style="color: var(--inco-text-secondary)">
                {{ data.phone }}
              </div>
            </div>
          </template>
        </Column>

        <Column field="device_model" header="Device" sortable style="min-width: 150px">
          <template #body="{ data }">
            <div>
              <div class="font-medium" style="color: var(--inco-text-primary)">
                {{ data.device_model }}
              </div>
              <div class="text-xs" style="color: var(--inco-text-secondary)">
                {{ data.device_type }} {{ data.device_brand ? `• ${data.device_brand}` : '' }}
              </div>
            </div>
          </template>
        </Column>

        <Column field="issue_description" header="Issue" style="min-width: 200px">
          <template #body="{ data }">
            <span class="text-sm" style="color: var(--inco-text-secondary)">
              {{
                data.issue_description.length > 80
                  ? data.issue_description.slice(0, 80) + '...'
                  : data.issue_description
              }}
            </span>
          </template>
        </Column>

        <Column field="urgency" header="Urgency" sortable style="width: 110px">
          <template #body="{ data }">
            <Tag
              :value="data.urgency"
              :severity="urgencySeverity(data.urgency)"
              class="text-xs font-bold text-capitalize"
            />
          </template>
        </Column>

        <Column field="status" header="Status" style="width: 170px">
          <template #body="{ data }">
            <Select
              v-model="data.status"
              :options="repairStatusOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full p-inputtext-sm"
              @change="updateRepairStatus(data)"
            />
          </template>
        </Column>

        <Column field="estimated_cost" header="Est. Cost" style="width: 110px">
          <template #body="{ data }">
            <span
              v-if="data.estimated_cost"
              class="font-bold"
              style="color: var(--inco-primary-light)"
            >
              Rs.
              {{
                Number(data.estimated_cost).toLocaleString('en-LK', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
            <span v-else class="text-xs" style="color: var(--inco-text-secondary)">Not set</span>
          </template>
        </Column>

        <Column field="created_at" header="Date" sortable style="width: 110px">
          <template #body="{ data }">
            <span class="text-xs" style="color: var(--inco-text-secondary)">
              {{ new Date(data.created_at).toLocaleDateString() }}
            </span>
          </template>
        </Column>

        <Column header="Actions" style="width: 80px">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-text p-button-sm"
              @click="openDetail(data)"
              v-tooltip.top="'Edit Details'"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Detail Dialog -->
    <Dialog
      v-model:visible="detailVisible"
      header="Repair Request Details"
      :modal="true"
      :style="{ width: '550px' }"
      :breakpoints="{ '640px': '95vw' }"
    >
      <div v-if="selectedRepair" class="flex flex-column gap-3">
        <div class="grid">
          <div class="col-6">
            <label
              class="font-semibold text-xs block mb-1"
              style="color: var(--inco-text-secondary)"
            >
              Customer
            </label>
            <div class="font-bold" style="color: var(--inco-text-primary)">
              {{ selectedRepair.user_name }}
            </div>
            <div class="text-sm" style="color: var(--inco-text-secondary)">
              {{ selectedRepair.email }}
            </div>
          </div>
          <div class="col-6">
            <label
              class="font-semibold text-xs block mb-1"
              style="color: var(--inco-text-secondary)"
            >
              Device
            </label>
            <div class="font-bold" style="color: var(--inco-text-primary)">
              {{ selectedRepair.device_model }}
            </div>
            <div class="text-sm" style="color: var(--inco-text-secondary)">
              {{ selectedRepair.device_type }} {{ selectedRepair.device_brand }}
            </div>
          </div>
        </div>

        <div>
          <label class="font-semibold text-xs block mb-1" style="color: var(--inco-text-secondary)">
            Issue Description
          </label>
          <div
            class="p-3 border-round text-sm"
            style="
              background: color-mix(
                in srgb,
                var(--inco-surface-card) 60%,
                var(--inco-surface-dark)
              );
              border: 1px solid var(--inco-border);
              color: var(--inco-text-primary);
            "
          >
            {{ selectedRepair.issue_description }}
          </div>
        </div>

        <div class="grid">
          <div class="col-6">
            <label class="font-semibold text-sm block mb-1">Urgency</label>
            <Select
              v-model="editForm.urgency"
              :options="urgencyOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            />
          </div>
          <div class="col-6">
            <label class="font-semibold text-sm block mb-1">Status</label>
            <Select
              v-model="editForm.status"
              :options="repairStatusOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            />
          </div>
        </div>

        <div>
          <label class="font-semibold text-sm block mb-1">Estimated Cost (Rs.)</label>
          <InputNumber
            v-model="editForm.estimated_cost"
            mode="currency"
            currency="LKR"
            class="w-full"
            inputClass="w-full"
          />
        </div>

        <div>
          <label class="font-semibold text-sm block mb-1">Admin Notes</label>
          <Textarea
            v-model="editForm.admin_notes"
            class="w-full"
            rows="3"
            placeholder="Internal notes..."
            autoResize
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="detailVisible = false"
        />
        <Button
          label="Save Changes"
          icon="pi pi-check"
          class="btn-cyber"
          @click="saveRepairUpdate"
          :loading="saving"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { repairAPI } from '@/api';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref } from 'vue';

const toast = useToast();

const repairs = ref([]);
const loading = ref(true);
const saving = ref(false);
const detailVisible = ref(false);
const selectedRepair = ref(null);
const filterStatus = ref('');

const editForm = reactive({
  status: '',
  urgency: '',
  estimated_cost: null,
  admin_notes: '',
});

const statusFilterOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Diagnosed', value: 'diagnosed' },
  { label: 'Waiting Parts', value: 'waiting_parts' },
  { label: 'Repaired', value: 'repaired' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const repairStatusOptions = statusFilterOptions.slice(1);

const urgencyOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

function urgencySeverity(urgency) {
  const map = { low: 'success', medium: 'warn', high: 'danger', critical: 'danger' };
  return map[urgency] || 'info';
}

function openDetail(repair) {
  selectedRepair.value = repair;
  Object.assign(editForm, {
    status: repair.status,
    urgency: repair.urgency,
    estimated_cost: repair.estimated_cost ? parseFloat(repair.estimated_cost) : null,
    admin_notes: repair.admin_notes || '',
  });
  detailVisible.value = true;
}

async function updateRepairStatus(repair) {
  try {
    await repairAPI.update(repair.id, { status: repair.status });
    toast.add({
      severity: 'info',
      summary: 'Status Updated',
      detail: `Request #${repair.id} → ${repair.status.replace('_', ' ')}`,
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

async function saveRepairUpdate() {
  if (!selectedRepair.value) return;

  saving.value = true;
  try {
    await repairAPI.update(selectedRepair.value.id, { ...editForm });
    toast.add({
      severity: 'success',
      summary: 'Updated',
      detail: 'Repair request updated',
      life: 3000,
    });
    detailVisible.value = false;
    fetchRepairs();
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.response?.data?.message || 'Update failed',
      life: 4000,
    });
  } finally {
    saving.value = false;
  }
}

async function fetchRepairs() {
  loading.value = true;
  try {
    const params = {};
    if (filterStatus.value) params.status = filterStatus.value;
    const res = await repairAPI.getAll(params);
    repairs.value = res.data.data;
  } catch (err) {
    console.error('Failed to fetch repairs:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchRepairs);
</script>
