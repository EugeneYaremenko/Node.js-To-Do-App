const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRouter = require("./routes/authRouter");
const notesRouter = require("./routes/notesRouter");

require("dotenv").config();

class Server {
  constructor() {
    this.server = null;
  }

  start() {
    this.server = express();
    this.initMiddlewares();
    this.initRoutes();
    this.initDatabase();
    this.listen();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  initRoutes() {
    this.server.use("/auth", authRouter);
    this.server.use("/notes", notesRouter);
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

      console.log("Database connection successful");
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  listen() {
    this.server.listen(process.env.PORT || 3001, () => {
      console.log(`Server listening at ${process.env.PORT}`);
    });
  }
}

module.exports = Server;
