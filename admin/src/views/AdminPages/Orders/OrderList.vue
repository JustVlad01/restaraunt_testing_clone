<template>
  <div>
    <h1>Orders</h1>
    <div v-if="loading">Loading orders...</div>
    <div v-if="error" class="error">{{ error.message || error }}</div>
    <ul v-else>
      <li v-for="order in orders" :key="order._id">
        <router-link :to="`/admin/orders/details/${order._id}`">
          Order #{{ order.orderNumber }} - Status: {{ order.status }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useOrderStore } from '@/stores/orderStore';

const orderStore = useOrderStore();

const orders = computed(() => orderStore.orders);
const loading = computed(() => orderStore.loading);
const error = computed(() => orderStore.error);

onMounted(() => {
  orderStore.fetchOrders();
});
</script>

<style scoped>
.error {
  color: red;
}
</style>