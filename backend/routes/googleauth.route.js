import { Router } from 'express';
import passport from 'passport';
import '../config/passport.js'; // make sure this runs
const router = Router();

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  async (req, res) => {
    const user = req.user;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({user,message:"user logged in succesfully"}) // adjust to your frontend
  }
);

export default router;
