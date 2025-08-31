// config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/usersModel");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.googleClientID,
//       clientSecret: process.env.googleClientSecret,
//       callbackURL: process.env.gooleCallbackURL,
//       scope: ["profile", "email"],
//       passReqToCallback: true,
//     },
//     async function (request, accessToken, refreshToken, profile, callback) {
//       const existingUser = await User.findOne({
//         email: profile.emails[0].value,
//       });
//       if (existingUser) {
//         callback(null, existingUser);
//       } else {
//         const newUser = await User.create({
//           first_name: profile.name.givenName,
//           last_name: profile.name.familyName,
//           email: profile.emails[0].value,
//           googleId: profile.id,
//           username: profile.displayName,
//         });
//         // Save the user to the database
//         callback(null, newUser);
//       }
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
