const express = require('express');
const { createPayment } = require('../controllers/paymentController');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe.Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const Order = require('../models/order');

const generateOrderNumber = () => {
    return 'ORD-' + Date.now();
};

router.post('/create-payment-intent', createPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    console.log("Webhook received");

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(paymentIntent);
            if (paymentIntent.metadata && paymentIntent.metadata.items && paymentIntent.metadata.restaurantId) {
                try {
                    // Parse items from metadata
                    const items = JSON.parse(paymentIntent.metadata.items);
                    const restaurantId = paymentIntent.metadata.restaurantId;
                    const orderNumber = generateOrderNumber();
                    const totalAmount = paymentIntent.amount; // Amount in cents
                    const currency = paymentIntent.currency;
                    const paymentId = paymentIntent.id;

                    // Create order data object
                    const orderData = {
                        orderNumber,
                        restaurantId,
                        paymentId,
                        items,          // Expected to be an array of items { product, quantity, comments }
                        totalAmount,
                        currency,
                        customerInfo: {}, // Optionally extract from paymentIntent.charges.data[0].billing_details if available
                        status: 'pending',
                        history: [{
                            changes: 'Order created via webhook on payment success',
                            managerId: null,
                            updatedAt: new Date()
                        }]
                    };

                    // Create and save the order document in MongoDB
                    const newOrder = new Order(orderData);
                    await newOrder.save();
                    console.log('Order created:', newOrder);
                } catch (orderError) {
                    console.error('Error creating order:', orderError);
                }
            } else {
                console.log('PaymentIntent metadata missing required fields (items, restaurantId).');
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
});

module.exports = router;