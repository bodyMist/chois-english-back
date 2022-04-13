const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const ImageSchema = new mongoose.Schema({
  imageName: { type: String, required: true },
  url: String,
  caption: String,
  public: Number,
});
const Image = mongoose.model("Image", ImageSchema);
module.exports = { Image };
