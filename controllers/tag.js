// // controllers/tagController.js

// const Notes = require("../models/notes");
// const Tag = require("../models/tags");

// exports.createTag = async (req, res) => {
//   const { noteId } = req.params;

//   try {
//     // Check if the note exists
//     const note = await Notes.findById(noteId).exec();
//     if (!note) {
//       return res.status(404).json({
//         error: "Note not found",
//       });
//     }

//     // Create a new tag associated with the note
//     const tag = new Tag({
//       label: req.body.label, // Customize the label as needed
//       note: note._id, // Reference to the note
//     });

//     // Save the tag
//     await tag.save();

//     // Update the note with the tag reference
//     note.tag = tag.label;
//     note.title = note.title;
//     note.content = note.content;
//     note.id = note._id;
//     // Change this to label
//     await note.save();

//     res.json({
//       note: {
//         title: note.title,
//         content: note.content,
//         id: note._id,
//         isPinned: note.isPinned,
//         tag: note.tag, // Include the tag in the response
//       },
//       tag: {
//         label: tag.label,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       error: "Internal server error",
//     });
//   }
// };

const Notes = require("../models/notes");
const Tag = require("../models/tags");

exports.createTag = async (req, res) => {
  const { noteId } = req.params;
  console.log(noteId, "noteId");
  const tag = new Tag(req.body);

  console.log(tag, "tag");

  try {
    await tag.save();

    const note = await Notes.findById(noteId).exec();

    note.tag = tag.tag;

    await note.save();

    res.json(tag);

    console.log(note, "this is note");
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
