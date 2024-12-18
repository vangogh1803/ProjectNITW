import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import './config/passport.js';
import session from 'express-session';
import authRoute from './routes/auth.js';
import { google } from 'googleapis';
import fs from 'fs'; // To load the JSON file


const app = express();
const corsOptions = {
  origin: 'http://localhost:3001', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST']
  // Allow cookies/sessions
};
app.use(cors(corsOptions));
app.use(express.json()); // Enable parsing of JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

const serviceAccount = JSON.parse(
  fs.readFileSync('/Users/Niyati/ProjectNITW2/Backend/durable-surfer-443516-m1-4244c4c1802f.json', 'utf8')
);

const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/calendar']
  ),
});
//fetch event
app.get('/', async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID, // Store calendar ID in `.env`
      timeMin: new Date().toISOString(), //
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });
    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});
//add event
app.post('/api/events/', async (req, res) => {
  console.log('Incoming request body:', req.body); // Debug log

  const { summary, start, end } = req.body;

  if (!summary || !start || !end) {
    console.error('Missing required fields');
    return res.status(400).json({ message: 'Missing required fields: summary, start, or end' });
  }

  const event = {
    summary,
    start: {
      dateTime: start.dateTime,  // Directly use dateTime as a string, not inside an object
      timeZone: start.timeZone,  // Set the time zone correctly
    },
    end: {
      dateTime: end.dateTime,  // Directly use dateTime as a string, not inside an object
      timeZone: end.timeZone,  // Set the time zone correctly
    },
  };

  try {
    console.log('Event to be inserted:', event); // Debug log
    const response = await calendar.events.insert({
      calendarId: process.env.CALENDAR_ID,
      resource: event,
    });
    console.log('Google API Response:', response.data); // Log Google API response
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error adding event:', error.message);
    console.error('Google API Response:', error.response?.data || 'No response data');
    res.status(500).json({ message: 'Error adding event', error: error.message });
  }
});



// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3001', // Frontend URL
//   methods: ['GET', 'POST'],
//   credentials: true,
// }));

// app.use(
//   session({
//     secret: process.env.SECRET_KEY, // Replace with a secure, randomly generated key
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: true }, // Set to true if using HTTPS
//   })
// );
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // Should be `true` in production
    httpOnly: true,
    sameSite: 'None',  // For cross-origin requests
  },
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/user', (req, res) => {
  if (!req.user) {
    return res.status(401).send('User not authenticated');
  }
  res.json(req.user); // Send the authenticated user data
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI) // Replace with your MongoDB URI
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/auth', authRoute);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
// import cors from 'cors';
// import express from 'express';
// import mongoose from 'mongoose';
// import passport from 'passport';
// import dotenv from 'dotenv';
// dotenv.config();
// import './config/passport.js';
// import session from 'express-session';
// import authRoute from './routes/auth.js';
// //import authCalender from './routes/authCalender.js';


// const app = express();
// const corsOptions = {
//   origin: 'http://localhost:3001/events', // Frontend URL
//   credentials: true,
//   methods: ['GET', 'POST']
//   // Allow cookies/sessions
// };

// app.use(cors(corsOptions));
// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3001', // Frontend URL
//   methods: ['GET', 'POST'],
//   credentials: true,
// }));

// app.use(
//   session({
//     secret: process.env.SECRET_KEY, // Replace with a secure, randomly generated key
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: true }, // Set to true if using HTTPS
//   })
// );
// app.use(session({
//   secret: process.env.SECRET_KEY,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',  // Should be `true` in production
//     httpOnly: true,
//     sameSite: 'None',  // For cross-origin requests
//   },
// }));
// app.use(express.json());
// app.use(passport.initialize());
// app.use(passport.session());
// app.get('/auth/user', (req, res) => {
//   if (!req.user) {
//     return res.status(401).send('User not authenticated');
//   }
//   res.json(req.user); // Send the authenticated user data
// });

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI) // Replace with your MongoDB URI
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.error('Error connecting to MongoDB:', err));

// // Routes

// app.use('/auth', authRoute);
// //app.use('/authCalender', authCalender);
// const port = process.env.PORT || 5001;
// app.listen(port, () => console.log(`Server running on port ${port}`));

