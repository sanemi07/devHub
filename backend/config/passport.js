import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../model/user.model.js';
import crypto from 'crypto';

import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });
        
        if (!user) {
          const randomPassword = crypto.randomBytes(20).toString('hex');
          user = await User.create({
            userName: profile.displayName,
            email: email,
            googleId: profile.id,
            profilePic: profile.photos[0].value,
            password:randomPassword
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
