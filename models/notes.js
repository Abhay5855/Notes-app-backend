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
    color: {
      type: String,
      default: "#202124",
    },

    liked: {
      type: Boolean,
      default: false,
    },

    user: {
      type: ObjectId,
      ref: "User",
    },

    imageData: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = moongoose.model("Notes", notesSchema);
