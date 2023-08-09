const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const mainConfig = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());
  app.use(
    session({
      secret: "@/key$2/",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = mainConfig;
