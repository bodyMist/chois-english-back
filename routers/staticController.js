const { Router } = require("express");
const fs = require("fs");
const staticRouter = Router();

const success = true;
const failure = false;

const imgUrl = "http://210.91.148.88:3000/static/";

// 서버 이미지 접근하기
staticRouter.get("/:imageName", async (req, res) => {
  try {
    console.log("\nServer Image Access");
    result = imgUrl + req.params;
    console.log(result);

    return res.status(200).send(fs.readFileSync(result));
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message, result: failure });
  }
});

module.exports = staticRouter;
