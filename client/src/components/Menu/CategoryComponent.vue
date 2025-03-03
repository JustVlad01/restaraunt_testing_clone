<template>
  <div class="category">
    <Dropdown :title="category.name" :sub-menu="true" :description="category.description">
      <div class="items-container">
        <ItemComponent
            v-for="item in category.items"
            :key="item._id"
            :item="item"
        />
      </div>
    </Dropdown>
  </div>
</template>

<script setup>
import ItemComponent from "./ItemComponent.vue";
import Dropdown from "@/components/Common/Dropdown.vue";
const props = defineProps({ category: Object });
</script>

<style scoped>
.items-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 300px));
  justify-content: center;
  gap: 20px;
}
</style>
