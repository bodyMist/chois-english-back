const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3000;

require("dotenv").config();
const mongoose = require("mongoose");

const memberController = require("./routers/memberController");
const imageController = require("./routers/imageController");
const staticController = require("./routers/staticController");

const server = async () => {
  try {
    await mongoose
      .connect(process.env.DB_URI)
      .then(() => console.log("Successfully connected to mongodb"))
      .catch((e) => console.log(e));
    mongoose.set("debug", true);
    app.use("/static", express.static("static"));
    app.use(express.json());
    app.use(cors());
    app.use(fileUpload());

    app.use("/member", memberController);
    app.use("/image", imageController);
    app.use("/static", staticController);
    app.listen(port, () => {
      console.log("Start Server on port 3000");
    });
  } catch (error) {
    console.log(error);
  }
};
server();
