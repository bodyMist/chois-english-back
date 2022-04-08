const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Image } = require("../models/image");
const { Member } = require("../models/member");

const imageRouter = Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, "static/");
    },
    // convert a file name
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});
const success = "success";
const failure = "failure";
const imageUrl = "http://210.91.148.88:3000/static/";

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

// 이미지 저장(연동)
imageRouter.post("/saveImage", upload.single("file"), async (req, res) => {
  try {
    console.log("\nSave Image Request");

    const image = await Image.create({
      imageName: req.file.filename,
      url: imageUrl + req.file.filename,
    });

    await Member.updateOne(
      { _id: req.body.memberId },
      {
        $push: { images: image },
      }
    );

    console.log(success);
    return res
      .status(200)
      .send({ result: success, imageId: image.id, url: image.url });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message, result: failure });
  }
});

// 회원 이미지 삭제
imageRouter.delete("/deleteImage", async (req, res) => {
  try {
    console.log("\nDelete Server Image Request");
    const imageId = req.query.imageId;
    const memberId = req.query.memberId;

    const image = await Image.findById({ _id: imageId }).select("url -_id");

    await Member.updateOne(
      { _id: memberId },
      {
        $pull: { images: imageId },
      }
    );
    await Image.deleteOne({ _id: imageId });

    const dir = image.url.replace(imageUrl, "static/");
    fs.unlinkSync(dir);
    console.log(success);
    return res.status(200).send({ result: success });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message, result: failure });
  }
});

module.exports = imageRouter;
