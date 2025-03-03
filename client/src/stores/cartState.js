import {defineStore} from 'pinia';
import axios from 'axios';
import {loadStripe} from "@stripe/stripe-js";

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        fetchedItems: {},
    }),
    actions: {
        addItem(productId, quantity) {
            const item = this.items.find((item) => item.product === productId);
            if (item) {
                if (item.quantity + quantity <= 0) {
                    this.removeItem(productId);
                    return;
                }
                item.quantity += quantity;
            } else {
                if (quantity <= 0) {
                    return;
                }
                this.items.push({product: productId, quantity, comments: []});
            }

            this.fetchCheckoutDetails();
        },

        getQuantity(productId) {
            const item = this.items.find((item) => item.product === productId);
            return item ? item.quantity : 0;
        },

        getItemById(productId) {
            return this.items.find((item) => item.product === productId);
        },

        removeItem(productId) {
            this.items = this.items.filter((item) => item.product !== productId);
            this.fetchCheckoutDetails();
        },

        addComment(productId, comment) {
            const item = this.items.find((item) => item.product === productId);
            if (item) {
                item.comments.push(comment);
            }
        },

        removeComment(productId, comment) {
            const item = this.items.find((item) => item.product === productId);
            if (item) {
                item.comments = item.comments.filter((c) => c !== comment);
            }
        },

        getComments(productId) {
            const item = this.items.find((item) => item.product === productId);
            return item ? item.comments : [];
        },

        async fetchCheckoutDetails() {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/cart/checkout`, {
                    items: this.items
                });
                this.fetchedItems = response.data;
            } catch (error) {
                console.error('Failed to fetch checkout details:', error);
                throw error;

            }
        },

        async initiatePayment(restaurant) {
            console.log('Initiating payment');
            try {
                // Get Stripe publishable key
                const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

                console.log(restaurant);

                // Create payment session
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/payment/create-payment-intent`, {
                    items: this.items,
                    restaurantId: restaurant._id
                });

                // Redirect to Stripe Checkout
                await stripe.redirectToCheckout({
                    sessionId: response.data.id
                });

            } catch (error) {
                console.error('Payment error:', error);
                throw error;
            }
        }
    }
});