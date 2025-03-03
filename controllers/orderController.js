const Order = require('../models/order'); // Our Order model defined earlier

// Create a new Order (triggered by a successful payment webhook)
const createOrder = async (req, res) => {
    try {
        const {
            orderNumber,       // Unique order number (generated on your side)
            restaurantId,      // Restaurant reference (ObjectId)
            paymentId,         // Stripe PaymentIntent id
            items,             // Array of items with { product, quantity, comments }
            totalAmount,       // Total order amount in smallest currency unit (e.g. cents)
            currency,          // Currency code (e.g. 'eur')
            customerInfo       // Optional: customer details like name, phone, email, tableNumber
        } = req.body;

        // Validate required fields
        if (!orderNumber || !restaurantId || !paymentId || !items || !totalAmount) {
            return res.status(400).json({ error: 'Missing required order fields' });
        }

        // Create new order document
        const newOrder = new Order({
            orderNumber,
            restaurantId,
            paymentId,
            items,        // Each item should include { product, quantity, comments }
            totalAmount,
            currency: currency || 'eur',
            customerInfo,
            status: 'pending', // Initial status, manager can update later
            history: [{
                changes: 'Order created',
                managerId: null,
            }]
        });

        await newOrder.save();
        return res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Retrieve an order by ID
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({_id: orderId, restaurantId: req.user.restaurantId});
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error('Error retrieving order:', error);
        return res.status(500).json({ error: error.message });
    }
};

// List orders (optionally filtered by restaurant or status)
const listOrders = async (req, res) => {
    try {
        const { restaurantId, status } = req.query;
        let filter = {};
        if (restaurantId) filter.restaurantId = restaurantId;
        if (status) filter.status = status;

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error listing orders:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Update an order (e.g., manager edits order details, status changes, voiding items)
const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const updateData = req.body;

        // Optionally add a history entry for the update
        const historyEntry = {
            changes: JSON.stringify(updateData),
            managerId: req.user ? req.user._id : null, // Assuming req.user contains manager info
            updatedAt: Date.now()
        };

        // Update order and push history entry
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                ...updateData,
                $push: { history: historyEntry },
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Add refund information to an order (for partial or full refunds)
const addRefundToOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { refundId, amount, itemsRefunded, notes } = req.body;
        if (!refundId || !amount || !itemsRefunded) {
            return res.status(400).json({ error: 'Missing refund details' });
        }

        const refundEntry = {
            refundId,
            amount,
            itemsRefunded, // Array of items { product, quantity }
            notes
        };

        const order = await Order.findByIdAndUpdate(
            orderId,
            { $push: { refunds: refundEntry } },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error('Error adding refund:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    listOrders,
    updateOrder,
    addRefundToOrder,
};
