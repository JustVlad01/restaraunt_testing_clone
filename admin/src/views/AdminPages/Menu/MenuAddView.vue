<script setup>
import { useMenuStore } from '@/stores/menuStore';
import CategoryBlock from '@/components/Admin/Menu/CategoryBlock.vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import axios from "axios";
import {onMounted, ref} from "vue";
import {Fancybox} from "@fancyapps/ui";

const menuStore = useMenuStore();
const imagePreview = ref(null);

onMounted(() => {
  menuStore.clearMenu();
  Fancybox.bind('[data-fancybox]', {
    // Your options here
  });
});

const rules = {
  title: { required, minLength: minLength(3) },
  shortTitle: { required, minLength: minLength(2) },
  timeRange: {
    start: { required },
    end: { required }
  }
};

// Initialize Vuelidate with the rules and the menu data in the store
const v$ = useVuelidate(rules, menuStore.menu);

// Function to reset error on input
const onInput = (field) => {
  v$[field].$reset();
};

const submitForm = () => {
  v$.value.$touch(); // Marks all fields as touched for validation
  if (!v$.value.$invalid) {
    menuStore.submitMenu(); // Submit only if the form is valid
  }
};

const uploadImage = async (file, menu) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/image/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });

    menu.imageUrl = response.data.imageUrl;
    imagePreview.value = response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

// Handle image file selection
const handleImageUpload = async (event, item) => {
  const file = event.target.files[0];
  if (file) await uploadImage(file, item);
};
</script>

<template>
  <div class="menu-add-view">
    <h1>Add Menu</h1>

    <div class="menu-add-form">
      <div class="inner-block">
        <div>
          <label>Menu Icon:</label>
          <input type="file" @change="(event) => handleImageUpload(event, menuStore.menu)" />

          <!-- Display Image Preview -->
          <a v-if="imagePreview" :href="imagePreview" class="image-preview" data-fancybox data-caption="Single image">
            <img :src="imagePreview"  alt="image_item"/>
          </a>
        </div>

        <div>
          <label>Title:*</label>
          <input v-model="v$.title.$model" @input="onInput('title')" placeholder="Enter menu title" />
          <span v-if="v$.title.$error" class="error">Title is required and must be at least 3 characters.</span>
        </div>

        <div>
          <label>Short Title:*</label>
          <input v-model="v$.shortTitle.$model" @input="onInput('shortTitle')" placeholder="Enter short title" />
          <span v-if="v$.shortTitle.$error" class="error">Short title is required and must be at least 2 characters.</span>
        </div>

        <div>
          <label>Description:</label>
          <textarea v-model="menuStore.menu.description" placeholder="Enter menu description"></textarea>
        </div>

        <div>
          <label>Time Range:*</label>
          <input type="time" v-model="v$.timeRange.start.$model" @input="onInput('timeRange.start')" />
          <input type="time" v-model="v$.timeRange.end.$model" @input="onInput('timeRange.end')" />
          <span v-if="v$.timeRange.start.$error || v$.timeRange.end.$error" class="error">
            Start and End time are required.
          </span>
        </div>
      </div>

      <div v-for="(category, index) in menuStore.menu.categories" :key="index">
        <CategoryBlock :categoryIndex="index" />
      </div>

      <button class="addCategory" @click="menuStore.addCategory">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"></path>
        </svg>Add Category
      </button>

      <button @click="submitForm">Submit Menu</button>
    </div>
  </div>
</template>

<style scoped>
.image-preview {
  max-width: 300px;
  display: block;
  margin: 10px 0;
  border-radius: 5px;
  border: 2px solid #1f4ed8;
  transition: all 0.5s;
}

.image-preview:hover{
  max-width: 350px;
  transition: all 0.5s;
}

img {
  max-width: 100%;
  border-radius: 5px;
}

.inner-block {
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.addCategory {
  margin: 10px auto;
  display: flex;
  align-items: center;
  background-color: #7e9bd2;
}

.addCategory svg {
  margin-right: 10px;
}

.addCategory:hover {
  background-color: #5e8bd2;
}

.menu-add-form > .inner-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.menu-add-form > .inner-block > div {
  margin-bottom: 10px;
}

.menu-add-form > .inner-block > div > input,
.menu-add-form > .inner-block > div > textarea {
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.menu-add-form > .inner-block > div > input[type="time"] {
  width: 100px;
}

.menu-add-form > .inner-block > div > label {
  margin: 5px 0;
  display: block;
}

.error {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}
</style>
