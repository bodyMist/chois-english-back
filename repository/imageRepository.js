const { Image } = require("../models/image");
const { Member } = require("../models/member");
const fs = require("fs");
const path = require("path");
const request = require("request");
const FormData = require("form-data");
const axios = require("axios");

const success = true;
const failure = false;
const basicUrl = process.env.BASIC_URL;
const imageUrl = process.env.IMAGE_URL;
const captionUrl = process.env.CAPTION_URL;

// 로컬 이미지 변환 요청
async function captionLocalImage(req, res) {
  try {
    // 받은 이미지 저장
    console.log("\nLocal Image Caption Request");
    const imageFile = req.files.file;
    const uploadPath = path.join(`./static/${imageFile.name}`);
    await imageFile.mv(uploadPath);
    const form = new FormData();

    form.append("file", fs.createReadStream(`static/${imageFile.name}`));

    await axios
      .post(captionUrl, form, {
        Headers: {
          "Accept-Encoding": "gzip, deflate, br",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        fs.unlink(uploadPath, (err) => {
          console.log(err);
        });
        console.log(success);
        return res.status(200).send({ result: success, ...response.data });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 서버 연동 이미지 변환 요청
async function captionServerImage(req, res) {
  try {
    console.log("\nServer Image Caption Request");

    const image = await Image.findById(req.body.id);
    if (!image) {
      return res.status(500).send({ result: failure, message: "No Image" });
    }
    const imagePath = image.url.replace(basicUrl, "./");

    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));

    await axios
      .post(captionUrl, form, {
        Headers: {
          "Accept-Encoding": "gzip, deflate, br",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(success);
        return res.status(200).send({ result: success, ...response.data });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 랜덤 문제 요청
async function getRandomCaption(req, res) {
  try {
    console.log("\nRandom Question Request");
    const image = await Image.aggregate([
      // { $match: { caption: NOTFOUND } },
      { $sample: { size: 1 } },
    ]);

    if (image.length === 0) {
      console.log("No Image");
      return res.status(500).send({ error: "No Image", result: failure });
    }
    const imagePath = image[0].url.replace(basicUrl, "./");

    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));

    await axios
      .post(captionUrl, form, {
        Headers: {
          "Accept-Encoding": "gzip, deflate, br",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(success);
        return res
          .status(200)
          .send({ result: success, image: image[0], ...response.data });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 이미지 저장
async function saveImage(req, res) {
  try {
    console.log("\nSave Image Request");

    const imageFile = req.files.file;
    const filename = req.files.file.name;
    let member = await Member.findById(req.body.memberId);

    if (!member) {
      return res.status(200).send({ result: failure, message: "No Member" });
    }

    const memberDir = "./static/" + member._id + "/";
    if (!fs.existsSync(memberDir)) {
      console.log("Create Member Directory\n");
      fs.mkdirSync(memberDir);
    }

    imageFile.mv(memberDir + `${filename}`);
    const url = basicUrl + memberDir.substring(2) + filename;

    const image = await Image.create({
      imageName: imageFile.name,
      url: url,
    });
    member.images.push(image);
    member.save();

    console.log(success);
    return res
      .status(200)
      .send({ result: success, imageId: image.id, url: url, member: member });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 회원 이미지 삭제
async function deleteImage(req, res) {
  try {
    console.log("\nDelete Server Image Request");
    const imageId = req.query.imageId;
    const memberId = req.query.memberId;

    const image = await Image.findById({ _id: imageId }).select(
      "url imageName -_id"
    );
    if (!image) {
      console.log("No Image On DB");
      return res
        .status(500)
        .send({ message: "No Image On DB", result: failure });
    }

    const dir = "./static/" + memberId + "/" + image.imageName;
    fs.unlinkSync(dir);

    await Member.updateOne(
      { _id: memberId },
      {
        $pull: { images: imageId },
      }
    );
    await Image.deleteOne({ _id: imageId });

    console.log(success);
    return res.status(200).send({ result: success });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 회원 이미지 조회
async function getMemberImages(req, res) {
  try {
    console.log("\nGet Member's Image Request");
    console.log(req.query.id);
    const imageIds = [];
    req.query.id instanceof Array
      ? imageIds.push(...req.query.id)
      : imageIds.push(req.query.id);
    console.log(imageIds);
    const images = await Image.find({ _id: { $in: [...imageIds] } });

    console.log(success);
    return res.status(200).send({ result: success, images: images });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 정답 제출 및 채점
async function gradeAnswer(req, res) {
  try {
    console.log("\nMark an Answer Request");
    const scoringAPI = {
      url: process.env.ANSWER_URL,
      method: "POST",
      body: {
        user_input: "",
        answer: "",
        blank: "",
      },
      json: true,
    };
    const method = req.params;
    const user_input = req.body.user_input;
    const blank = req.body.blank;
    const answer = req.body.answer;

    scoringAPI.url += method.type;
    scoringAPI.body = { user_input, blank, answer };
    console.log(scoringAPI);

    // post answer to SBert model on Flask Server
    request.post(scoringAPI, (error, response, body) => {
      res.json(body);
    });
    console.log(success);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

module.exports = {
  captionLocalImage,
  captionServerImage,
  getRandomCaption,
  saveImage,
  deleteImage,
  getMemberImages,
  gradeAnswer,
};
