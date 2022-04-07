const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const ImageSchema = new mongoose.Schema({
  imageName: { type: String, required: true },
  url: { type: String },
  caption: { type: String },
});
const Image = mongoose.model("Image", ImageSchema);
module.exports = { Image };
