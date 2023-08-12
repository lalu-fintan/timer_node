const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
const Google = require("../models/googleModel");
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
      scope: ["https://www.googleapis.com/auth/userinfo.profile", "email"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await Google.findOne({ googleId: profile.id });
        console.log({ user }, "user");

        if (!user) {
          user = await Google.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            role: profile.role,
          });
        }

        return done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback/",

  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const payload = {
      id: req.user._id,
      displayName: req.user.displayName,
      email: req.user.email,
      role: req.user.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // res.redirect(`/dashboard?token=${token}`);
    res.send(`welcome ${req.user.displayName}`);
  }
);

const authLogout = (req, res) => {
  req.session.destroy;
  res.send("logout successfull");
};

router.get("/auth/google/logout", authLogout);

module.exports = router;
