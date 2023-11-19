const { Schema, default: mongoose } = require("mongoose");

const tagSchema = new Schema(
  {
    label: {
      type: String,
      unique: true,
      trim: true,
      maxLength: 20,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);
