const Notes = require("../models/notes");
const User = require("../models/user");
const { notesValidator } = require("../validations/notes");

//create notes
exports.createNote = async (req, res) => {
  let note = new Notes(req.body);

  const { error } = notesValidator.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  try {
    const user = await User.findById(req.params.userId);

    note.user = user._id;
    // Push the ObjectId of the created note to the user's notes array
    user.notes.push(note._id);

    await user.save();
    await note.save();

    res.json({
      title: note.title,
      content: note.content,
      id: note._id,
      isPinned: note.isPinned,
      color: note.color,
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
exports.getNote = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("notes");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const notes = user.notes;

    return res.json(notes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
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

exports.addToLikedNotes = async (req, res) => {
  const { noteId } = req.params;

  try {
    // Find the current note
    const note = await Notes.findById(noteId);

    if (!note) {
      return res.status(400).json({
        error: "Note not found",
      });
    }

    // Toggle the liked status
    note.liked = !note.liked;

    // Save the updated note
    const updatedNote = await Notes.findOneAndUpdate(
      { _id: noteId },
      { liked: note.liked },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(400).json({
        error: "Failed to toggle liked status",
      });
    }

    res.json({
      liked: updatedNote.liked,
    });
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
        error: "Failed to unpin the note",
      });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update the color
exports.changeColor = async (req, res) => {
  const { noteId } = req.params;
  const { color } = req.body;
  try {
    const updatedNote = await Notes.findByIdAndUpdate(
      noteId,
      { color },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(400).json({
        error: "Unable to change the color",
      });
    }

    res.json({ color: updatedNote.color });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

///get all notes
exports.getAllNotes = async (req, res) => {
  const { id } = req.params;
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    const notes = await Notes.findById({ id })
      .sort([[sortBy, "asc"]])
      .exec();

    res.json(notes);
  } catch (err) {
    res.status(500).json({
      error: "Failed to get the Products",
    });
  }
};

//Upload the notes

exports.uploadNote = async (req, res) => {
  const { noteId } = req.params;
  const { base64Image } = req.body;

  try {
    const dataUri = base64Image.split(";base64,");
    const contentType = dataUri[0].replace("data:", "");

    const buffer = Buffer.from(dataUri[1], "base64");
    
    const note = await Notes.findById(noteId);
    note.imageData = {
      data: buffer,
      contentType: contentType,
    };
    await note.save();

    res.status(200).json({ message: "Image saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to upload the note",
    });
  }
};

exports.getImage = async (req, res) => {
  const { noteId } = req.params;
  try {
    const note = await Notes.findById(noteId);

    if (!note || !note.imageData) {
      return res.status(404).json({ error: "Image not found" });
    }

    const { data, contentType } = note.imageData;
    const base64Image = `data:${contentType};base64,${data.toString("base64")}`;

    res.json({ base64Image, noteId });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch the note",
    });
  }
};
