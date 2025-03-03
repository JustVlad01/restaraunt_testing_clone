const Stripe = require('stripe');
const stripe = new Stripe.Stripe(process.env.STRIPE_SECRET_KEY);
const Items = require('../models/items');

const createPayment = async (req, res) => {
    try {
        const { items, restaurantId } = req.body;

        if (!items || !restaurantId) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Extract product IDs from items
        const productIds = items.map(item => item.product);

        // Fetch product details from database
        const products = await Items.find({ _id: { $in: productIds } });

        // Create line items with quantities
        const lineItems = items.map(item => {
            const product = products.find(p => p._id.toString() === item.product);

            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.title,
                        images: [product.imageURL],
                    },
                    unit_amount: Math.round((product.discountPrice || product.price).toFixed(2) * 100), // Ensure integer
                },
                quantity: item.quantity,
            };
        });

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            payment_intent_data: {
                metadata: {
                    items: JSON.stringify(items),
                    restaurantId: restaurantId,
                }
            },
            success_url: `${process.env.CLIENT_FRONTEND_URL}/${restaurantId}/payment-success`,
            cancel_url: `${process.env.CLIENT_FRONTEND_URL}/${restaurantId}/payment-canceled`,
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createPayment };