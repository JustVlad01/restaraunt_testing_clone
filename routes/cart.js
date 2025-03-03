const { getCheckoutData } = require('../controllers/cartController.js');
const express = require('express');
const router = express.Router();

router.post('/checkout', getCheckoutData);

module.exports = router;