const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const DB_URI = "mongodb://210.91.148.88:27017/chois-english";

const memberController = require("./routers/memberController");
const imageController = require("./routers/imageController");

const server = async () => {
  try {
    await mongoose
      .connect(DB_URI)
      .then(() => console.log("Successfully connected to mongodb"))
      .catch((e) => console.log(e));

    app.use(express.json());
    app.use(
      fileUpload({
        createParentPath: true,
      })
    );
    app.use(cors());
    app.use("/member", memberController);
    app.use("/image", imageController);

    app.listen(port, () => {
      console.log("start server on port3000");
    });
  } catch (error) {
    console.log(error);
  }
};
server();
