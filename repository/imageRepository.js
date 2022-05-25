const { Image } = require("../models/image");
const { Member } = require("../models/member");

const fs = require("fs");
const request = require("request");

const success = true;
const failure = false;
const imageUrl = "http://210.91.148.88:3000/static/";

// 로컬 이미지 변환 요청
async function captionLocalImage(req, res) {
  try {
    console.log("\nLocal Image Caption Request");
    const image = req.files.file;
    console.log(image);

    // construct Caption

    // delete a temporarily saved image
    const caption = "sibal jonna himdleda";
    const blank = "sibal";

    console.log(success);
    return res.status(200).send({ result: success, caption, blank });
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

    if (image.caption === null) {
      // construct Caption
    }

    console.log(success);
    return res.status(200).send({ result: success, image });
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
      { $match: { caption: NOTFOUND } },
      { $sample: { size: 1 } },
    ]);
    console.log(...image);

    if (image.length === 0) {
      console.log("No Matched Image");
      return res.status(500).send({ error: "No Image", result: failure });
    }

    console.log(success);
    return res.status(200).send({ result: success, image: image[0] });
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
    const url = imageUrl + filename;

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

    const image = await Image.findById({ _id: imageId }).select("url -_id");

    if (!image) {
      console.log("No Image On DB");
      return res
        .status(500)
        .send({ message: "No Image On DB", result: failure });
    }

    const dir = image.url.replace(imageUrl, "static/");
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

    const imageIds = req.query.id;
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
      url: "http://210.91.148.88:8000/score/",
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
