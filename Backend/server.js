import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import './config/passport.js';
import session from 'express-session';
import authRoute from './routes/auth.js';

const app = express();
const corsOptions = {
  origin: 'http://localhost:3001', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST']
  // Allow cookies/sessions
};

app.use(cors(corsOptions));
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
