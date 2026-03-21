<template>
  <div class="discovery-page">

    <!-- ── Loading State ─────────────────────────────────────── -->
    <div v-if="loading" class="discovery-loading section-container py-8">
      <div class="grid">
        <div class="col-12">
          <Skeleton class="mb-3" height="3rem" borderRadius="8px" />
          <Skeleton class="mb-2" height="1.2rem" borderRadius="6px" />
          <Skeleton height="1.2rem" width="70%" borderRadius="6px" />
        </div>
        <div v-for="i in 3" :key="i" class="col-12 md:col-4 mt-4">
          <Skeleton height="10rem" borderRadius="12px" />
        </div>
      </div>
    </div>

    <!-- ── Not In Corridor ───────────────────────────────────── -->
    <div v-else-if="notInZone" class="section-container py-8 text-center">
      <div class="cyber-card p-6 mx-auto" style="max-width: 560px">
        <i class="pi pi-map-marker text-5xl mb-4" style="color: var(--inco-primary-light)" />
        <h1 class="text-2xl font-bold mb-3" style="color: var(--inco-text-primary)">
          Outside Our Service Area
        </h1>
        <p class="mb-4" style="color: var(--inco-text-secondary)">
          {{ error }}
        </p>
        <p class="text-sm mb-5" style="color: var(--inco-text-secondary)">
          We currently serve the <strong style="color: var(--inco-primary-light)">Matara → Colombo</strong>
          coastal corridor. Choose a city below:
        </p>
        <div class="flex flex-wrap gap-2 justify-content-center mb-5">
          <router-link
            v-for="city in corridorCities"
            :key="city.slug"
            :to="`/repair/${city.slug}`"
            class="no-underline"
          >
            <Tag
              :value="city.label"
              severity="info"
              class="cursor-pointer hover-tag"
              style="font-size: 0.85rem; padding: 0.4rem 0.8rem"
            />
          </router-link>
        </div>
        <router-link to="/">
          <Button label="Back to Home" icon="pi pi-home" class="btn-outline-cyber" />
        </router-link>
      </div>
    </div>

    <!-- ── Main Discovery Content ────────────────────────────── -->
    <template v-else-if="seoData">

      <!-- Hero Banner -->
      <section class="discovery-hero py-7" style="background: linear-gradient(135deg, rgba(0,123,255,0.10) 0%, rgba(6,182,212,0.06) 100%); border-bottom: 1px solid rgba(59,130,246,0.18)">
        <div class="section-container">
          <div class="flex align-items-center gap-2 mb-3">
            <Tag value="Service Corridor" severity="info" class="text-xs" />
            <Tag value="Certified Technicians" severity="success" class="text-xs" />
          </div>
          <h1 class="text-4xl font-bold mb-3 discovery-hero-title">
            {{ cityName }} Computer &amp; Laptop Repair
          </h1>
          <p class="text-lg mb-5" style="color: var(--inco-text-secondary); max-width: 680px; line-height: 1.7">
            {{ seoData.metaDesc }}
          </p>
          <div class="flex gap-3 flex-wrap">
            <Button
              label="Book a Repair"
              icon="pi pi-calendar-plus"
              class="btn-cyber px-5 py-3"
              @click="showRepair = true"
            />
            <Button
              label="Call Us Now"
              icon="pi pi-phone"
              severity="secondary"
              outlined
              class="px-5 py-3"
              @click="callUs"
            />
          </div>
        </div>
      </section>

      <!-- ── AEO: Answer-First Block ─────────────────────────── -->
      <section class="py-6" style="background: var(--inco-surface-dark)">
        <div class="section-container">
          <div class="text-center mb-5">
            <h2 class="section-title">Repair Services in {{ cityName }}</h2>
            <p class="section-subtitle">Fast, affordable, and certified — here's what we fix</p>
          </div>

          <div class="grid">
            <div
              v-for="service in services"
              :key="service.title"
              class="col-12 sm:col-6 lg:col-4"
            >
              <div class="cyber-card p-4 h-full service-card">
                <div class="flex align-items-center gap-3 mb-3">
                  <div
                    class="stat-icon"
                    :style="{ background: service.bg, color: service.color, width: '48px', height: '48px', fontSize: '1.2rem' }"
                  >
                    <i :class="service.icon" />
                  </div>
                  <h3 class="text-base font-bold m-0" style="color: var(--inco-text-primary)">
                    {{ service.title }}
                  </h3>
                </div>
                <p class="text-sm m-0" style="color: var(--inco-text-secondary); line-height: 1.6">
                  {{ service.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── AEO: FAQ Accordion ──────────────────────────────── -->
      <section
        v-if="seoData.faqPayload && seoData.faqPayload.length"
        class="py-6"
        style="background: linear-gradient(180deg, rgba(15,23,42,0.98), rgba(15,23,42,0.95))"
      >
        <div class="section-container">
          <div class="text-center mb-5">
            <h2 class="section-title">Frequently Asked Questions</h2>
            <p class="section-subtitle">Everything you need to know about repairs in {{ cityName }}</p>
          </div>

          <div class="mx-auto" style="max-width: 800px">
            <Accordion :multiple="true" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
              <AccordionTab
                v-for="(faq, index) in seoData.faqPayload"
                :key="index"
                :header="faq.question"
              >
                <p style="color: var(--inco-text-secondary); line-height: 1.7; margin: 0">
                  {{ faq.answer }}
                </p>
              </AccordionTab>
            </Accordion>
          </div>
        </div>
      </section>

      <!-- ── GEO: Local Entity Links ─────────────────────────── -->
      <section class="py-6" style="background: var(--inco-surface-dark)">
        <div class="section-container">
          <div class="text-center mb-5">
            <h2 class="section-title">We Serve the Whole Corridor</h2>
            <p class="section-subtitle">
              Inco Tech Solutions covers the full Matara → Colombo coastal route
            </p>
          </div>

          <div class="flex flex-wrap gap-3 justify-content-center mb-6">
            <router-link
              v-for="city in corridorCities"
              :key="city.slug"
              :to="`/repair/${city.slug}`"
              class="no-underline"
            >
              <div
                class="city-chip"
                :class="{ 'city-chip--active': city.slug === seoData.citySlug }"
              >
                <i class="pi pi-map-marker mr-2" />
                {{ city.label }}
              </div>
            </router-link>
          </div>

          <!-- Map/Location card -->
          <div class="cyber-card p-5 mx-auto" style="max-width: 720px">
            <div class="flex align-items-center gap-3 mb-4">
              <i class="pi pi-map text-2xl" style="color: var(--inco-primary-light)" />
              <div>
                <h3 class="font-bold m-0" style="color: var(--inco-text-primary)">
                  Our {{ cityName }} Service Zone
                </h3>
                <p class="text-sm m-0" style="color: var(--inco-text-secondary)">
                  GPS coordinates from our structured data
                </p>
              </div>
            </div>
            <div class="grid" v-if="geoCoords">
              <div class="col-12 sm:col-6">
                <div class="p-3 border-round" style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2)">
                  <p class="text-xs font-bold mb-1" style="color: var(--inco-primary-light)">LATITUDE</p>
                  <p class="font-mono text-lg m-0" style="color: var(--inco-text-primary)">{{ geoCoords.latitude }}</p>
                </div>
              </div>
              <div class="col-12 sm:col-6">
                <div class="p-3 border-round" style="background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.2)">
                  <p class="text-xs font-bold mb-1" style="color: #06b6d4">LONGITUDE</p>
                  <p class="font-mono text-lg m-0" style="color: var(--inco-text-primary)">{{ geoCoords.longitude }}</p>
                </div>
              </div>
              <div class="col-12 mt-2">
                <div class="p-3 border-round flex align-items-center gap-3" style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2)">
                  <i class="pi pi-verified text-xl" style="color: #10b981" />
                  <div>
                    <p class="text-xs font-bold mb-0" style="color: #10b981">AREA SERVED</p>
                    <p class="m-0 font-bold" style="color: var(--inco-text-primary)">{{ cityName }}, Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CTA Strip ───────────────────────────────────────── -->
      <section
        class="py-6 text-center"
        style="background: linear-gradient(135deg, rgba(0,123,255,0.10), rgba(6,182,212,0.07))"
      >
        <div class="section-container">
          <h2 class="text-2xl font-bold mb-3" style="color: var(--inco-text-primary)">
            Ready to Fix Your Device in {{ cityName }}?
          </h2>
          <p class="mb-4" style="color: var(--inco-text-secondary)">
            Fast diagnosis. Genuine parts. 30-day warranty. Book online or walk in.
          </p>
          <Button
            label="Book a Repair Now"
            icon="pi pi-wrench"
            class="btn-cyber px-5 py-3 text-lg"
            @click="showRepair = true"
          />
        </div>
      </section>

    </template>

    <!-- ── Repair Dialog ─────────────────────────────────────── -->
    <RepairForm v-model="showRepair" />

  </div>
</template>

<script setup>
import { useDiscovery } from '@/composables/useDiscovery';
import { canonicalUrl, useSeoHead } from '@/composables/useSeoHead';
import RepairForm from '@/components/RepairForm.vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';
import { computed, ref, watch } from 'vue';

const { seoData, loading, error, notInZone } = useDiscovery();

// ── SEO: inject head tags once city data resolves ──
watch(
  seoData,
  (data) => {
    if (!data) return;
    const cityLabel = data.citySlug.charAt(0).toUpperCase() + data.citySlug.slice(1);
    useSeoHead({
      title: `${cityLabel} Computer & Laptop Repair | Inco Tech Solutions`,
      description:
        data.metaDesc ||
        `Expert computer and laptop repair in ${cityLabel}. Certified technicians, fast turnaround, 30-day warranty. Serving the Matara – Colombo coastal corridor.`,
      canonical: canonicalUrl(`/repair/${data.citySlug}`),
    });
  },
  { immediate: true },
);

const showRepair = ref(false);

// ── Derived / Computed ──────────────────────────────────────────
const cityName = computed(() => {
  const slug = seoData.value?.citySlug || '';
  return slug.charAt(0).toUpperCase() + slug.slice(1);
});


const geoCoords = computed(() => {
  const jsonLd = seoData.value?.jsonLd;
  return jsonLd?.geo || null;
});

// ── Corridor City List (GEO internal links) ─────────────────────
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

// ── AEO Service Cards ───────────────────────────────────────────
const services = [
  {
    icon: 'pi pi-desktop',
    title: 'Laptop Screen Replacement',
    desc: 'Cracked, flickering, or dead screen? We source genuine LCD/IPS panels and replace them same-day for most models.',
    bg: 'rgba(59,130,246,0.15)',
    color: '#3b82f6',
  },
  {
    icon: 'pi pi-shield',
    title: 'Virus & Malware Removal',
    desc: 'Complete disinfection, rootkit removal, firewall setup and performance restoration — your data stays safe.',
    bg: 'rgba(16,185,129,0.15)',
    color: '#10b981',
  },
  {
    icon: 'pi pi-database',
    title: 'Data Recovery',
    desc: 'Lost files from crashed HDD or failed SSD? We recover data using professional tools. No-data-no-fee policy.',
    bg: 'rgba(245,158,11,0.15)',
    color: '#f59e0b',
  },
  {
    icon: 'pi pi-bolt',
    title: 'RAM & SSD Upgrades',
    desc: 'Breathe new life into a slow laptop with a fast NVMe SSD or extra RAM — upgrades take under an hour.',
    bg: 'rgba(139,92,246,0.15)',
    color: '#8b5cf6',
  },
  {
    icon: 'pi pi-wrench',
    title: 'Motherboard & Power Repair',
    desc: 'Won\'t turn on? Dead ports? Charging issues? We diagnose and repair motherboard-level faults with precision tools.',
    bg: 'rgba(239,68,68,0.15)',
    color: '#ef4444',
  },
  {
    icon: 'pi pi-wifi',
    title: 'Network & CCTV Setup',
    desc: 'Wi-Fi dead zones, slow connections, or security camera installations — we handle home and office networking.',
    bg: 'rgba(6,182,212,0.15)',
    color: '#06b6d4',
  },
];

function callUs() {
  window.location.href = 'tel:+94XXXXXXXXX';
}
</script>

<style scoped>
.discovery-hero-title {
  color: var(--inco-text-primary);
  background: linear-gradient(90deg, #fff 60%, var(--inco-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.service-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 123, 255, 0.15);
}

.city-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.06);
  color: var(--inco-text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}
.city-chip:hover,
.city-chip--active {
  background: rgba(59, 130, 246, 0.15);
  border-color: var(--inco-primary-light);
  color: var(--inco-primary-light);
}
.city-chip--active {
  font-weight: 700;
}

.hover-tag {
  transition: transform 0.15s ease;
}
.hover-tag:hover {
  transform: scale(1.05);
}
</style>
