import express from 'express';
import passport from 'passport';
import User from '../models/User.js'; // Import your User model

const router = express.Router();

/**
 * Route: Redirect to Google for authentication
 */
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'], // Request email and profile scopes
  })
);

/**
 * Route: Google OAuth callback
 * After Google redirects back, this handles user creation/updating
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }), // Redirect to login page on failure
  async (req, res) => {
    console.log('Google login successful:', req.user);

    try {
      const { id, displayName, emails, photos } = req.user;

      // Check if the user exists in the database
      let user = await User.findOne({ googleId: id });
      if (!user) {
        // If the user doesn't exist, create a new user
        user = new User({
          googleId: id,
          name: displayName,
          email: emails[0]?.value, // Ensure email exists
          profilePicture: photos[0]?.value, // Ensure photo exists
        });

        await user.save();
        console.log('New user created:', user);
      } else {
        console.log('User already exists:', user);
      }

      // Redirect to frontend events page after successful login
      res.redirect('http://localhost:3001/events'); // Update with your frontend's URL
    } catch (error) {
      console.error('Error processing user data:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

/**
 * Route: Login using Google ID (for token-based frontend authentication)
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('google', { session: true }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed' });
      }
      return res.status(200).json(user); // Send back the authenticated user
    });
  })(req, res, next);
});

router.post('/google', async (req, res) => {
  const { googleId, email, name, profilePicture } = req.body;

  try {
    // Check if the user exists in the database
    let user = await User.findOne({ googleId });
    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User({
        googleId,
        email,
        name,
        profilePicture,
      });

      await user.save();
    }

    console.log('User authenticated:', user);
    res.status(200).json({ message: 'User authenticated successfully', user });
  } catch (error) {
    console.error('Error during user authentication:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;

// import express from 'express';
// import passport from 'passport';
// import User from '../models/User.js'; // Import your User model

// const router = express.Router();

// // Redirect to Google for authentication
// router.get(
//   '/google',
//   passport.authenticate('google', { 
//     scope: ['email', 'profile'] // Request email and profile scopes
//   })
// );
// router.post('/google', async (req, res) => {
//   const { googleId, email, name, profilePicture } = req.body;

//   try {
//     // Check if user exists
//     let user = await User.findOne({ googleId });
//     if (!user) {
//       // Create a new user if not found
//       user = new User({
//         googleId,
//         email,
//         name,
//         profilePicture,
//       });

//       await user.save();
//     }
//     console.log('User successfully authenticated:', user);

//     res.status(200).json({ message: 'User authenticated successfully', user });
//   } catch (error) {
//     console.error('Error during user authentication:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Callback after Google redirects back
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/Events' }), 
//   async (req, res) => {
//     console.log('Google login successful.');

//     try {
//       // Save or update user in the database
//       const { id, displayName, emails, photos } = req.user;

//       let user = await User.findOne({ googleId: id });
//       if (!user) {
//         // Create a new user if not found
//         user = new User({

//           name: displayName,
//           email: emails[0].value, // Assuming the email exists
//           profilePicture: photos[0].value, // Assuming the profile picture exists
//         });

//         await user.save();
//         console.log('New user saved:', user);
//       } else {
//         console.log('User already exists:', user);
//       }

//       // Redirect to the Events page after successful login
//       res.redirect('http://localhost:3001/Events'); // Update to your frontend URL
//     } catch (error) {
//       console.error('Error processing user data:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   }
// );

// export default router;
// import express from 'express';
// import passport from 'passport';
// import User from '../models/User.js';  // Import your User model

// const router = express.Router();

// // Redirect to Google for authentication
// router.get('/google', passport.authenticate('google', { 
//   scope: ['email', 'profile'] // Request email and profile scopes
// }));

// // Callback after Google redirects back
// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/Events' }), async (req, res) => {
//   console.log('Google login successful.');

//   try {
//     const { id, displayName, emails, photos } = req.user;  // Google user info

//     let user = await User.findOne({ googleId: id });
//     if (!user) {
//     user = new User({
//       googleId: id,
//       name: displayName,
//       email: emails && emails[0] ? emails[0].value : 'No email provided', // Fallback if email is missing
//       profilePicture: photos && photos[0] ? photos[0].value : 'https://example.com/default-profile-pic.jpg', // Fallback if no profile picture
//     });

//       await user.save();
//       console.log('New user saved:', user);
//     } else {
//       console.log('User already exists:', user);
//     }

//     // Redirect to the frontend Events page after successful login
//     res.redirect('http://localhost:3001/Events');
//   } catch (error) {
//     console.error('Error processing user data:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// export default router;





// import express from 'express';
// import passport from 'passport';
// import User from '../models/User.js'; // Import your User model

// const router = express.Router();

// /**
//  * Route: Redirect to Google for authentication
//  */
// router.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['email', 'profile'], // Request email and profile scopes
//   })
// );

// /**
//  * Route: Google OAuth callback
//  * After Google redirects back, this handles user creation/updating
//  */
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }), // Redirect to login page on failure
//   async (req, res) => {
//     console.log('Google login successful:', req.user);

//     try {
//       // Destructure the user data from the passport authentication
//       const { id, displayName, emails, photos } = req.user;

//       // Check if the user exists in the database
//       let user = await User.findOne({ googleId: id });
//       if (!user) {
//         // If the user doesn't exist, create a new user
//         user = new User({
//           googleId: id,
//           name: displayName,
//           email: emails[0]?.value, // Ensure email exists
//           profilePicture: photos[0]?.value, // Ensure photo exists
//         });

//         await user.save();
//         console.log('New user created:', user);
//       } else {
//         console.log('User already exists:', user);
//       }

//       // Successful login, redirect to frontend (change this as needed)
//       res.redirect('http://localhost:3001/events'); // Update with your frontend's URL
//     } catch (error) {
//       console.error('Error processing user data:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   }
// );

// /**
//  * Route: Login using Google ID (for token-based frontend authentication)
//  **/
// router.post('/google', async (req, res) => {
//   const { googleId, email, name, profilePicture, accessToken, refreshToken } = req.body;

//   try {
//     // Check if the user exists in the database
//     let user = await User.findOne({ googleId });
//     if (!user) {
//       // If the user doesn't exist, create a new user
//       user = new User({
//         googleId,
//         email,
//         name,
//         profilePicture,
//       });

//       await user.save();
//       console.log('New user created:', user);
//     } else {
//       console.log('User already exists:', user);
//     }

//     // Optionally, store access and refresh tokens for future use (e.g., for Google API calls)
//     // You may want to store them in your User model if needed, or use them in a session/cookie.
//     user.accessToken = accessToken;
//     user.refreshToken = refreshToken;
//     await user.save();

//     // Return user info along with status
//     res.status(200).json({ message: 'User authenticated successfully', user });
//   } catch (error) {
//     console.error('Error during user authentication:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// export default router;
// import express from 'express';
// import passport from 'passport';
// import User from '../models/User.js'; // Import your User model

// const router = express.Router();

// /**
//  * Route: Redirect to Google for authentication
//  */
// router.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['email', 'profile'], // Request email and profile scopes
//   })
// );

// /**
//  * Route: Google OAuth callback
//  * After Google redirects back, this handles user creation/updating
//  */
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }), // Redirect to login page on failure
//   async (req, res) => {
//     console.log('Google login successful:', req.user);

//     try {
//       // Destructure the user data from the passport authentication
//       const { id, displayName, emails, photos } = req.user;

//       // Check if the user exists in the database
//       let user = await User.findOne({ googleId: id });
//       if (!user) {
//         // If the user doesn't exist, create a new user
//         user = new User({
//           googleId: id,
//           name: displayName,
//           email: emails[0]?.value || 'No Email', // Ensure email exists
//           profilePicture: photos[0]?.value || '', // Ensure photo exists
//         });

//         await user.save();
//         console.log('New user created:', user);
//       } else {
//         console.log('User already exists:', user);
//       }

//       // Successful login, redirect to frontend (use a dynamic URL for production)
//       res.redirect(process.env.FRONTEND_URL || 'http://localhost:3001/events'); // Ensure this is dynamic
//     } catch (error) {
//       console.error('Error processing user data:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   }
// );

// export default router;
