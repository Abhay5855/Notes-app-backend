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

// delete notes - all

//get note by - id
exports.getNoteById = (req, res, next, id) => {
  Notes.findById(id)
    .exec()
    .then((notes) => {
      if (!notes) {
        return err.status(400).json({
          error: "note does not exist",
        });
      }

      req.profile = notes;
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
     
    return res.json(req.profile);
     
}

// update note - by id
