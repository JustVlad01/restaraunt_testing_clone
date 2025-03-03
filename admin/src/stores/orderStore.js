import { defineStore } from 'pinia';
import axios from 'axios';

export const useOrderStore = defineStore('orderStore', {
    state: () => ({
        orders: [],
        order: null,
        loading: false,
        error: null,
    }),
    actions: {
        async fetchOrders() {
            this.loading = true;
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/order`, {withCredentials: true});
                this.orders = response.data;
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async fetchOrderById(orderId) {
            this.loading = true;
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/order/${orderId}`, {withCredentials: true});
                this.order = response.data;
            } catch (error) {
                this.error = error;
            } finally {
                this.loading = false;
            }
        },
        async updateOrder(orderId, updateData) {
            try {
                const response = await axios.put(`${import.meta.env.VITE_API_URL}/order/${orderId}`, updateData, {withCredentials: true});
                this.order = response.data;
            } catch (error) {
                this.error = error;
            }
        },
    }
});
