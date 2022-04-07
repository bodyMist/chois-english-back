const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const DB_URI = "mongodb://210.91.148.88:27017/chois-english";

const memberController = require("./routers/memberController");
const imageController = require("./routers/imageController");
const staticController = require("./routers/staticController");

const server = async () => {
  try {
    await mongoose
      .connect(DB_URI)
      .then(() => console.log("Successfully connected to mongodb"))
      .catch((e) => console.log(e));

    app.use("/static", express.static("static"));
    app.use(express.json());
    app.use(cors());

    app.use("/member", memberController);
    app.use("/image", imageController);
    app.use("/static", staticController);

    app.listen(port, () => {
      console.log("start server on port3000");
    });
  } catch (error) {
    console.log(error);
  }
};
server();
