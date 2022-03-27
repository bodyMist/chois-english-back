const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Image } = require("../models/image");
const imageRouter = Router();

const success = "success";
const failure = "failure";

// 회원-이미지 저장 연동
imageRouter.post("/imageupload", async (req, res) => {
  try {
    console.log("\nImage Linked Store Request");
    const image = new Image({ ...req.body });
    await image.save();

    console.log(success);
    return res.status(200).send({ message: success });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});

module.exports = imageRouter;
