<script setup>
import {useOrderStore} from "@/stores/orderState.js";
import {useCartStore} from "@/stores/cartState.js";
import {ref} from "vue";

const orderStore = useOrderStore();
const cartStore = useCartStore();

const input = ref("");

const addComment = () => {
  cartStore.addComment(orderStore.itemSelected._id, input.value);
  input.value = "";
};

const inputLimit = 20;

//Fuction to output current limit for input
const getLimit = () => {
  return inputLimit - input.value.length;
};

const removeComment = (item, text) => {
  cartStore.removeComment(item, text);
};
</script>

<template>
<div class="comments-section">
  <span class="comments-title">Comments</span>
  <div class="input-filed">
    <input type="text" v-model="input" placeholder="Write a comment..." :maxlength="inputLimit" />
    <span>{{getLimit()}}</span>
    <div class="btn btn-primary" @click="addComment">Add</div>
  </div>
  <div class="comment-field" v-for="comment in cartStore.getComments(orderStore.itemSelected._id)">
    <p>{{comment}}</p>
    <div class="btn btn-danger" @click="removeComment(orderStore.itemSelected._id, comment)">Remove</div>
  </div>
</div>
</template>

<style scoped>
.btn-danger {
  background-color: #ff4d4d;
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.comments-section {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.comments-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.input-filed {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.input-filed input {
  width: calc(100% - 100px);
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-filed .btn {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #202e5b;
  color: white;
  cursor: pointer;
}

.input-filed .btn:hover {
  background-color: #4371ff;
}

.comment-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  background-color: #f0f0f0;
  padding: 5px;
  color: #202e5b;
}
</style>