const { Router } = require("express");
const req = require("express/lib/request");
const { isValidObjectId } = require("mongoose");
const { Member } = require("../models/member");
const imageRouter = require("./imageController");
const memberRouter = Router();

const success = "success";
const failure = "failure";

// 회원가입 post
memberRouter.post("/join", async (req, res) => {
  try {
    console.log("\nMember Join Request");
    const member = new Member({ ...req.body });
    await member.save();

    console.log(success);
    return res.status(200).send({ member });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }
});

// 회원가입-계정 중복 확인
memberRouter.get("/checkAccount/:account", async (req, res) => {
  try {
    console.log("\nMember CheckAccount Request");
    const account = req.params.account;
    const member = await Member.findOne({ account });
    let resultMessage = "wait";

    if (member === null) {
      console.log("아이디 사용가능");
      resultMessage = success;
    } else {
      console.log("아이디 사용불가");
      resultMessage = failure; // 아이디 중복
    }
    return res.status(200).json({ message: resultMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 회원정보 조회
memberRouter.get("/mypage/:memberId", async (req, res) => {
  try {
    console.log("\nMember Mypage Request");
    const id = req.params.memberId;
    const member = await Member.findById(id);

    console.log(success);
    return res.status(200).send({ member });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 회원정보 수정-마이페이지 수정&비밀번호 수정 둘다 가능
memberRouter.put("/update/:memberId", async (req, res) => {
  try {
    console.log("\nMember Info Update Request");
    const id = req.params.memberId;
    await Member.updateOne({ _id: id }, { $set: { ...req.body } });

    console.log(success);
    return res.status(200).send({ success });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 회원탈퇴
memberRouter.delete("/delete", async (req, res) => {
  try {
    console.log("\nMember Delete Request");
    const { id } = req.query;
    await Member.deleteOne({ _id: id });
    console.log(success);
    return res.status(200).send({ success });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 로그인 & 로그아웃의 세션 관리는 이후 추가 예정
memberRouter.post("/login", async (req, res) => {
  try {
    console.log("\nMember Login Request");
    const member = { ...req.body };

    const result = await Member.findOne({
      account: member.account,
      password: member.password,
    });
    console.log({ result });

    if (result === null) {
      console.log("No Matching");
      return res.status(200).send({ message: "No Matching" });
    } else {
      console.log(success);
      return res.status(200).send({ success });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 아이디 찾기
memberRouter.get("/findAccount", async (req, res) => {
  try {
    console.log("\nMember Account Finder Request");
    const member = { ...req.query };
    const result = await Member.findOne({
      name: member.name,
      email: member.email,
    });
    console.log({ result });

    if (result === null) {
      console.log("No Matching");
      return res.status(200).send({ message: "No Matching" });
    } else {
      console.log(success);
      return res.status(200).send({ account: result.account });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 회원-이미지 저장 연동
imageRouter.post("/saveImage", async (req, res) => {
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

// 회원-이미지 삭제
imageRouter.delete("/deleteImage", async (req, res) => {
  try {
    console.log("/Image Delete Request");
    const { imageId } = req.query;
    await Image.deleteOne({ _id: imageId });
    console.log(success);
    return res.status(200).send({ result: success });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

imageRouter.get("/getMemberImages", async (req, res) => {});

module.exports = memberRouter;
