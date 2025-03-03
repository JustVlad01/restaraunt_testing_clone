const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Items', required: true },
    quantity: { type: Number, required: true },
    comments: [{ type: String }],
    status: { type: String, enum: ['active', 'voided'], default: 'active' },
});

const RefundSchema = new mongoose.Schema({
    refundId: { type: String },
    amount: { type: Number, required: true },
    itemsRefunded: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Items' },
        quantity: { type: Number, required: true }
    }],
    createdAt: { type: Date, default: Date.now },
    notes: { type: String }
});

const HistorySchema = new mongoose.Schema({
    updatedAt: { type: Date, default: Date.now },
    changes: { type: String }, // could also be a JSON/diff object
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // assuming managers are stored in a User collection
});

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    paymentId: { type: String, required: true }, // Stripe PaymentIntent id
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true }, // in cents (or smallest currency unit)
    currency: { type: String, default: 'eur' },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'canceled', 'refunded'],
        default: 'pending'
    },
    customerInfo: {
        name: { type: String },
        phone: { type: String },
        email: { type: String },
        tableNumber: { type: String }
    },
    history: [HistorySchema],
    refunds: [RefundSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);