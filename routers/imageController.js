const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Image } = require("../models/image");
const imageRouter = Router();

const success = "success";
const failure = "failure";

// 로컬 이미지 변환 요청
imageRouter.post("/localCaption", async (req, res) => {
  try {
    console.log("\nLocal Image Caption Request");
    const imageBase64 = req.imageData;

    // construct Caption

    const caption = "sibal jonna himdleda";

    console.log(success);
    return res.status(200).send({ result: success, caption });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message, result: failure });
  }
});

module.exports = imageRouter;
