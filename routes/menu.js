const express = require('express');
const router = express.Router();
const {createMenu, getMenuById, updateMenu, deleteMenu, getMenusAvailableNow, getAllMenusByRestaurant} = require("../controllers/menuController");
const authMiddleware = require('../middleware/authMiddleware');

// Create a menu
router.post('/create', authMiddleware('CreateMenu'), createMenu);

// Update a menu
router.put('/update/:id', authMiddleware('UpdateMenu'), updateMenu);

// Retrieve all menus for a specific hotel (admin and client side)
router.get('/allMenus', authMiddleware('ViewMenuAdmin'), getAllMenusByRestaurant);

// Delete a menu
router.delete('/delete/:id', authMiddleware('DeleteMenu'), deleteMenu);

// Get a menu by ID
router.get('/:id', authMiddleware('ViewMenu'), getMenuById);

// Retrieve all menus available right now based on time range (no restrictions)
router.get('/:restaurantId/available-now', getMenusAvailableNow);

module.exports = router;
