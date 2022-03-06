const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: Number,
    address: {
      city: String,
      street: String,
      zipCode: String,
    },
  },
  { timestamps: true }
);
const Member = mongoose.model("Member", MemberSchema);
module.exports = { Member };
