const express = require('express');
const router = express.Router();
const { createRole } = require('../controllers/roleController');
const authMiddleware = require("../middleware/authMiddleware");

// Create role
router.post("/create", authMiddleware("CreateRole"), createRole);

module.exports = router;
