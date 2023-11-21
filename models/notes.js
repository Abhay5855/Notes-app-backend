const moongoose = require("mongoose");

const { Schema } = moongoose;

const { ObjectId } = moongoose.Schema;


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
    tag: {
      type: ObjectId,
      ref: "Tag",
    },
  },
  { timestamps: true }
);

module.exports = moongoose.model("Notes", notesSchema);
