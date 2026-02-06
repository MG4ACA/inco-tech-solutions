<template>
  <footer class="site-footer">
    <div class="section-container">
      <div class="grid">
        <!-- Brand -->
        <div class="col-12 md:col-4 mb-4 md:mb-0">
          <div class="flex align-items-center gap-2 mb-3">
            <i class="pi pi-desktop text-2xl" style="color: var(--inco-primary)"></i>
            <span class="text-xl font-bold">
              Inco
              <span style="color: var(--inco-primary)">Tech</span>
              Solutions
            </span>
          </div>
          <p
            class="text-sm mb-3"
            style="color: var(--inco-text-secondary); line-height: 1.7; max-width: 300px"
          >
            Your trusted partner for premium computers, laptops, accessories, and expert repair
            services.
          </p>
          <div class="flex gap-2">
            <Button icon="pi pi-facebook" class="p-button-rounded p-button-text p-button-sm" />
            <Button icon="pi pi-twitter" class="p-button-rounded p-button-text p-button-sm" />
            <Button icon="pi pi-instagram" class="p-button-rounded p-button-text p-button-sm" />
            <Button icon="pi pi-linkedin" class="p-button-rounded p-button-text p-button-sm" />
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-6 md:col-2">
          <h4 class="font-bold mb-3 text-sm" style="color: var(--inco-text-primary)">
            Quick Links
          </h4>
          <div class="flex flex-column gap-2">
            <router-link to="/" class="footer-link">Home</router-link>
            <router-link to="/catalog" class="footer-link">Shop All</router-link>
            <router-link to="/catalog?condition=new" class="footer-link">New Laptops</router-link>
            <router-link to="/catalog?condition=refurbished" class="footer-link">
              Refurbished
            </router-link>
          </div>
        </div>

        <!-- Services -->
        <div class="col-6 md:col-2">
          <h4 class="font-bold mb-3 text-sm" style="color: var(--inco-text-primary)">Services</h4>
          <div class="flex flex-column gap-2">
            <span class="footer-link">Laptop Repair</span>
            <span class="footer-link">Data Recovery</span>
            <span class="footer-link">Virus Removal</span>
            <span class="footer-link">Hardware Upgrade</span>
          </div>
        </div>

        <!-- Contact -->
        <div class="col-12 md:col-4">
          <h4 class="font-bold mb-3 text-sm" style="color: var(--inco-text-primary)">Contact Us</h4>
          <div class="flex flex-column gap-2">
            <div class="flex align-items-center gap-2 footer-link">
              <i class="pi pi-map-marker" style="color: var(--inco-primary-light)"></i>
              123 Tech Street, Digital City, DC 10001
            </div>
            <div class="flex align-items-center gap-2 footer-link">
              <i class="pi pi-phone" style="color: var(--inco-primary-light)"></i>
              +1 (555) 123-4567
            </div>
            <div class="flex align-items-center gap-2 footer-link">
              <i class="pi pi-envelope" style="color: var(--inco-primary-light)"></i>
              info@incotechsolutions.com
            </div>
            <div class="flex align-items-center gap-2 footer-link">
              <i class="pi pi-clock" style="color: var(--inco-primary-light)"></i>
              Mon - Sat: 9:00 AM - 7:00 PM
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="mt-4 pt-3" style="border-top: 1px solid var(--inco-border)">
        <div class="flex flex-wrap justify-content-between align-items-center">
          <p class="text-xs" style="color: var(--inco-text-secondary)">
            © {{ new Date().getFullYear() }} Inco Tech Solutions. All rights reserved.
          </p>
          <div class="flex gap-3 text-xs" style="color: var(--inco-text-secondary)">
            <span class="cursor-pointer hover:text-primary">Privacy Policy</span>
            <span class="cursor-pointer hover:text-primary">Terms of Service</span>
            <span class="cursor-pointer hover:text-primary">Warranty</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import Button from 'primevue/button';
</script>

<style scoped>
.footer-link {
  color: var(--inco-text-secondary);
  font-size: 0.875rem;
  transition: color 0.2s;
  cursor: pointer;
}

.footer-link:hover {
  color: var(--inco-primary-light);
}
</style>
