<script setup>
import { useOrderStore } from "@/stores/orderState.js";
import {computed, ref} from "vue";
import {useCartStore} from "@/stores/cartState.js";
import CommentSection from "@/components/Common/CommentSection.vue";

const orderStore = useOrderStore();
const cartStore = useCartStore();
const closing = ref(false);

const commentOpen = ref(false);

const isItemAmountChosen = computed(() => cartStore.getQuantity(orderStore.itemSelected._id) > 0);

const toggleComment = () => {
  commentOpen.value = !commentOpen.value;
};

const closePopup = () => {
  closing.value = true;
  setTimeout(() => {
    orderStore.itemSelected = null;
    closing.value = false;
  }, 300);
};
</script>

<template>
<div class="popup-bg" @click="closePopup"></div>
  <div class="popup" :class="{closing: closing}">
    <div class="scrollable">
      <div class="popup-header">
        <h2>{{orderStore.itemSelected.name}}</h2>
        <div class="close-icon" @click="closePopup">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"></path>
          </svg>
        </div>
      </div>
      <div class="popup-body">
        <span class="item-title">{{orderStore.itemSelected.title}}</span>
        <div class="item-image">
          <img :src="orderStore.itemSelected.imageURL" alt="item image" />
        </div>
        <p class="item-description">{{orderStore.itemSelected.description}}</p>
        <p v-if="orderStore.itemSelected.allergens.length" class="item-allergens">
          <strong>Allergens:</strong> {{ orderStore.itemSelected.allergens.join(", ") }}
        </p>
      </div>
      <div v-if="isItemAmountChosen" @click="toggleComment" class="btn btn-secondary addComment">{{
        commentOpen ? "Close comments" : "Add Comments"
        }}</div>
      <CommentSection v-if="commentOpen && isItemAmountChosen"></CommentSection>
    </div>
    <div class="popup-footer">
      <p class="item-price">
        <span class="discount-price" v-if="orderStore.itemSelected.discountPrice">€{{ orderStore.itemSelected.discountPrice }}</span>
        <span class="normal-price" :class="{discounted: orderStore.itemSelected.discountPrice}">€{{ orderStore.itemSelected.price }}</span>
      </p>
      <div class="item-cart-buttons">
        <div class="btn btn-primary" @click="cartStore.addItem(orderStore.itemSelected._id, 1)">+</div>
        <div class="item-quantity">{{cartStore.getQuantity(orderStore.itemSelected._id)}}</div>
        <div class="btn btn-secondary" @click="cartStore.addItem(orderStore.itemSelected._id, -1)">-</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.addComment{
  width: max-content;
  padding: 10px 15px;
  margin: 10px auto;
  cursor: pointer;
  background-color: #202e5b;
  color: white;
  border-radius: 5px;
}

.addComment:hover {
  background-color: #4371ff;
}

.scrollable {
  max-height: calc(100% - 60px);
  overflow-y: auto;
  scrollbar-width: thin;
}

.item-cart-buttons {
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.item-cart-buttons .btn {
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 5px;
  margin: 0 5px;
  background-color: #202e5b;
  color: white;
  user-select: none;
}

.item-cart-buttons .btn:hover {
  background-color: #4371ff;
}

.item-cart-buttons .item-quantity {
  width: 50px;
  font-size: 1.2rem;
  text-align: center;
  border: 1px solid #202e5b;
  border-radius: 5px;
  margin: 0 5px;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 20px;
  width: calc(100% - 60px);
}

.popup-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  animation: fadeIn 0.3s forwards;
}

.popup{
  position: fixed;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 101;
  animation: slideUp 0.3s forwards;
  scrollbar-width: thin;
}

.closing {
  animation: slideDown 0.3s forwards;
}

.closing + .popup-bg {
  animation: fadeOut 0.3s forwards;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  padding: 10px 10px 5px 10px;
  border-radius: 50%;
}

.close-icon:hover {
  background-color: #f9f9f9;
}

.popup-body img {
  width: 100%;
}

.item-image {
  width: 100%;
  max-height: 300px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 5px;
}

.item-title {
  font-size: 1.5rem;
  color: #202e5b;
  margin-bottom: 10px;
  display: block;
}

.item-price {
  font-size: 1rem;
  margin: 10px 0;
}

.discount-price {
  margin-right: 5px;
  font-size: 1.3rem;
}

.item-price .normal-price {
  color: #000;
  font-size: 1.3rem;
}

.item-price .discounted {
  text-decoration: line-through;
  color: #999;
  font-size: 1rem;
}

.item-allergens {
  font-size: 0.7rem;
  color: #858585;
  margin-top: 10px;
}

.item-allergens strong {
  font-weight: bold;
}

.item-description {
  font-size: 0.9rem;
  color: #5c5c5c;
  margin: 10px 0;
}

@keyframes slideDown {
  from {
    top: 0;
  }
  to {
    top: 150%;
  }
}

@keyframes slideUp {
  from {
    top: 150%;
  }
  to {
    top: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>