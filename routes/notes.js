const express = require("express");
const { isSignedin } = require("../middlewares/auth");
const { getUserByID } = require("../controllers/user");
const {
  createNote,
  getNoteById,
  getNote,
  deleteNote,
  updateNote,
  searchNotes,
  addToPinnedNotes,
  removeToPinnedNotes,
  changeColor,
  addToLikedNotes,
} = require("../controllers/notes");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

//note  - id retrive
router.param("noteId", getNoteById);

// user - id
router.param("userId", getUserByID);

//create notes
router.post("/notes/:userId/create", isSignedin, createNote);

//get note by id
// router.get("/notes/:noteId", isSignedin, getNote);

//delete note by id
router.delete("/notes/:noteId/:userId/delete", isSignedin, deleteNote);

//update note
router.put("/notes/:noteId/:userId/update", isSignedin, updateNote);

//search all
router.get("/notes/search", isSignedin, searchNotes);

// Pin notes
router.patch("/notes/:noteId/pin", isSignedin, addToPinnedNotes);

//liked notes
router.patch("/notes/:noteId/favourite", isSignedin, addToLikedNotes);

// Unpin;
router.patch("/notes/:noteId/unpin", isSignedin, removeToPinnedNotes);

router.get("/notes/all/:userId", isSignedin, getNote);

//change the color
router.patch("/notes/:noteId/color", isSignedin, changeColor);

//Upload the drawn note
router.post("notes/:noteId/upload-file", isSignedin);
module.exports = router;
