const mongoose = require("mongoose");
const { Schema } = Schema;

const ImageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  caption: { type: String, required: true },
});
const Image = mongoose.model("Image", ImageSchema);
module.exports = { Image };
