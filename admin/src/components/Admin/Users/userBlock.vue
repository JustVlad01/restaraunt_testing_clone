<script setup>
import {ref} from "vue";

const props = defineProps({
  user: Object
});

const user = ref(props.user);
</script>

<template>
<a :href="'./users/' + user._id" class="user-block">
  <div class="user-block__avatar" v-if="user.avatar">
    <img :src="user.avatar" alt="avatar">
  </div>
  <div class="user-block__info">
    <p class="text-highlight-blue">{{user.roleId.name}}</p>
    <h3 class="name">{{user.name}}</h3>
    <p class="username">{{user.username}}</p>
    <p class="email">{{user.email}}</p>
  </div>
</a>
</template>

<style scoped>
.text-highlight-blue {
  width: max-content;
  text-transform: capitalize;
  font-size: 0.8rem;
  padding: 3px 5px;
  margin-bottom: 5px;
  font-weight: 600;
}

.user-block {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  position: relative;
  background-color: white;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.user-block:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.user-block__avatar {
  margin-bottom: 20px;
}

.name {
  font-size: 1.2rem;
  font-weight: 600;
}

.email {
  color: #666;
  font-style: italic;
}

.username {
  color: #999;
}
</style>