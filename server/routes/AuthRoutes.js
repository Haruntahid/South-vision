const express = require("express");
const router = express.Router();
const { createUser, login } = require("../controllers/AuthController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// Login route (public)
router.post("/v1/login", login);

// Create user (admin-only)
router.post("/v1/register", authenticateToken, isAdmin, createUser);

module.exports = router;
