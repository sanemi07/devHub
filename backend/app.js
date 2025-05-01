import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';

dotenv.config();

const app = express();

// ✅ Apply middlewares BEFORE importing routes
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// ✅ Now import routes
import { connectDb } from './config/connectDb.js';
import userRouter from './routes/user.route.js';
import googleAuthRouter from "./routes/googleauth.route.js";
import profileRouter from './routes/profile.route.js';

// ✅ Register routes
app.use('/auth', googleAuthRouter);
app.use('/users', userRouter);
app.use('/profile', profileRouter);

connectDb();

export default app;
