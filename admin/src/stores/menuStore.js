import { defineStore } from 'pinia';
import {reactive, ref} from 'vue';
import axios from "axios";
import router from "@/router/index.js";
import {useToast} from "vue-toastification";

const toast = useToast();

export const useMenuStore = defineStore('menuStore', () => {
    let menu = reactive({
        title: '',
        shortTitle: '',
        description: '',
        timeRange: { start: '', end: '' },
        categories: [],
        imageURL: '',
    });
    let allMenus = ref([]);

    const addCategory = () => {
        menu.categories.push({
            id: Date.now() + Math.random(), // Add unique ID to category
            name: '',
            description: '',
            items: []
        });
    };

    const removeCategory = (index) => {
        menu.categories.splice(index, 1);
    };

    const addItemToCategory = (categoryIndex) => {
        menu.categories[categoryIndex].items.push({
            id: Date.now() + Math.random(), // Add unique ID to item
            title: '',
            description: '',
            price: '',
            availability: true,
            discountPrice: '',
            allergens: [],
            imageURL: ''
        });
    };

    const submitMenu = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/menu/create`,
                menu,
                { withCredentials: true }
            );

            if (response.status === 201) {
                await router.push({ name: 'allMenu' });
            }
        } catch (error) {
            toast.error('Error submitting menu');
            console.error('Error submitting menu:', error);
        }
    };

    const updateMenu = async (id, menu) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/menu/update/${id}`,
                menu,
                { withCredentials: true }
            );

            if (response.status === 200) {
                await router.push({ name: 'allMenu' });
            }
        }catch (error) {
            toast.error('Error updating menu');
            console.error('Error updating menu:', error);
        }
    };

    const clearMenu = () => {
        menu.title = '';
        menu.shortTitle = '';
        menu.description = '';
        menu.timeRange.start = '';
        menu.timeRange.end = '';
        menu.categories = [];
        menu.imageURL = '';
    };

    const getAllMenus = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/menu/allMenus`,
                { withCredentials: true }
            );
            allMenus.value = response.data;
        } catch (error) {
            toast.error('Error fetching menus');
            console.error('Error fetching menus:', error);
        }
    };

    const getMenuById = async (id) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/menu/${id}`,
                { withCredentials: true }
            );

            // Update the reactive menu object
            const fetchedMenu = response.data[0];
            if (fetchedMenu) {
                menu.title = fetchedMenu.title;
                menu.shortTitle = fetchedMenu.shortTitle;
                menu.description = fetchedMenu.description;
                menu.timeRange.start = fetchedMenu.timeRange.start;
                menu.timeRange.end = fetchedMenu.timeRange.end;
                menu.categories = fetchedMenu.categories || [];
                menu.imageURL = fetchedMenu.imageURL || '';
            }
        } catch (error) {
            toast.error('Error fetching menu by ID');
            console.error('Error fetching menu by ID:', error);
        }
    };

    return { menu, addCategory, removeCategory, addItemToCategory, submitMenu, getAllMenus, allMenus, getMenuById, updateMenu, clearMenu };
});