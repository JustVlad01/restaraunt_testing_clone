<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  menu: Object,
});

const actionListOpen = ref(false);

const toggleActionList = () => {
  actionListOpen.value = !actionListOpen.value;
};

const isTimeInRange = (current, start, end) => {
  const [currentHour, currentMinute] = current.split(":").map(Number);
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const currentTime = currentHour * 60 + currentMinute;
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  return currentTime >= startTime && currentTime <= endTime;
};

// Compute if the menu is active based on current time
const menuStatus = computed(() => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
  ).padStart(2, "0")}`;
  const { start, end } = props.menu.timeRange;
  return isTimeInRange(currentTime, start, end) ? "Active" : "Inactive";
});

</script>

<template>
<div class="menu-item-block">
  <div class="image-preview">
    <img :src="menu.imageURL" v-if="menu.imageURL" alt="menu image" />
    <span v-else>No Image</span>
  </div>
  <div class="menu-item-info">
    <h2>{{ menu.title }}</h2>
    <p class="menu-description">{{ menu.description }}</p>
  </div>
  <div class="open-times">
    <span>{{ menu.timeRange.start }}</span>
    <p>to</p>
    <span>{{ menu.timeRange.end }}</span>
    <p
      :style="{ color: menuStatus === 'Active' ? 'green' : 'red' }"
    >{{ menuStatus }}</p>
  </div>
  <div class="menu-item-actions">
    <div class="actions-btn" @click="toggleActionList">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"></path>
      </svg>
    </div>
    <ul class="actions-list" v-if="actionListOpen">
      <li>
        <router-link :to="`edit/${menu._id}`">Edit</router-link>
      </li>
      <li>
        <router-link to="/duplicate">Duplicate</router-link>
      </li>
      <li>
        <router-link to>Delete</router-link>
      </li>
    </ul>
  </div>
</div>
</template>

<style scoped>
.open-times > span {
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.actions-list {
  position: absolute;
  right: 0;
  top: 29px;
  padding: 0;
  color: white;
  background-color: #375f8a;
  border: 1px solid #007bff;
  border-radius: 5px;
  list-style: none;
  z-index: 10;
}

.actions-list li > a {
  padding: 7px;
  cursor: pointer;
  display: inline-block;
  width: 100%;
  font-size: 14px;
  position: relative;
}

.actions-list li > a:after {
  content: "";
  display: block;
  position: absolute;
  bottom: -1px;
  left: 5%;
  width: 90%;
  height: 1px;
  background-color: white;
}

.actions-list li > a:hover {
  background-color: #007bff;
  color: white;
}

.open-times > p {
  font-size: 0.6rem;
}

.open-times > span {
  font-size: 0.8rem;
  background-color: #375f8a;
  color: white;
  padding: 3px 8px;
  border-radius: 5px;
}

.menu-item-block {
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  align-items: center;
  position: relative;
}

.menu-item-block h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.menu-description{
  font-size: 0.8rem;
  text-transform: capitalize;
  font-weight: 300;
  line-height: 1.1;
  color: #7b7b7b;
  overflow: hidden;
  max-height: 3.3em;
}

.menu-item-info {
  flex: 2;
}

.image-preview {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 5px;
  margin-right: 20px;
  text-align: center;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.open-times {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.image-preview span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #9fc8f0;
  border-radius: 5px;
}

.menu-item-actions {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  gap: 5px;
}

.actions-btn, .delete-btn {
  padding: 5px 5px 1px 5px;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .image-preview {
    width: 100%;
    height: 80px;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .menu-item-block h2 {
    font-size: 1rem;
    overflow: hidden;
  }

  .menu-description {
    font-size: 0.6rem;
    margin-bottom: 10px;
    max-height: 2.2em;
  }

  .menu-item-block {
    flex-direction: column;
    padding-top: 35px;
    align-items: flex-start;
  }

  .actions-btn {
    padding: 5px;
    cursor: pointer;
  }

  .menu-item-actions {
    position: absolute;
    top: 6px;
    right: 10px;
  }

  .open-times {
    flex-direction: row;
    position: absolute;
    top: 8px;
    left: 10px;
  }

  .open-times > span {
    font-size: 0.6rem;
    padding: 3px 5px;
    font-family: sans-serif;
  }
}
</style>