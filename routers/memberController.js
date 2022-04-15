const { Router } = require("express");
const memberRouter = Router();
const repository = require("../repository/memberRepository");

// 회원가입 post
memberRouter.post("/join", repository.signUp);

// 회원가입-계정 중복 확인
memberRouter.get("/checkAccount/:account", repository.checkDuplicateAccount);

// 회원정보 조회
memberRouter.get("/mypage/:memberId", repository.getMemberInfo);

// 회원정보 수정-마이페이지 수정&비밀번호 수정 둘다 가능
memberRouter.put("/update/:memberId", repository.updateMemberInfo);

// 회원탈퇴
memberRouter.delete("/delete", repository.deleteMember);

// 로그인 & 로그아웃의 세션 관리는 이후 추가 예정
memberRouter.post("/login", repository.login);

// 아이디 찾기
memberRouter.get("/checkMember", repository.findAccount);

// 비밀번호 찾기
memberRouter.get("/checkAccount", repository.findPassword);

module.exports = memberRouter;
