const Notes = require("../models/notes");

//create notes

exports.createNote = async (req, res) => {
  let product = new Notes(req.body);

  try {
    await product.save();

    res.json({
      title: product.title,
      content: product.content,
      id : product._id,
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

// update note - by id
