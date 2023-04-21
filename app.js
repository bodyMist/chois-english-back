const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const awsServerlessExpress = require("aws-serverless-express");

require("dotenv").config();
const mongoose = require("mongoose");

const memberController = require("./routers/memberController");
const imageController = require("./routers/imageController");
const staticController = require("./routers/staticController");

const app = express();
app.use("/static", express.static("static"));
app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.use("/member", memberController);
app.use("/image", imageController);
app.use("/static", staticController);

const server = awsServerlessExpress.createServer(app);

module.exports.index = (event, context) => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("Successfully connected to mongodb");
      awsServerlessExpress.proxy(server, event, context);
    })
    .catch((err) => {
      console.log("Falied to connect to mongodb : ", err);
      context.fail(err);
    });
};
