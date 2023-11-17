const Notes = require("../models/notes");
const { notesValidator } = require("../validations/notes");

//create notes
exports.createNote = async (req, res) => {
  let product = new Notes(req.body);

  const { error } = notesValidator.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  try {
    await product.save();

    res.json({
      title: product.title,
      content: product.content,
      id: product._id,
    });
  } catch (err) {
    return res.status(400).json({
      error: "Unable to save user to the db",
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
exports.getAllNotes = (req, res) => {
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
