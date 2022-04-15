const { Router } = require("express");
const imageRouter = Router();

const imageRepository = require("../repository/imageRepository");

// 로컬 이미지 변환 요청
imageRouter.post("/localCaption", imageRepository.captionLocalImage);

// 서버 연동 이미지 변환 요청
imageRouter.post("/serverCaption", imageRepository.captionServerImage);

// 랜덤 문제 요청
imageRouter.get("/random", imageRepository.getRandomCaption);

// 이미지 저장(연동)
imageRouter.post("/saveImage", imageRepository.saveImage);

// 회원 이미지 삭제
imageRouter.delete("/deleteImage", imageRepository.deleteImage);

// 회원 이미지 조회
imageRouter.get("/getMemberImages", imageRepository.getMemberImages);

// 정답 제출 및 채점
imageRouter.post("/answer", imageRepository.gradeAnswer);

module.exports = imageRouter;
