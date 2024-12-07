import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5001/auth/google/callback",
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }

    // If the user doesn't exist, save them to the database
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName || 'No Name', // Fallback to 'No Name' if displayName is missing
      email: profile.emails?.[0]?.value || 'No Email', // Handle missing email
      profilePicture: profile.photos?.[0]?.value || '', // Handle missing profile picture
    });

    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import User from '../models/User.js';
// import dotenv from 'dotenv';
// dotenv.config({ path: '../.env' });

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:5001/auth/google/callback",
// },
// async (accessToken, refreshToken, profile, done) => {
//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ googleId: profile.id });
//     if (existingUser) {
//       return done(null, existingUser);
//     }

//     // // If the user doesn't exist, save them to the database
//     // const newUser = new User({
//     //   googleId: profile.id,
//     //   name: profile.displayName,
//     //   email: profile.emails[0].value,
//     //   profilePicture: profile.photos[0].value
//     // });
//     const newUser = new User({
//       googleId: profile.id,
//       name: profile.displayName || 'No Name', // Fallback to 'No Name' if displayName is missing
//       email: profile.emails?.[0]?.value || 'No Email', // Handle missing email
//       profilePicture: profile.photos?.[0]?.value || '', // Handle missing profile picture
//     });
    
    
//     await newUser.save();
//     return done(null, newUser);
//   } catch (err) {
//     done(err, null);
//   }
// }));

// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });
