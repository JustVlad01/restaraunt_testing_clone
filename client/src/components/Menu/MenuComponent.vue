<template>
  <div class="menu" v-if="restaurantStore.menuSelected === menu._id">
      <div class="categories">
        <CategoryComponent
            v-for="category in menu.categories"
            :key="category._id"
            :category="category"
        />
      </div>
  </div>
</template>

<script setup>
import CategoryComponent from "./CategoryComponent.vue";
import Dropdown from "@/components/Common/Dropdown.vue";
import { useRestaurantStore } from "@/stores/restaurantState.js";

const restaurantStore = useRestaurantStore();
const props = defineProps({ menu: Object });
</script>

<style scoped>
.menu {
  margin-bottom: 20px;
}
</style>