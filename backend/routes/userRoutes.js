// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// GET /api/users/me – Get current user
router.get("/me", authMiddleware, getUserProfile);

// PUT /api/users/me – Update profile
router.put("/me", authMiddleware, updateUserProfile);

module.exports = router;
