const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    account: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  },
  { timestamps: true }
);
const Member = mongoose.model("Member", MemberSchema);
module.exports = { Member };
