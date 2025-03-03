<template>
  <div>
    <div class="main-layout">
      <!-- SideBar component with toggle functionality -->
      <SideBar class="side-bar" :class="{ open: sideBarOpen }" @toggle-sidebar="toggleSidebar" @close-sidebar="closeSidebar" />

      <!-- Main content area -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "@/components/Admin/Header.vue";
import SideBar from "@/components/Admin/SideBar.vue";
import { ref } from "vue";

// Sidebar visibility state
const sideBarOpen = ref(false);

// Function to toggle the sidebar visibility
const toggleSidebar = () => {
  sideBarOpen.value = !sideBarOpen.value;
};

const closeSidebar = () => {
  sideBarOpen.value = false;
};
</script>

<style scoped>
.main-layout {
  display: flex;
}

/* Main content area */
.content {
  padding: 20px;
  margin-left: 50px;
  width: calc(100% - 50px);
  transition: margin-left 0.3s ease, width 0.3s ease;
}

/* Adjust main content area when sidebar is closed */
.side-bar.open + .content {
  margin-left: 200px;
  width: calc(100% - 200px);
  transition: margin-left 0.3s ease, width 0.3s ease;
}

@media (max-width: 768px) {
  .side-bar.open + .content {
    margin-left: 0;
    width: 100%;
  }
}
</style>
