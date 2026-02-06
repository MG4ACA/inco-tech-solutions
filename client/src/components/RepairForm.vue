<template>
  <Dialog
    v-model:visible="visible"
    header="Book a Repair Diagnostic"
    :modal="true"
    :dismissableMask="true"
    :style="{ width: '550px' }"
    :breakpoints="{ '640px': '95vw' }"
    class="repair-dialog"
  >
    <template #header>
      <div class="flex align-items-center gap-2">
        <div
          class="flex align-items-center justify-content-center"
          style="
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: rgba(59, 130, 246, 0.15);
          "
        >
          <i class="pi pi-wrench" style="color: var(--inco-primary-light)"></i>
        </div>
        <div>
          <div class="font-bold text-lg">Book a Repair Diagnostic</div>
          <div class="text-xs" style="color: var(--inco-text-secondary)">
            We'll diagnose and fix your device
          </div>
        </div>
      </div>
    </template>

    <form @submit.prevent="submitRepair" class="flex flex-column gap-4 mt-2">
      <!-- Name -->
      <div class="flex flex-column gap-1">
        <label for="repair-name" class="font-semibold text-sm">Full Name *</label>
        <InputText
          id="repair-name"
          v-model="form.user_name"
          placeholder="Enter your full name"
          :invalid="!!errors.user_name"
        />
        <small v-if="errors.user_name" class="text-red-400">{{ errors.user_name }}</small>
      </div>

      <!-- Email -->
      <div class="flex flex-column gap-1">
        <label for="repair-email" class="font-semibold text-sm">Email Address *</label>
        <InputText
          id="repair-email"
          v-model="form.email"
          type="email"
          placeholder="your@email.com"
          :invalid="!!errors.email"
        />
        <small v-if="errors.email" class="text-red-400">{{ errors.email }}</small>
      </div>

      <!-- Phone -->
      <div class="flex flex-column gap-1">
        <label for="repair-phone" class="font-semibold text-sm">Phone Number</label>
        <InputText id="repair-phone" v-model="form.phone" placeholder="+1 (555) 000-0000" />
      </div>

      <!-- Device Type & Brand -->
      <div class="grid">
        <div class="col-6">
          <div class="flex flex-column gap-1">
            <label for="device-type" class="font-semibold text-sm">Device Type *</label>
            <Select
              id="device-type"
              v-model="form.device_type"
              :options="deviceTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Select type"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="flex flex-column gap-1">
            <label for="device-brand" class="font-semibold text-sm">Brand</label>
            <InputText id="device-brand" v-model="form.device_brand" placeholder="e.g., Dell, HP" />
          </div>
        </div>
      </div>

      <!-- Device Model -->
      <div class="flex flex-column gap-1">
        <label for="device-model" class="font-semibold text-sm">Device Model *</label>
        <InputText
          id="device-model"
          v-model="form.device_model"
          placeholder="e.g., Dell XPS 15 9530"
          :invalid="!!errors.device_model"
        />
        <small v-if="errors.device_model" class="text-red-400">{{ errors.device_model }}</small>
      </div>

      <!-- Issue Description -->
      <div class="flex flex-column gap-1">
        <label for="issue-desc" class="font-semibold text-sm">Issue Description *</label>
        <Textarea
          id="issue-desc"
          v-model="form.issue_description"
          rows="4"
          placeholder="Describe the issue you're experiencing with your device..."
          :invalid="!!errors.issue_description"
          autoResize
        />
        <small v-if="errors.issue_description" class="text-red-400">
          {{ errors.issue_description }}
        </small>
      </div>

      <!-- Urgency -->
      <div class="flex flex-column gap-1">
        <label class="font-semibold text-sm">Urgency Level</label>
        <div class="flex flex-wrap gap-2">
          <Tag
            v-for="u in urgencyLevels"
            :key="u.value"
            :value="u.label"
            :severity="u.severity"
            class="cursor-pointer px-3 py-2"
            :style="
              form.urgency === u.value
                ? 'outline: 2px solid var(--inco-primary); outline-offset: 2px;'
                : 'opacity: 0.6;'
            "
            @click="form.urgency = u.value"
          />
        </div>
      </div>

      <!-- Submit -->
      <Button
        type="submit"
        label="Submit Repair Request"
        icon="pi pi-send"
        class="btn-cyber w-full py-3 mt-2"
        :loading="submitting"
      />
    </form>
  </Dialog>
</template>

<script setup>
import { repairAPI } from '@/api';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { reactive, ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue']);
const toast = useToast();

const visible = ref(props.modelValue);
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
  },
);
watch(visible, (val) => {
  emit('update:modelValue', val);
});

const submitting = ref(false);
const errors = reactive({});

const form = reactive({
  user_name: '',
  email: '',
  phone: '',
  device_type: 'laptop',
  device_brand: '',
  device_model: '',
  issue_description: '',
  urgency: 'medium',
});

const deviceTypes = [
  { label: 'Laptop', value: 'laptop' },
  { label: 'Desktop', value: 'desktop' },
  { label: 'Tablet', value: 'tablet' },
  { label: 'Phone', value: 'phone' },
  { label: 'Other', value: 'other' },
];

const urgencyLevels = [
  { label: '🟢 Low', value: 'low', severity: 'success' },
  { label: '🟡 Medium', value: 'medium', severity: 'warn' },
  { label: '🟠 High', value: 'high', severity: 'danger' },
  { label: '🔴 Critical', value: 'critical', severity: 'danger' },
];

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);

  if (!form.user_name.trim()) errors.user_name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email';
  if (!form.device_model.trim()) errors.device_model = 'Device model is required';
  if (!form.issue_description.trim()) errors.issue_description = 'Please describe the issue';

  return Object.keys(errors).length === 0;
}

async function submitRepair() {
  if (!validate()) return;

  submitting.value = true;
  try {
    await repairAPI.create(form);
    toast.add({
      severity: 'success',
      summary: 'Request Submitted!',
      detail: 'We will contact you shortly to schedule a diagnostic.',
      life: 5000,
    });
    resetForm();
    visible.value = false;
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Submission Failed',
      detail: err.response?.data?.message || 'Something went wrong. Please try again.',
      life: 5000,
    });
  } finally {
    submitting.value = false;
  }
}

function resetForm() {
  Object.assign(form, {
    user_name: '',
    email: '',
    phone: '',
    device_type: 'laptop',
    device_brand: '',
    device_model: '',
    issue_description: '',
    urgency: 'medium',
  });
  Object.keys(errors).forEach((k) => delete errors[k]);
}
</script>
