import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();
import cors from 'cors';

// Initialize app
const app = express();
const __dirname = path.resolve();

// Configure CORS
app.use(cors({
  origin: 'https://pink-screen-frontend.vercel.app',  // Allow only your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify the allowed methods
  credentials: true,  // Allow cookies if necessary
  allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers
}));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve frontend from the `client/dist` folder
app.use(express.static(path.join(__dirname, '/client/dist')));

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Handle all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});
