const express = require("express");
const { isSignedin} = require("../middlewares/auth");
const {getUserByID} = require("../controllers/user");
const {
  createNote,
  getNoteById,
  getNote,
  deleteNote,
  updateNote,
  searchNotes,
  getAllNotes,
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

//update note
router.put("/update/note/:noteId/:userId", isSignedin, updateNote);

//search all
router.get("/notes", isSignedin, getAllNotes);

module.exports = router;