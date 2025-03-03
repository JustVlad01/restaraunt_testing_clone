const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orderController');
//Import middleware
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(), ordersController.createOrder);
router.get('/:orderId', authMiddleware(), ordersController.getOrderById);
router.get('/', authMiddleware(), ordersController.listOrders);
router.put('/:orderId', authMiddleware("UpdateOrder"), ordersController.updateOrder);
router.post('/:orderId/refund', authMiddleware("AddRefund"), ordersController.addRefundToOrder);

module.exports = router;
