const moongoose = require("mongoose");

const { Schema } = moongoose;


const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#fff",
    },
  },
  { timestamps: true }
);

module.exports = moongoose.model("Notes", notesSchema);
