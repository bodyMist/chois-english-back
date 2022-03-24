const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Member } = require("../models/member");
const memberRouter = Router();

// 회원가입 post
memberRouter.post("/join", async (req, res) => {
  try {
    const member = new Member({ ...req.body });
    await member.save();
    return res.send({ member });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});

// 회원가입-계정 중복 확인
memberRouter.get("/checkAccount", async (req, res) => {
  const success = "success";
  const failure = "failure";
  try {
    const { account } = req.query;
    const member = await Member.findOne({ account });

    if (member === null) {
      console.log("아이디 사용가능");
      res.status(200).json({ message: success });
    } else {
      res.status(200).json({ message: failure }); // 아이디 중복
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = memberRouter;
