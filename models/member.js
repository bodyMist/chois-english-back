const mongoose = require("mongoose");
const { Schema, Types } = mongoose.Schema;

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    account: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    images: [{ type: Types.ObjectId, ref: "Image" }],
  }
  //{ timestamps: true } createdAtê³¼ updatedAt
);
const Member = mongoose.model("Member", MemberSchema);
module.exports = { Member };
