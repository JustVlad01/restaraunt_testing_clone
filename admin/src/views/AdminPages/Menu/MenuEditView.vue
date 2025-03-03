<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { useMenuStore } from "@/stores/menuStore";
import CategoryBlock from "@/components/Admin/Menu/CategoryBlock.vue";
import axios from "axios";
import {Fancybox} from "@fancyapps/ui";

const menuStore = useMenuStore();
const router = useRouter();
const toast = useToast();

const isLoading = ref(true);
const menu = reactive({
  title: "",
  shortTitle: "",
  description: "",
  timeRange: { start: "", end: "" },
  categories: [],
  imageURL: "",
});

// Define validation rules
const rules = computed(() => ({
  title: { required, minLength: minLength(3) },
  shortTitle: { required, minLength: minLength(2) },
  timeRange: {
    start: { required },
    end: { required },
  },
}));

// Initialize Vuelidate
let v$ = useVuelidate(rules, menu);

const fetchMenu = async () => {
  try {
    const menuId = router.currentRoute.value.params.id;
    await menuStore.getMenuById(menuId);
    Object.assign(menu, menuStore.menu);
    v$ = useVuelidate(rules, menu);
    isLoading.value = false;
  } catch (error) {
    toast.error("Failed to fetch menu. Redirecting...");
    router.push("/admin/menus");
  }
};

// Fetch the menu data when the component is mounted
onMounted(() => {
  menuStore.clearMenu();
  fetchMenu();
  Fancybox.bind('[data-fancybox]', {
    // Your options here
  });
});

// Form submission
const submitForm = async () => {
  v$.value.$touch(); // Trigger validation
  if (!v$.value.$invalid) {
    try {
      const menuId = router.currentRoute.value.params.id;
      await menuStore.updateMenu(menuId, menu);
      toast.success("Menu updated successfully!");
    } catch (error) {
      toast.error("Failed to update menu. Please try again.");
    }
  }
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/image/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });

    menu.imageURL = response.data.imageUrl;
    console.log('menu.imageURL', menu);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

// Handle image file selection
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) await uploadImage(file);
};
</script>

<template>
  <div v-if="isLoading" class="loading">
    <p>Loading...</p>
  </div>

  <div v-else class="menu-add-view">
    <h1>Edit Menu</h1>

    <div class="menu-add-form">
      <div class="inner-block">
        <div>
          <label>Menu Icon:</label>
          <input type="file" @change="(event) => handleImageUpload(event)" />

          <!-- Display Image Preview -->
          <a v-if="menu.imageURL" :href="menu.imageURL" class="image-preview" data-fancybox data-caption="Single image">
            <img :src="menu.imageURL"  alt="image_item"/>
          </a>
        </div>

        <div>
          <label>Title:</label>
          <input v-model="v$.title.$model" />
          <span v-if="v$.title.$error" class="error">Title is required and must be at least 3 characters.</span>
        </div>

        <div>
          <label>Short Title:</label>
          <input v-model="v$.shortTitle.$model" />
          <span v-if="v$.shortTitle.$error" class="error">Short title is required and must be at least 2 characters.</span>
        </div>

        <div>
          <label>Description:</label>
          <textarea v-model="menu.description"></textarea>
        </div>

        <div>
          <label>Time Range:</label>
          <input type="time" v-model="v$.timeRange.start.$model" />
          <input type="time" v-model="v$.timeRange.end.$model" />
          <span v-if="v$.timeRange.start.$error || v$.timeRange.end.$error" class="error">
            Start and end times are required.
          </span>
        </div>

        <div v-for="(category, index) in menu.categories" :key="index">
          <CategoryBlock :categoryIndex="index" />
        </div>

        <button class="addCategory" @click="menuStore.addCategory">
          Add Category
        </button>

        <button @click="submitForm">Submit Menu</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inner-block {
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

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
