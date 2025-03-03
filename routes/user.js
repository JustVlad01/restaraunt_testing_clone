const express = require('express');
const router = express.Router();
const {createUser, loginUser, getUserProfile, getAllUsers} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Register user
router.post("/create", createUser);

// Login user
router.post("/login", loginUser);

//Get user profile
router.get("/profile", authMiddleware(), getUserProfile);

//Get all users
router.get("/all-users", authMiddleware("UsersGetAll"), getAllUsers);

module.exports = router;
