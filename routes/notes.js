const express = require("express");
const { isSignedin} = require("../middlewares/auth");
const {getUserByID} = require("../controllers/user");
const {
  createNote,
  getNoteById,
  getNote,
  deleteNote,
} = require("../controllers/notes");
const router = express.Router();

//note  - id retrive
router.param("noteId", getNoteById);

// user - id
router.param("userId", getUserByID);

//create notes
router.post("/note/create/:userId", isSignedin, createNote);

//get note by id
router.get("/note/:noteId", isSignedin, getNote);

//delete note by id

router.delete("/delete/note/:noteId/:userId", isSignedin, deleteNote);


module.exports = router;