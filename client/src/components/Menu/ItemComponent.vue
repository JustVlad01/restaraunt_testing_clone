<template>
  <div class="item">
    <span class="quantity" v-if="quantity > 0">{{ quantity }}</span>
    <div class="item-image" v-if="item.imageURL">
      <img :src="item.imageURL" alt="Item Image" />
    </div>
    <div class="item-content">
      <h3 class="item-title">{{ item.title }}</h3>
<!--      <p class="item-description">{{ item.description }}</p>-->
      <p class="item-price">
        <span class="discount-price" v-if="item.discountPrice">€{{ item.discountPrice }}</span>
        <span class="normal-price" :class="{discounted: item.discountPrice}">€{{ item.price }}</span>
      </p>
<!--      <p v-if="item.allergens.length" class="item-allergens">-->
<!--        <strong>Allergens:</strong> {{ item.allergens.join(", ") }}-->
<!--      </p>-->
      <div class="add-btn" @click="selectItem()">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 18 18">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrderStore } from "@/stores/orderState.js";
import {computed} from "vue";
import {useCartStore} from "@/stores/cartState.js";

const orderStore = useOrderStore();
const cartStore = useCartStore();
const props = defineProps({ item: Object });

const quantity = computed(() => cartStore.getQuantity(props.item._id));

const selectItem = () => {
  orderStore.itemSelected = props.item;
};
</script>

<style scoped>
.add-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  cursor: pointer;
}

.quantity {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  padding: 5px 10px;
  border-radius: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.add-btn svg {
  fill: #202e5b;
  transition: fill 0.2s;
}

.add-btn:hover svg {
  fill: #4371ff;
  transition: fill 0.2s;
}

.item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  position: relative;
}

.item-image {
  overflow: hidden;
  aspect-ratio: 16/9;
}

.item-image img {
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
}

.item-content {
  margin-top: 10px;
}

.item-title {
  font-size: 14px;
  border-radius: 5px;
  margin-bottom: 5px;
  text-transform: capitalize;
}

.item-description {
  font-size: 0.8rem;
  color: #818181;
  margin-bottom: 10px;
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
</style>