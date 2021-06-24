const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const authRouter = require('./routes/authRouter');
const notesRouter = require('./routes/notesRouter');

require('dotenv').config();

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
    this.server.use(
      session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
      })
    );
    this.server.use(express.json());
    this.server.use(cors());

    this.server.use(passport.initialize());
    this.server.use(passport.session());
  }

  initRoutes() {
    this.server.use('/auth', authRouter);
    this.server.use('/notes', notesRouter);
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

      console.log('Database connection successful');
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
