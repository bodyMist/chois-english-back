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

// 서버 연동 이미지 변환 요청
imageRouter.post("/serverCaption", async (req, res) => {
  try {
    console.log("\nServer Image Caption Request");

    const image = await Image.findById(req.body.id);

    if (image.caption === null) {
      // construct Caption
    }

    console.log(success);
    return res.status(200).send({ result: success, image });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message, result: failure });
  }
});

// 랜덤 문제 요청
imageRouter.get("/random", async (req, res) => {
  try {
    console.log("\nRandom Question Request");
    const image = await Image.aggregate([{ $sample: { size: 1 } }]);
    console.log({ ...image });

    console.log(success);
    return res.status(200).send({ result: success, image });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message, result: failure });
  }
});

module.exports = imageRouter;
