import express from 'express';
import passport from 'passport';

const router = express.Router();

// Redirect to Google for authentication
router.get('/google', passport.authenticate('google', { 
  scope: [ 'email','profile'] }));

// Callback after Google redirects back
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/Events' }), (req, res) => {
  console.log('Google login successful, redirecting to Events page...');

  // Successful authentication, redirect to the home page or a custom page
  res.redirect('http://localhost:3001/Events');  // Assuming the frontend is running on port 3000
});

export default router;