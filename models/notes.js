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

  },
  { timestamps: true }
);

module.exports = moongoose.model("Notes", notesSchema);
