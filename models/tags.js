const { Schema, default: mongoose } = require("mongoose");

const tagSchema = new Schema(
  {
    tag: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);
