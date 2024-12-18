import express from 'express';
import { google } from 'googleapis';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import fs from 'fs'; // To load the JSON file

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3001', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// Session Configuration
app.use(
  session({
    secret: process.env.SECRET_KEY || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set `true` for HTTPS in production
      httpOnly: true,
      sameSite: 'None',
    },
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Load Google Service Account
const serviceAccount = JSON.parse(
  fs.readFileSync('/Users/Niyati/ProjectNITW2/Backend/durable-surfer-443516-m1-4244c4c1802f.json', 'utf8')
);

// Initialize Google Calendar API
const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/calendar']
  ),
});

// Routes
app.get('/api/events', async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID, // Store calendar ID in `.env`
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});

app.post('/api/events', async (req, res) => {
  const { summary, start, end } = req.body;
  const event = {
    summary,
    start: { dateTime: start, timeZone: 'Asia/Kolkata' },
    end: { dateTime: end, timeZone: 'Asia/Kolkata' },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: process.env.CALENDAR_ID,
      resource: event,
    });
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).send('Error adding event');
  }
});

// Health check
app.get('/', (req, res) => res.send('Server is running successfully'));

// Start Server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

export default app;
