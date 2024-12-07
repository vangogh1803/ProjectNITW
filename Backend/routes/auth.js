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

