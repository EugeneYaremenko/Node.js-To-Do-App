const path = require('path');
require('dotenv').config({ path: path.join('.env') });
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const userModel = require('../../models/userModel');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userModel.findOne({ email: profile.email });

        if (user) {
          return done(null, user);
        }

        const newUser = await userModel.create({
          status: 'Verified',
          username: profile.given_name,
          email: profile.email,
          provider: profile.provider,
        });

        return done(null, newUser);
      } catch (err) {
        console.log(err);
        return done(null, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  userModel.findById(id, function (err, user) {
    done(err, user);
  });
});




