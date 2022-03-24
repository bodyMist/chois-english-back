const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Member } = require("../models/member");
const memberRouter = Router();

// 회원가입 post
memberRouter.post("/join", async (req, res) => {
  try {
    const member = new Member({ ...req.body });
    console.log(member);
    await member.save();
    return res.send({ member });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});

module.exports = memberRouter;
