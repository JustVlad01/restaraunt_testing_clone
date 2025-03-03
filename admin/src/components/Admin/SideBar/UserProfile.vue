<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const userProfile = ref({
  name: '',
  role: '',
  priority: null,
});

async function fetchUserProfile() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
      withCredentials: true, // Include credentials for cookies if needed
    });
    userProfile.value = response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}

// Fetch profile when component is mounted
onMounted(fetchUserProfile);
</script>

<template>
  <div class="profile-info">
    <div class="profile-pic"></div>
    <div class="info">
      <span>{{ userProfile.name }}</span>
      <span class="role">{{ userProfile.role }}</span>
    </div>
    <div class="profile-more">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"></path>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.profile-info {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #001f3e;
  padding: 10px;
  width: 100%;
}

.side-bar .profile-info div:not(.profile-pic) {
  display: none;
}

.side-bar.open .profile-info div{
  display: inherit;
}

.profile-pic {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
}

.info {
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  font-size: 10px;
}

.role {
  font-size: 10px;
  color: #a0a0a0;
}

.profile-more {
  position: absolute;
  right: 20px;
  cursor: pointer;
}
</style>