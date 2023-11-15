const express = require("express");
const { isSignedin, isAuthenticated } = require("../middlewares/auth");
const { getAllUsers } = require("../controllers/user");
const router = express.Router();

router.get("/users" , isSignedin, getAllUsers);


module.exports = router;