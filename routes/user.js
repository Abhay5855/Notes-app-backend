const express = require("express");
const { isSignedin, isAuthenticated } = require("../middlewares/auth");
const { getAllUsers, getUserByID, getUser } = require("../controllers/user");
const router = express.Router();


//user- id retrive
router.param("userId", getUserByID);

//get all users
router.get("/users" , isSignedin, getAllUsers);

//get user 
router.get("/user/:userId" , isSignedin, getUser);


module.exports = router;