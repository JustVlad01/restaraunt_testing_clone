<script setup>
import { ref } from 'vue';
import { useOrderStore } from '@/stores/orderState.js';
import { useRestaurantStore } from "@/stores/restaurantState.js";
import { useCartStore } from "@/stores/cartState.js";
import MenuGroup from "@/components/Checkout/MenuGroup.vue";

const restaurantStore = useRestaurantStore();
const orderStore = useOrderStore();
const cartStore = useCartStore();

const closing = ref(false);

const close = () => {
  closing.value = true;
  setTimeout(() => {
    orderStore.toggleCheckoutWindow();
    closing.value = false;
  }, 300);
};

const isProcessing = ref(false);

const handlePlaceOrder = async () => {
  try {
    isProcessing.value = true;

    // Initiate Stripe payment
    await cartStore.initiatePayment(restaurantStore.restaurant);

  } catch (error) {
    alert('Payment failed: ' + error.message);
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="checkout-popup" :class="{closing: closing}">
    <div class="popup">
      <div class="popup-header">
        <h2>Checkout</h2>
        <div class="close-icon" @click="close()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"></path>
          </svg>
        </div>
      </div>
      <div class="popup-body">
        <div class="checkout-items">
          <MenuGroup
              v-for="menuGroup in cartStore.fetchedItems.groupedData"
              :key="menuGroup.menu._id"
              :menu="menuGroup.menu"
              :categories="menuGroup.categories"
          />
        </div>
        <div class="checkout-total">
          <span>Total:</span>
          <span>€{{parseFloat(cartStore.fetchedItems.totalPrice).toFixed(2)}}</span>
        </div>
      </div>
      <div class="popup-footer">
        <div
            @click="handlePlaceOrder"
            class="btn btn-primary"
        >
          {{ isProcessing ? 'Processing...' : 'Place Order' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-popup {
  position: fixed;
  background-color: white;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  z-index: 100;
  animation: slideIn 0.3s;

  .popup {
    padding: 20px;
  }

  .popup-body {
    margin-top: 20px;
  }

  .checkout-total {
    display: flex;
    justify-content: end;
    gap: 10px;
    margin-top: 20px;
    font-size: 1.2rem;
  }

  .checkout-total span:first-child {
    font-weight: 600;
  }

  .popup-footer {
    display: flex;
    justify-content: end;
    margin-top: 20px;
  }

  .btn {
    cursor: pointer;
    padding: 10px 15px;
    border-radius: 5px;
    background-color: #4371ff;
    color: white;
    user-select: none;
  }

  .btn:hover {
    background-color: #4a9dff;
  }
}

.close-icon {
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
}

.closing {
  animation: slideOut 0.3s;
}

@keyframes slideOut {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
}

@keyframes slideIn {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
@media (max-width: 768px) {
  .checkout-popup {
    .popup {
      padding: 10px;
    }

    .checkout-total {
      font-size: 1rem;
    }

    .popup-footer {
      margin-top: 10px;
    }

    .btn {
      padding: 10px 20px;
      width: 100%;
      text-align: center;
    }
  }
}
</style>