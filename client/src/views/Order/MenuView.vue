<script setup>
import { ref } from 'vue';
import { useOrderStore } from '@/stores/orderState.js';
import { useRestaurantStore } from "@/stores/restaurantState.js";
import MenuComponent from "@/components/Menu/MenuComponent.vue";
import MenuSelectBlock from "@/components/Common/MenuSelectBlock.vue";
import SelectedItemPopup from "@/components/Common/SelectedItemPopup.vue";
import {useCartStore} from "@/stores/cartState.js";
import CheckOutPopup from "@/components/Checkout/CheckOutPopup.vue";

const restaurantStore = useRestaurantStore();
const orderStore = useOrderStore();
const cartStore = useCartStore();
</script>

<template>
<div class="menus">
  <div class="menu-top">
    <h1>Menus</h1>
    <span class="table-num">{{orderStore.serviceTypeString()}}:<span>{{orderStore.number}}</span></span>
  </div>
  <p class="text-action">Select a menu to view items</p>
  <div class="menu-selection">
    <menu-select-block v-for="menu in restaurantStore.menus" :key="menu._id" :menu="menu"/>
  </div>
  <p v-if="restaurantStore.menus.length === 0">No menus available</p>
  <div class="go_chekout" @click="orderStore.toggleCheckoutWindow()" v-if="cartStore.fetchedItems.totalPrice">Checkout €{{parseFloat(cartStore.fetchedItems.totalPrice).toFixed(2)}}</div>
  <MenuComponent v-for="menu in restaurantStore.menus" :key="menu._id" :menu="menu" />
</div>
  <CheckOutPopup v-if="orderStore.checkoutWindowOpen" />
  <selected-item-popup v-if="orderStore.itemSelected"></selected-item-popup>
</template>

<style scoped>
.go_chekout {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #4371ff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%{
    outline: 1px solid #4371ff;
    box-shadow: 0 0 0 0px #4371ff;
    outline-offset: 5px;
  }
  50%{
    outline: 1px solid #4371ff;
    box-shadow: 0 0 10px 2px #4371ff;
    outline-offset: 0px;
  }
  100%{
    outline: 1px solid #4371ff;
    box-shadow: 0 0 0 0px #4371ff;
    outline-offset: 5px;
  }
}

.menus{
  padding: 20px;
  background-color: #f9f9f9;
  min-height: calc(100vh - 40px);
}

.menu-selection {
  display: flex;
  justify-content: left;
  gap: 10px;
  padding: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.text-action {
  font-size: 1.2rem;
  font-weight: bold;
  color: #5c5c5c;
  margin-bottom: 20px;
}

.menu-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.menus {
  padding: 20px;
  background-color: #f9f9f9;
}

.table-num {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  padding: 10px;
  border-radius: 5px;
  display: inline-block;
  background-color: #4371ff;
  text-transform: capitalize;
}

.table-num span {
  color: #4371ff;
  font-weight: bold;
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  margin-left: 5px;
}
</style>