// for clustering modules
const os = require("os");
const uuid = require("uuid");
const cluster = require("cluster");
const instance_id = uuid.v4();
const workerCount = os.cpus().length / 2;

if (cluster.isMaster) {
  console.log(`Server ID: ${instance_id}`);
  console.log(`Number of workers to create: ${workerCount}`);

  // Message Listener
  const workerMsgListener = (msg) => {
    const worker_id = msg.worker_id;
    if (msg.cmd === "MASTER_ID") {
      cluster.workers[worker_id].send({
        cmd: "MASTER_ID",
        masterID: instance_id,
      });
    }
  };
  // Create Worker
  for (let i = 0; i < workerCount; i++) {
    const worker = cluster.fork();
    console.log(`Worker is created.[${i + 1} / ${workerCount}]`);
    worker.on("message", workerMsgListener);
  }

  cluster.on("online", (worker) => {
    console.log(` Worker id now online: ${worker.process.pid}`);
  });

  cluster.on("exit", (deadWorker) => {
    console.log(` Worker is dead: ${deadWorker.process.pid}`);
    const worker = cluster.fork();
    console.log(" New worker is created");
    worker.on("message", workerMsgListener);
  });
} else if (cluster.isWorker) {
  const express = require("express");
  const cors = require("cors");
  const fileUpload = require("express-fileupload");
  const app = express();
  const port = 3000;

  const mongoose = require("mongoose");
  const DB_URI = "mongodb://210.91.148.88:27017/chois-english";

  const memberController = require("./routers/memberController");
  const imageController = require("./routers/imageController");
  const staticController = require("./routers/staticController");

  const worker_id = cluster.worker.id;
  let master_id = "";

  //// Request master's id to master.
  process.send({ worker_id: worker_id, cmd: "MASTER_ID" });
  process.on("message", (msg) => {
    if (msg.cmd === "MASTER_ID") {
      masterId = msg.masterId;
    }
  });

  const server = async () => {
    try {
      await mongoose
        .connect(DB_URI)
        .then(() => console.log("Successfully connected to mongodb"))
        .catch((e) => console.log(e));

      app.use("/static", express.static("static"));
      app.use(express.json());
      app.use(cors());
      app.use(fileUpload());

      app.use("/member", memberController);
      app.use("/image", imageController);
      app.use("/static", staticController);
      console.log(`Get Request in Worker : ${worker_id}`);
      app.listen(port, () => {
        console.log(`Start Server on port 3000, Worker ID : ${worker_id}`);
      });
    } catch (error) {
      console.log(error);
    }
  };
  server();
}
