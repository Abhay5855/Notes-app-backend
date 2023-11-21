const Notes = require("../models/notes");
const { notesValidator } = require("../validations/notes");

//create notes
exports.createNote = async (req, res) => {
  console.log(req.body, "req body");
  let note = new Notes(req.body);

  console.log(note);

  // const { error } = notesValidator.validate(req.body);

  // if (error) {
  //   return res.status(400).json({
  //     error: error.details[0].message,
  //   });
  // }

  try {
    await note.save();

    res.json({
      title: note.title,
      content: note.content,
      id: note._id,
      isPinned: note.isPinned,
    });
  } catch (err) {
    res.status(400).json({
      error: "Unable to save note to the db",
    });
  }
};

// delete notes - byID

exports.deleteNote = (req, res) => {
  const note = req.note;

  console.log(note, "deleted note");
  note
    .deleteOne()
    .then((result) => {
      if (result.deletedCount === 1) {
        res.json({
          message: "Successfully deleted the note",
          note: note, // You can still include the original note in the response if needed
        });
      } else {
        res.status(400).json({
          error: "Failed to delete the note",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
      });
    });
};

// delete notes - all

//get note by - id
exports.getNoteById = (req, res, next, id) => {
  Notes.findById(id)
    .exec()
    .then((notes) => {
      if (!notes) {
        return res.status(400).json({
          error: "note does not exist",
        });
      }

      req.note = notes;
      next();
    })
    .catch((err) => {
      return res.status(500).json({
        error: "Unable to fetch notes",
      });
    });
};

// get note
exports.getNote = (req, res) => {
  return res.json(req.note);
};

// update note - by id
exports.updateNote = async (req, res) => {
  const note = req.note;

  const { error } = notesValidator.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  try {
    // Save the updated note
    const updatedNote = await note.save();

    res.json(updatedNote);
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// get all notes
exports.searchNotes = (req, res) => {
  const { searchQuery } = req.query;

  const cleanedSearchQuery = searchQuery.replace(/"/g, "");

  const regexQuery = cleanedSearchQuery
    ? new RegExp(cleanedSearchQuery, "i")
    : "";

  // Use $or to search in both title and content
  const query = {
    $or: [
      { title: { $regex: regexQuery } },
      { content: { $regex: regexQuery } },
    ],
  };

  Notes.find(query)
    .exec()
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).json({
          error: "No notes found",
        });
      }

      const sanitizedResult = users.map((user) => {
        return user;
      });

      res.json(sanitizedResult);
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Unable to search notes",
      });
    });
};

//add to pinned Notes
exports.addToPinnedNotes = async (req, res) => {
  const { noteId } = req.params;

  try {
    //update according to the id
    const note = await Notes.findByIdAndUpdate(
      noteId,
      { isPinned: true },
      { new: true }
    );

    if (!note) {
      return res.status(400).json({
        error: "Failed to pin the note",
      });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Unpin the notes
exports.removeToPinnedNotes = async (req, res) => {
  const { noteId } = req.params;

  try {
    //update according to the id
    const note = await Notes.findByIdAndUpdate(
      noteId,
      { isPinned: false },
      { new: true }
    );

    if (!note) {
      return res.status(400).json({
        error: "Failed to remove the note",
      });
    }

    res.json(note.isPinned);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
