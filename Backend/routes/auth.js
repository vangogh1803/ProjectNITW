const express = require('express');
const passport = require('passport');
const router = express.Router();


// Redirect to Google for authentication
router.get('/google', passport.authenticate('google', { 
  scope: [ 'email','profile'] }));

// Callback after Google redirects back
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Successful authentication, redirect to the home page or a custom page
  res.redirect('http://localhost:3001/Events');  // Assuming the frontend is running on port 3000
});

module.exports = router;
