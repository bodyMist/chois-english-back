const { Member } = require("../models/member");

const success = true;
const failure = false;

// 회원가입 post
async function signUp(req, res) {
  try {
    console.log("\nMember Join Request");
    const member = new Member({ ...req.body });
    await member.save();

    console.log(success);
    return res.status(200).send({ result: success, member });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message, result: failure });
  }
}

// 회원가입 - 계정 중복 확인
async function checkDuplicateAccount(req, res) {
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
    return res.status(200).json({ result: resultMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 회원정보 조회
async function getMemberInfo(req, res) {
  try {
    console.log("\nMember Mypage Request");
    const id = req.params.memberId;
    const member = await Member.findById(id);

    console.log(success);
    return res.status(200).send({ result: success, member });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 회원정보 수정 - 마이페이지 & 비밀번호 수정
async function updateMemberInfo(req, res) {
  try {
    console.log("\nMember Info Update Request");
    const id = req.params.memberId;
    await Member.updateOne({ _id: id }, { $set: { ...req.body } });
    console.log(success);
    return res.status(200).send({ result: success });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 회원탈퇴
async function deleteMember(req, res) {
  try {
    console.log("\nMember Delete Request");
    const { id } = req.query;
    await Member.deleteOne({ _id: id });
    console.log(success);
    return res.status(200).send({ result: success });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 로그인 & 로그아웃의 세션 관리는 이후 추가 예정
async function login(req, res) {
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
      return res.status(200).send({ result: failure });
    } else {
      console.log(success);
      return res.status(200).send({ result: success, member: { result } });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 아이디 찾기
async function findAccount(req, res) {
  try {
    console.log("\nCheck Member Existence Request");
    const member = { ...req.query };
    console.log(member);
    const result = await Member.find({
      ...member,
    }).select("account -_id");

    if (result === null) {
      console.log("No Matching");
      return res.status(200).send({ result: failure });
    }

    console.log(success);
    console.log(result);
    return res.status(200).send({ result: success, member: result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

// 비밀번호 찾기
async function findPassword(req, res) {
  try {
    console.log("\nCheck Member Account Request");
    const member = { ...req.query };
    console.log(member);
    const result = await Member.findOne({
      ...member,
    }).select("_id");

    if (result === null) {
      console.log("No Matching");
      return res.status(200).send({ result: failure });
    }

    console.log(success);
    console.log(result);
    return res.status(200).send({ result: success });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, result: failure });
  }
}

module.exports = {
  signUp,
  checkDuplicateAccount,
  getMemberInfo,
  updateMemberInfo,
  deleteMember,
  login,
  findAccount,
  findPassword,
};
