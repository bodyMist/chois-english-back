const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const imageRouter = Router();

const success = "success";
const failure = "failure";

module.exports = imageRouter;
