<script setup>
import { ref } from "vue";

// Props for title and description
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "", // Description is optional
  },
  open: {
    type: Boolean,
    required: false,
    default: false,
  },
  subMenu: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const isOpen = ref(props.open); // State to track dropdown open/close

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="dropdown" :class="{sub: subMenu}">
    <div class="dropdown-header" @click="toggleDropdown">
      <span>{{ title }}</span>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-chevron-down"
          :class="{ rotated: isOpen }"
          viewBox="0 0 16 16"
      >
        <path
            fill-rule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </div>

<!--    <div v-if="description" class="dropdown-description">-->
<!--      {{ description }}-->
<!--    </div>-->

    <div v-if="isOpen" class="dropdown-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  border-radius: 5px;
  overflow: hidden;
  background-color: white;
  border: 1px solid #485272;
  margin-bottom: 10px;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #1e3272;
  color: white;
  cursor: pointer;
  text-transform: capitalize;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.dropdown.sub{
  border-radius: 5px;
}

.dropdown.sub > .dropdown-header {
  background-color: #485272;
}

.dropdown.sub > .dropdown-header:hover {
  background-color: #2b334d;
}

.dropdown.sub .dropdown-inner{
  padding: 15px;
}

.dropdown-header:hover {
  background-color: #3a63e8;
}

.bi-chevron-down {
  transition: transform 0.3s ease;
}

.bi-chevron-down.rotated {
  transform: rotate(180deg);
}

.dropdown-description {
  padding: 10px 15px;
  background-color: #d4d4d4;
  font-size: 0.8rem;
  color: #5c5c5c;
  text-transform: capitalize;
  border-top: 1px solid #ccc;
}

/* Inner Section */
.dropdown-inner {
  padding: 0;
  background-color: #fff;
  font-size: 0.9rem;
  color: #555;
}
</style>