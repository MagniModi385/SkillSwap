// backend/routes/swapRoutes.js
const express = require("express");
const router = express.Router();
const {
  createSwap,
  getMySwaps,
  updateSwapStatus
} = require("../controllers/swapController");

const authMiddleware = require("../middleware/authMiddleware");

// Send a swap request
router.post("/", authMiddleware, createSwap);

// View all my swaps
router.get("/", authMiddleware, getMySwaps);

// Update status (accept/reject/delete)
router.patch("/:id", authMiddleware, updateSwapStatus);

module.exports = router;
