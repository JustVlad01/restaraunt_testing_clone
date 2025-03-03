<script setup>
import { useMenuStore } from "@/stores/menuStore.js";
import MenuItemBlock from "@/components/Admin/Menu/MenuItemBlock.vue";

const menuStore = useMenuStore();
menuStore.getAllMenus();
</script>

<template>
<div class="menu-view">
  <h1>Menus</h1>
  <div class="menu-list">
  <menu-item-block v-for="menu in menuStore.allMenus" :key="menu._id" :menu="menu" />
  </div>
</div>
</template>

<style scoped>
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>