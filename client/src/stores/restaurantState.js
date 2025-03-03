import { defineStore } from 'pinia';
import axios from 'axios';

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    restaurant: null,
    loading: false,
    error: null,
    menus: [],
    menuSelected: null,
  }),
  actions: {
    async getRestaurantData(id) {
      if (this.restaurant) return;

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/hotel/${id}`);
        this.restaurant = response.data;
      } catch (error) {
        console.error('Failed to fetch restaurant data:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async getAvailableMenus(){
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/menu/${this.restaurant._id}/available-now`);
        this.menus = response.data;
        console.log(this.menus);
      }catch (error) {
        console.error('Failed to fetch available menus:', error);
        this.error = error.message;
      }
    },

    selectMenu(menuId){
      this.menuSelected = menuId;
    }
  },
});