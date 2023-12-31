

const express = require("express");
const { Register, login, Logout } = require("../controllers/auth");
const { isSignedin } = require("../middlewares/auth");
const router = express.Router();

//register
router.post("/register" , Register);

//login
router.post("/login" , login);

// Logout
router.post("/logout", isSignedin, Logout);

module.exports = router;