import { defineStore } from 'pinia';
import {reactive, ref} from 'vue';
import axios from "axios";
import router from "@/router/index.js";
import {useToast} from "vue-toastification";

const toast = useToast();

export const useUserStore = defineStore('userStore', () => {
      const users = ref([]);

      const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/all-users`, { withCredentials: true });
            users.value = response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        }
      };

    return { fetchUsers, users };
});