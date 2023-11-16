const express = require("express");
const { isSignedin} = require("../middlewares/auth");
const {getUserByID} = require("../controllers/user");
const { createNote, getNoteById, getNote } = require("../controllers/notes");
const router = express.Router();

//note- id retrive
router.param("noteId", getNoteById);

//create notes
router.post("/create/note" , createNote);


//get note by id
router.get("/note/:noteId" , getNote);


module.exports = router;