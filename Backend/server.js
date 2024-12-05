import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import './config/passport.js';
import session from 'express-session';
import authRoute from './routes/auth.js';
import crypto from 'crypto';

const app = express();

const secret = crypto.randomBytes(64).toString('hex');
// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(
  session({
    secret: secret, // Replace with a secure, randomly generated key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // Set to true if using HTTPS
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI) // Replace with your MongoDB URI
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes

app.use('/auth', authRoute);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
