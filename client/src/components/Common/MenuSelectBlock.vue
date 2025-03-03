<script setup>
import { useRestaurantStore } from "@/stores/restaurantState.js";

const restaurantStore = useRestaurantStore();
const props = defineProps({ menu: Object });
const selectMenu = () => {
  restaurantStore.selectMenu(props.menu._id);
};
</script>

<template>
<div class="menu-block" :class="{selected: restaurantStore.menuSelected === props.menu._id}" @click="selectMenu">
  <div class="menu-icon" v-if="props.menu.imageURL">
    <img :src="props.menu.imageURL" alt="menu icon" />
  </div>
  <span>{{menu.shortTitle}}</span>
</div>
</template>

<style scoped>
.menu-block {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #4371ff;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.menu-block.selected {
  transform: scale(1.05);
  background-color: #4371ff;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.menu-block > span {
  text-transform: capitalize;
}

.menu-block:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.menu-icon > img {
  width: 100%;
}

.menu-icon {
  width: 45px;
  height: 45px;
  background-color: #ebebeb;
  border-radius: 5px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>