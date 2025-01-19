import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
import './config/passport.js'; // Passport configuration
import session from 'express-session';
import authRoute from './routes/auth.js';
import { google } from 'googleapis';
import fs from 'fs';

// Initialize the app
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3001', // Frontend URL
  credentials: true, // Allow credentials (cookies/sessions)
  methods: ['GET', 'POST'], // Allowed HTTP methods
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Configure session before passport
app.use(
  session({
    secret: process.env.SECRET_KEY || 'default_secret', // Fallback for SECRET_KEY
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Secure cookie in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // SameSite setting for cross-origin
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Load service account for Google Calendar API
const serviceAccount = JSON.parse(
  fs.readFileSync('./durable-surfer-443516-m1-4b25351d96e9.json', 'utf8')
);

// Google Calendar setup
const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key.replace(/\\n/g, '\n'), // Handle escaped newlines
    ['https://www.googleapis.com/auth/calendar']
  ),
});

// Fetch events
app.get('/', async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID, // Ensure calendar ID is set in `.env`
      timeMin: new Date().toISOString(), // Fetch events from now
      maxResults: 100, // Limit results to 100
      singleEvents: true,
      orderBy: 'startTime',
    });
    res.json(response.data.items); // Return events as JSON
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// Add event
app.post('/api/events/', async (req, res) => {
  const { summary, start, end } = req.body;

  // Validate input
  if (!summary || !start?.dateTime || !end?.dateTime) {
    return res.status(400).json({ message: 'Missing required fields: summary, start, or end' });
  }

  const event = {
    summary,
    start: {
      dateTime: start.dateTime,
      timeZone: start.timeZone || 'UTC', // Default to UTC if no time zone is provided
    },
    end: {
      dateTime: end.dateTime,
      timeZone: end.timeZone || 'UTC', // Default to UTC if no time zone is provided
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: process.env.CALENDAR_ID,
      resource: event,
    });
    res.status(201).json(response.data); // Return the created event
  } catch (error) {
    console.error('Error adding event:', error.message);
    res.status(500).json({ message: 'Error adding event', error: error.message });
  }
});
// Authenticated user endpoint (updated)
app.get('/auth/user', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  // Send user details
  const { name, profilePicture, email } = req.session.user;
  res.status(200).json({ name, profilePicture, email });
});

// Google login routes
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

app.get(
  '/auth/google/callback', // Callback route for handling the response from Google
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successfully authenticated, redirect to user details route
    res.redirect('/user'); // Change this route to the correct frontend route
  }
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.use('/auth', authRoute);

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
