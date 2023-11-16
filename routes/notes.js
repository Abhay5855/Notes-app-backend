const express = require("express");
const { isSignedin} = require("../middlewares/auth");
const {getUserByID} = require("../controllers/user");
const { createNote } = require("../controllers/notes");
const router = express.Router();

//user- id retrive
router.param("userId", getUserByID);


//create notes

router.post("/create/product" , createNote);


module.exports = router;