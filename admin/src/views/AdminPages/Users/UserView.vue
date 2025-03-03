<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import UserBlock from "@/components/Admin/Users/userBlock.vue";
import Popup from "@/components/Common/popup.vue";
import { useUserStore } from "@/stores/usersStore.js";

let userStore = useUserStore();

let popup = ref(false);

let users = ref([]);

const openPopup = () => {
  popup.value = true;
}

onMounted(async () => {
  await userStore.fetchUsers();

  users.value = userStore.users;
})
</script>

<template>
  <div>
    <popup v-if="popup" title="Add user" :visible="popup" @close="popup = false">
      <div>
        <input type="text" placeholder="Name">
        <input type="text" placeholder="Username">
        <input type="text" placeholder="Email">
        <input type="password" placeholder="Password">
        <input type="password" placeholder="Confirm password">
        <button class="blue-btn">Add user</button>
      </div>
    </popup>
    <div class="page-header">
      <h2>Users</h2>
      <div class="blue-btn" @click="openPopup()">Add user
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"></path>
        </svg>
      </div>
    </div>
    <div class="users">
      <user-block v-for="user in users" :key="user._id" :user="user"/>
    </div>
  </div>
</template>

<style scoped>
.users {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.blue-btn {
  padding: 10px 20px;
  background-color: #2f80ed;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.blue-btn svg {
  margin-left: 15px;
}

.blue-btn:hover {
  background-color: #2f70ed;
}
</style>