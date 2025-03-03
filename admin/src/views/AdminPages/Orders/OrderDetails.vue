<template>
  <div>
    <h1>Order Detail</h1>
    <div v-if="loading">Loading order details...</div>
    <div v-if="error" class="error">{{ error.message || error }}</div>
    <div v-if="order">
      <p><strong>Order Number:</strong> {{ order.orderNumber }}</p>
      <p><strong>Status:</strong> {{ order.status }}</p>
      <p><strong>Payment ID:</strong> {{ order.paymentId }}</p>
      <h3>Items Purchased:</h3>
      <ul>
        <li v-for="item in order.items" :key="item._id">
          Product ID: {{ item.product }} - Quantity: {{ item.quantity }} - Comments: {{ item.comments }}
        </li>
      </ul>
      <!-- Additional order details can go here -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore';

const route = useRoute();
const orderStore = useOrderStore();

const order = computed(() => orderStore.order);
const loading = computed(() => orderStore.loading);
const error = computed(() => orderStore.error);

onMounted(() => {
  const orderId = route.params.id;
  orderStore.fetchOrderById(orderId);
});
</script>

<style scoped>
.error {
  color: red;
}
</style>