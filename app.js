const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const DB_URI = "mongodb://127.0.0.1:27017/chois-english";

const server = async () => {
  try {
    await mongoose
      .connect(DB_URI)
      .then(() => console.log("Successfully connected to mongodb"))
      .catch((e) => console.log(e));

    app.use(express.json());

    app.listen(port, () => {
      console.log("start server on port3000");
    });
  } catch (error) {
    console.log(error);
  }
};
server();
