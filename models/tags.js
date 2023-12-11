const { Schema } = moongoose;

const TagSchema = new Schema({
  tag: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("Tag", TagSchema);
