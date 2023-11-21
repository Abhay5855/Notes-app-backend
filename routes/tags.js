const express = require("express");
const { isSignedin } = require("../middlewares/auth");
const { createTag } = require("../controllers/tag");

const router = express.Router();

router.post("/create/:noteId/tag", isSignedin, createTag);

module.exports = router;
